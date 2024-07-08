import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletSelection from 'components/selection/WalletSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';

function UpdateWalletExchangeModal({ onUpdateExchange, open, onClose, exchangeId }) {
    const currency = localStorage.getItem('currency');
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        walletId: "",
        destinationId: "",
        exchangeTypeId: "wallet_wallet",
        from: "",
        to: "",
        exchangeDate: null,
        description: "",
        amount: 0,
        repeatTimeUnit: 0,
        repeatNumberPerUnit: 0,
        repeatNumber: 0,
        alarmDate: "0",
        category: null,
        imageUrl: null
    });
    const options = Array.from({ length: 11 }, (_, i) => i);
    const [warning, setWarning] = useState(false);
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [warningOverAmount, setWarningOverAmount] = useState('');
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState();
    const [oldAmount, setOldAmount] = useState(0);
    const [oldWalletId, setOldWalletId] = useState('');

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'amount' && value > currentWalletSendingAmount) {
            setWarningOverAmount(`The amount exceeds the current wallet sending balance: ${value} > ${currentWalletSendingAmount}`);
        } else {
            setWarningOverAmount('');
        }
    };

    const handleUpdateExchange = (updatedExchanges) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onUpdateExchange(updatedExchanges);
    };

    const handleDateChange = (date) => {
        console.log(date);
        setFormData({
            ...formData,
            exchangeDate: date
        });
    };

    const handleCreateExchange = () => {
        console.log(formData);
        if (formData.walletId === formData.destinationId) {
            setWarning(true);
            setTimeout(() => {
                setWarning(false);
            }, 3000);
            return;
        }
        if (!formData.walletId || !formData.destinationId || !formData.exchangeDate || !formData.amount) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/exchanges/${exchangeId}`, (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                userId: localStorage.getItem('userId'),
                walletId: "",
                destinationId: "",
                exchangeTypeId: "wallet_wallet",
                from: "",
                to: "",
                exchangeDate: null,
                description: "",
                amount: 0,
                repeatTimeUnit: 0,
                repeatNumberPerUnit: 0,
                repeatNumber: 0,
                alarmDate: "0",
                category: null,
                imageUrl: null
            });
            onClose();
            handleUpdateExchange(res.data);
        }, (error) => {
            console.error("Error creating wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        onClose();
    };
    const handleWalletSendingSelect = (walletId, walletAmount) => {
        setFormData({
            ...formData,
            walletId: walletId
        });

        if(walletId === oldWalletId){
            setCurrentWalletSendingAmount(walletAmount + oldAmount);
        } else {
            setCurrentWalletSendingAmount(walletAmount);
        }
    };
    const handleWalletReceivingSelect = (destinationId) => {
        setFormData({
            ...formData,
            destinationId: destinationId
        });
    };

    useEffect(() => {
        request("get", `/exchanges/${exchangeId}`, (res) => {
            console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                destinationId: res.data.destinationId,
                amount: res.data.amount,
                walletId: res.data.wallet.walletId,
                exchangeDate: dayjs(res.data.exchangeDate),
                // category: res.data.category,
                description: res.data.description,
            }));

            setOldAmount(res.data.amount);
            setOldWalletId(res.data.wallet.walletId);
        }).then();
    }, [])

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    pt: 2,
                    pb: 2,
                    pl: 4,
                    pr: 4,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Wallet Exchange
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="walletId" sx={{ marginBottom: '4px' }}>Wallet Sending</InputLabel>
                    <WalletAcceptSendingSelection onSelect={handleWalletSendingSelect} initialWalletId={formData.walletId}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="destinationId" sx={{ marginBottom: '4px' }}>Wallet Receiving</InputLabel>
                    <WalletSelection onSelect={handleWalletReceivingSelect} initialWalletId={formData.destinationId}/>
                </FormControl>
                {warning && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        Wallet Sending and Receiving must be different.
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input tabIndex={1} id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                {warningOverAmount && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        {warningOverAmount}
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Exchange Date"
                            value={formData.exchangeDate}
                            onChange={handleDateChange}
                            textField={(params) => <Input {...params} />}
                            maxDate={dayjs()}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input tabIndex={2} id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        Please fill in all required fields.
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        variant="contained"
                        color="info"
                        onClick={handleCreateExchange}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        disabled={warningOverAmount !== ''}
                        tabIndex={3}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateWalletExchangeModal;