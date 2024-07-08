import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';
import WalletSelection from 'components/selection/WalletSelection';

function SavingDoneModal({ onUpdateSaving, open, onClose, savingId }) {
    const currency = localStorage.getItem('currency');
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState(0);

    const [formData, setFormData] = useState({
        walletId: "",
        userId: localStorage.getItem('userId'),
        description: ""
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdateSaving = (updatedSavings) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onUpdateSaving(updatedSavings);
    };

    const handleCreatePaySaving = () => {
        console.log(formData);

        if (!formData.walletId) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("post", `/savings/done/${savingId}`, (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                walletId: "",
                userId: localStorage.getItem('userId'),
                description: ""
            });
            onClose();
            handleUpdateSaving(res.data);
        }, (error) => {
            console.error("Error done saving:", error);
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
                    pt: 2,
                    pb: 2,
                    pl: 4,
                    pr: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h5" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Hoàn tất khoản tiết kiệm
                </Typography>
                <FormControl fullWidth sx={{ mb: 1, maxWidth: 250 }}>
                    <InputLabel htmlFor="walletId">Wallet Selection</InputLabel>
                    <WalletSelection onSelect={handleWalletSendingSelect}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        Please fill in all required fields.
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Các trường nhập dữ liệu khác */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreatePaySaving}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                    >
                        Done Saving
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SavingDoneModal;