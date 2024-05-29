import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, IconButton, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletSelection from 'components/selection/WalletSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';

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

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
            const imageData = new FormData();
            imageData.append('image', image); // Append the selected file
            console.log(imageData);
            setIsUploading(true)

            const imageUploadResponse = await request("post", "/exchanges/image", () => {
                console.log("success")
            }, (err) => {
                console.log("failure: " + err)
            }, imageData);
            console.log(imageUploadResponse.data);
            const updatedFormData = {
                ...formData,
                imageUrl: imageUploadResponse.data, // Assuming the response contains an 'url' property
            };

            console.log(updatedFormData);

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
        // Gửi dữ liệu lên cơ sở dữ liệu
        // request("post", "/exchanges/image", (res) => {
        //     console.log(res.data);
        //     setFormData({
        //         ...formData,
        //         imageUrl: res.data
        //     });
        // }, (error) => {
        //     console.error("Error upload image:", error);
        //     // Xử lý lỗi nếu cần thiết
        // }, imageData);
    };
    const handleWalletSendingSelect = (walletId) => {
        setFormData({
            ...formData,
            walletId: walletId
        });
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
                    p: 4,
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Wallet To Wallet
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="walletId" sx={{ marginBottom: '8px' }}>Wallet Sending</InputLabel>
                    <WalletSelection onSelect={handleWalletSendingSelect}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="destinationId" sx={{ marginBottom: '8px' }}>Wallet Receiving</InputLabel>
                    <WalletSelection onSelect={handleWalletReceivingSelect}/>
                </FormControl>
                {warning && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Wallet Sending and Receiving must be different.
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Exchange Date"
                            value={formData.exchangeDate}
                            onChange={handleDateChange}
                            textField={(params) => <Input {...params} />}
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
                        color="primary"
                        onClick={handleCreateExchange}
                        style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateExchangeWallet;
