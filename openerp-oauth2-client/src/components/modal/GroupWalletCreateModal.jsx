import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';

function GroupWalletCreateModal({ onCreateWallet, open, onClose }) {
    const currency = localStorage.getItem('currency');
    const [formData, setFormData] = useState({
        ownerId: localStorage.getItem('userId'),
        groupName: '',
        amount: 0.0,
        logoId: '',
        description: ''
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdateWalletData = (updatedWallets) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateWallet(updatedWallets);
    };

    const handleCreateWallet = () => {
        console.log(formData);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("post", "/group/wallets", (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                ownerId: localStorage.getItem('userId'),
                groupName: '',
                amount: 0.0,
                logoId: '',
                description: ''
            });
            onClose();
            handleUpdateWalletData(res.data);
        }, (error) => {
            console.error("Error creating group wallet:", error);
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
                    Tạo Ví nhóm mới
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="groupName">Group Name</InputLabel>
                    <Input id="groupName" name="groupName" value={formData.groupName} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 2 }}>
                    <InputLabel htmlFor="logoId" sx={{ marginBottom: '8px' }}>Select Logo</InputLabel>
                    <LogoSelection onSelect={handleLogoSelect} type="all" logoId={formData.logoId} />
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateWallet}
                        style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default GroupWalletCreateModal;