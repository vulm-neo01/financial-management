import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';

const GroupBudgetUpdateModal = ({ onCreateBudget, open, onClose, groupWalletId, groupBudgetId }) => {
    const currency = localStorage.getItem('currency');
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [formData, setFormData] = useState({
        createdUserId: localStorage.getItem('userId'),
        groupWalletId: groupWalletId,
        name: '',
        type: '',
        limitAmount: 0.0,
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

    const handleUpdateBudgetData = (updatedBudgets) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateBudget(updatedBudgets);
    };

    const handleUpdateBudget = () => {
        // console.log(formData);
        if (!formData.name || !formData.type || !formData.limitAmount || !formData.logoId) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/group/budgets/${groupBudgetId}`, (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                createdUserId: localStorage.getItem('userId'),
                groupWalletId: groupWalletId,
                name: '',
                type: '',
                limitAmount: 0.0,
                logoId: '',
                description: ''
            });
            onClose();
            handleUpdateBudgetData(res.data);
        }, (error) => {
            console.error("Error updating Budget:", error);
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

    useEffect(() => {
        request("get", `/group/budgets/${groupBudgetId}`, (res) => {
            console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                name: res.data.name,
                type: res.data.type,
                limitAmount: res.data.limitAmount,
                logoId: res.data.logo?.logoId || "",
                description: res.data.description,
            }));
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
                    Update {formData.type === "income" ? "Income" : "Spend"} Budget
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="name">Name*</InputLabel>
                    <Input tabIndex={1} id="name" name="name" value={formData.name} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 2 }}>
                    <InputLabel htmlFor="logoId" sx={{ marginBottom: '4px' }}>Select Logo*</InputLabel>
                    <Button sx={{p:0, m:0}} tabIndex={2}>

                    </Button>
                    <LogoSelection onSelect={handleLogoSelect} type="budget" logoId={formData.logoId} />
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="limitAmount">Limit Amount*</InputLabel>
                    <Input tabIndex={3} id="limitAmount" name="limitAmount" value={formData.limitAmount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <Input tabIndex={4} id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Please fill in all required fields.
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateBudget}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        tabIndex={5}
                    >
                        Create Budget
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default GroupBudgetUpdateModal;