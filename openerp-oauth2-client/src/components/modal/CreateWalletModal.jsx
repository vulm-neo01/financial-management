import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';
import ColorSelection from 'components/selection/ColorSelection';

function CreateWalletModal({ onCreateWallet, open, onClose }) {
    const currency = localStorage.getItem('currency');
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        name: '',
        type: '',
        amount: 0.0,
        logoId: '',
        colorId: '',
        includeInTotalAmount: true,
        description: ''
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleIncludeInTotalChange = (e) => {
        const { checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            includeInTotalAmount: checked
        }));
    };

    const handleUpdateWalletData = (updatedWallets) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateWallet(updatedWallets);
    };

    const handleCreateWallet = () => {
        console.log(formData);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("post", "/wallet/create", (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
            userId: localStorage.getItem('userId'),
            name: '',
            type: '',
            amount: 0.0,
            logoId: '',
            colorId: '',
            includeInTotalAmount: true,
            description: ''
            });
            onClose();
            handleUpdateWalletData(res.data);
        }, (error) => {
            console.error("Error creating wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        onClose();
    };
    const handleLogoSelect = (logoId) => {
        setFormData({
            ...formData,
            logoId: logoId
        });
    };

    const handleColorSelect = (colorId) => {
        setFormData({
            ...formData,
            colorId: colorId
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
                    Tạo ví mới
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <Input tabIndex={1} id="name" name="name" value={formData.name} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 1 }}>
                    <InputLabel htmlFor="logoId" sx={{ marginBottom: '4px' }}>Select Logo</InputLabel>
                    <Button tabIndex={2} sx={{p:0, m:0}}>
                        <LogoSelection onSelect={handleLogoSelect} type="wallet" logoId={formData.logoId} />
                    </Button>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <InputLabel htmlFor="colorId" sx={{ marginBottom: '4px' }}>Color</InputLabel>
                    <ColorSelection onSelect={handleColorSelect} type="all" colorId={formData.colorId} />
                </Box>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="type">Wallet Type</InputLabel>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        tabIndex={3}
                    >
                        <MenuItem value="cash">Cash Wallet</MenuItem>
                        <MenuItem value="e-wallet">E-Wallet</MenuItem>
                        <MenuItem value="bank-account">Bank Account</MenuItem>
                        <MenuItem value="credit">Credit Card</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input tabIndex={4} id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="name">Description</InputLabel>
                    <Input tabIndex={5} id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControlLabel
                        label="Include in Total Amount?"
                        control={
                            <Checkbox
                                checked={formData.includeInTotalAmount}
                                onChange={handleIncludeInTotalChange}
                                name="includeInTotalAmount"
                                tabIndex={6}
                            />
                        }
                    />
                    {/* Các trường nhập dữ liệu khác */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateWallet}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        tabIndex={7}
                    >
                        Create Wallet
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateWalletModal;
