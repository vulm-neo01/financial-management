import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';
import WalletSelection from 'components/selection/WalletSelection';

function DebtPayModal({ onUpdateDebt, open, onClose, debtId }) {
    const currency = localStorage.getItem('currency');
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState(0);
    const [warningOverAmount, setWarningOverAmount] = useState('');

    const [formData, setFormData] = useState({
        walletId: "",
        exchangeTypeId: "",
        amount: 0,
        description: ""
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'amount' && value > currentWalletSendingAmount) {
            setWarningOverAmount(`The amount exceeds the current wallet sending balance: ${value.toLocaleString()} > ${currentWalletSendingAmount.toLocaleString()}`);
        } else {
            setWarningOverAmount('');
        }
    };

    const handleUpdateDebt = (updatedDebt) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onUpdateDebt(updatedDebt);
    };

    const handleCreatePayLoan = () => {
        console.log(formData);

        if (!formData.walletId || !formData.amount) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("post", `/loan-debt/debt/pay/${debtId}`, (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                walletId: "",
                exchangeTypeId: "",
                amount: 0,
                description: ""
            });
            onClose();
            handleUpdateDebt(res.data);
        }, (error) => {
            console.error("Error pay debt:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        onClose();
    };

    const handleWalletSendingSelect = (walletId, walletAmount) => {
        setFormData({
            ...formData,
            walletId: walletId
        });
        setCurrentWalletSendingAmount(walletAmount);
    };

    useEffect(() => {
        // request("get", `/savings/category`, (res) => {
        //     const category = res.data;
        //     const sortedCategories = category.sort((a, b) => {
        //         if (a.name < b.name) return -1;
        //         if (a.name > b.name) return 1;
        //         return 0;
        //     });
        //     setBudgetCategories(sortedCategories);
        // }).then();
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
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h4" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Trả một phần tiền vay
                </Typography>
                <FormControl fullWidth sx={{ mb: 2, maxWidth: 250 }}>
                    <InputLabel htmlFor="walletId">Wallet Selection</InputLabel>
                    <WalletAcceptSendingSelection onSelect={handleWalletSendingSelect}/>
                </FormControl>
                {warningOverAmount && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {warningOverAmount}
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Please fill in all required fields.
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Các trường nhập dữ liệu khác */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreatePayLoan}
                        style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                        disabled={warningOverAmount !== ''}
                    >
                        Pay Debt
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default DebtPayModal;