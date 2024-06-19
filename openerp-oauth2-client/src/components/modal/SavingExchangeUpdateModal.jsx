import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, IconButton, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletSelection from 'components/selection/WalletSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SavingSelection from 'components/selection/SavingSelection';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SavingAcceptChangeSelection from 'components/selection/SavingAcceptChangeSelection';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';
import CircularProgress from '@mui/material/CircularProgress';

function SavingUpdateExchangeModal({ onUpdateExchange, open, onClose, exchangeId }) {
    const currency = localStorage.getItem('currency');
    const [exchangeType, setExchangeType] = useState('wallet_saving');
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedSavingStartDate, setSelectedSavingStartDate] = useState(null);
    const [warningOverAmount, setWarningOverAmount] = useState('');
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState();
    const [oldAmount, setOldAmount] = useState(0);
    const [oldWalletId, setOldWalletId] = useState('');

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        walletId: "",
        destinationId: "",
        exchangeTypeId: "wallet_saving",
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
        imageUrl: ""
    });
    const options = Array.from({ length: 11 }, (_, i) => i);
    const [warningSubmit, setWarningSubmit] = useState(false);
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

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    const handleDateChange = (date) => {
        console.log(date);
        const today = dayjs();
        const start = dayjs(selectedSavingStartDate);

        if (date.isBefore(start) || date.isAfter(today)) {
            alert(`Please select a date between ${start.format('YYYY-MM-DD')} and ${today.format('YYYY-MM-DD')}.`);
            return;
        }

        setFormData({
            ...formData,
            exchangeDate: date
        });
    };

    const handleCreateExchange = async () => {
        console.log(formData);
        if (!formData.walletId || !formData.destinationId || !formData.exchangeDate || !formData.amount) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
                
        try {
            let updatedFormData = { ...formData };
            if(image){
                const imageData = new FormData();
                imageData.append('image', image); // Append the selected file
                console.log(imageData);
                setIsUploading(true)
    
                const imageUploadResponse = await request("post", "/exchanges/image", () => {
                    // console.log("success")
                }, (err) => {
                    console.log("failure: " + err)
                }, imageData);
                console.log(imageUploadResponse.data);
                updatedFormData = {
                    ...formData,
                    imageUrl: imageUploadResponse.data, // Assuming the response contains an 'url' property
                };
                setImage(null);
            }

            console.log(updatedFormData);

            const formUploadResponse = await request("patch", `/exchanges/${exchangeId}`, () => {
                console.log("success")
            }, (err) => {
                console.log("failure: " + err)
            }, updatedFormData);
            // console.log(formUploadResponse.data);
            setFormData({
                userId: localStorage.getItem('userId'),
                walletId: "",
                destinationId: "",
                exchangeTypeId: "wallet_saving",
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
                imageUrl: ""
            });
            onClose();
            handleUpdateExchange(formUploadResponse.data);
            setIsUploading(false);
        } catch (error) {
            console.error("Error creating saving exchange:", error);
            setIsUploading(false);
            alert("Error uploading!");
            setFormData({
                userId: localStorage.getItem('userId'),
                walletId: "",
                destinationId: "",
                exchangeTypeId: "wallet_saving",
                from: "",
                to: "",
                exchangeDate: null,
                description: "",
                amount: 0,
                repeatTimeUnit: 0,
                repeatNumberPerUnit: 0,
                repeatNumber: 0,
                alarmDate: "0",
                category: "",
                imageUrl: ""
            });
            onClose();
        }
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

    const handleWalletReceivingSelect = (walletId) => {
        setFormData({
            ...formData,
            walletId: walletId
        });
    };

    const handleSavingSelect = (savingId, startDate) => {
        setFormData({
            ...formData,
            destinationId: savingId
        });

        setSelectedSavingStartDate(startDate);
    };

    useEffect(() => {
        request("get", `/exchanges/${exchangeId}`, (res) => {
            // console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                destinationId: res.data.destinationId,
                amount: res.data.amount,
                walletId: res.data.wallet.walletId,
                exchangeDate: dayjs(res.data.exchangeDate),
                // category: res.data.category,
                description: res.data.description,
                exchangeTypeId: res.data.exchangeType.exchangeTypeId,
                imageUrl: res.data.imageUrl
            }));
            setExchangeType(res.data.exchangeType.exchangeTypeId);
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
                    p: 4,
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Update {exchangeType === 'wallet_saving' ? 'Wallet - Saving' : 'Saving - Wallet'} Exchange
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2, maxWidth: 250 }}>
                        <InputLabel htmlFor="from">{exchangeType === 'wallet_saving' ? 'From Wallet' : 'From Saving'}</InputLabel>
                        {exchangeType === 'wallet_saving' ? (
                            <WalletAcceptSendingSelection onSelect={handleWalletSendingSelect} initialWalletId={formData.walletId} />
                        ) : (
                            <SavingSelection onSelect={handleSavingSelect} initialSavingId={formData.destinationId} />
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2, maxWidth: 250 }}>
                        <InputLabel htmlFor="to">{exchangeType === 'wallet_saving' ? 'To Saving' : 'To Wallet'}</InputLabel>
                        {exchangeType === 'wallet_saving' ? (
                            <SavingAcceptChangeSelection onSelect={handleSavingSelect} initialSavingId={formData.destinationId} />
                        ) : (
                            <WalletSelection onSelect={handleWalletReceivingSelect} initialWalletId={formData.walletId} />
                        )}
                    </FormControl>
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                {warningOverAmount && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {warningOverAmount}
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Exchange Date"
                            value={formData.exchangeDate}
                            onChange={handleDateChange}
                            textField={(params) => <Input {...params} />}
                            minDate={dayjs(selectedSavingStartDate)}
                            maxDate={dayjs()}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                background: "#DED022",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                ":hover": {
                                    background: "#D6C713",
                                },
                            }}
                        >
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                                encType="multipart/form-data"
                            />
                            Select Image
                        </Button>
                    </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Please fill in all required fields.
                    </Typography>
                )}
                {isUploading && 
                    <CircularProgress 
                        size={60} 
                        sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} 
                    />}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        variant="contained"
                        color="warning"
                        disabled={warningOverAmount !== ''}
                        onClick={handleCreateExchange}
                        style={{ fontSize: '1.3rem', marginTop: '1rem'}}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SavingUpdateExchangeModal;