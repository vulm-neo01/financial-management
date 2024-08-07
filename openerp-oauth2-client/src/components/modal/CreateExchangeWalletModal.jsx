import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, IconButton, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletSelection from 'components/selection/WalletSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';
import dayjs from 'dayjs';

function CreateExchangeWallet({ onCreateExchange, open, onClose }) {
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
        category: "",
        imageUrl: ""
    });
    const [warning, setWarning] = useState(false);
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [warningOverAmount, setWarningOverAmount] = useState('');
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState(null);

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
    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    const handleUpdateExchange = (updatedExchanges) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateExchange(updatedExchanges);
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            exchangeDate: date
        });
    };

    const handleCreateExchange = async () => {
        // console.log(formData);
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
        
        try {
            let updatedFormData = { ...formData };
            if(image){
                const imageData = new FormData();
                imageData.append('image', image); // Append the selected file
                // console.log(imageData);
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

            const formUploadResponse = await request("post", "/exchanges/new_exchange", () => {
                console.log("success")
            }, (err) => {
                console.log("failure: " + err)
            }, updatedFormData);
            console.log(formUploadResponse.data);
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
                category: "",
                imageUrl: ""
            });
            onClose();
            handleUpdateExchange(formUploadResponse.data);
            setIsUploading(false);
        } catch (error) {
            console.error("Error creating wallet exchange:", error);
            setIsUploading(false);
            alert("Error uploading!");
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
        setCurrentWalletSendingAmount(walletAmount);
    };

    const handleWalletReceivingSelect = (destinationId) => {
        setFormData({
            ...formData,
            destinationId: destinationId
        });
    };


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
                    Wallet To Wallet
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="walletId" sx={{ marginBottom: '4px' }}>Wallet Sending</InputLabel>
                    <WalletAcceptSendingSelection onSelect={handleWalletSendingSelect}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="destinationId" sx={{ marginBottom: '4px' }}>Wallet Receiving</InputLabel>
                    <WalletSelection onSelect={handleWalletReceivingSelect}/>
                </FormControl>
                {warning && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        Wallet Sending and Receiving must be different.
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency} tabIndex={1}/>
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
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            background: "#87CEFA",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            ":hover": {
                                background: "#87CEFA",
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
                            tabIndex={3}
                        />
                        Select Image
                    </Button>
                </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 1 }}>
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
                        color="primary"
                        onClick={handleCreateExchange}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        disabled={warningOverAmount !== ''}
                        tabIndex={4}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateExchangeWallet;
