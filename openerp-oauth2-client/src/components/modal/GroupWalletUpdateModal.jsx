import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';

function GroupWalletUpdateModal({ onCreateWallet, open, onClose, groupWalletId }) {
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

    const handleUpdateGroupWalletData = (updatedWallets) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateWallet(updatedWallets);
    };
    
    useEffect(() => {
        request("get", `/group/wallets/${groupWalletId}`, (res) => {
            setFormData(prevData => ({
                ...prevData,
                groupName: res.data.groupName,
                amount: res.data.amount,
                logoId: res.data.logo.logoId,
                description: res.data.description
            }));
        }).then();
    }, [groupWalletId])

    const handleCreateWallet = () => {
        console.log(formData);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/group/wallets/${groupWalletId}`, (res) => {
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
            handleUpdateGroupWalletData(res.data);
        }, (error) => {
            console.error("Error updating group wallet:", error);
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
                    pt: 2,
                    pb: 2,
                    pl: 4,
                    pr: 4,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Cập nhật Ví nhóm mới
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="groupName">Group Name</InputLabel>
                    <Input tabIndex={1} id="groupName" name="groupName" value={formData.groupName} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 1 }}>
                    <InputLabel htmlFor="logoId" sx={{ marginBottom: '4px' }}>Select Logo</InputLabel>
                    <Button sx={{p:0,m:0}} tabIndex={2}>
                        <LogoSelection onSelect={handleLogoSelect} type="all" logoId={formData.logoId} />
                    </Button>
                </Box>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <Input tabIndex={3} id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input tabIndex={4} id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateWallet}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        tabIndex={5}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default GroupWalletUpdateModal;
