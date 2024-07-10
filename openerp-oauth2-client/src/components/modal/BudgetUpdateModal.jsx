import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';

const BudgetUpdateModal = ({ onUpdateBudget, open, onClose, budgetId, typeOptions, title }) => {
    const currency = localStorage.getItem('currency');
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
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
        onUpdateBudget(updatedBudgets);
    };

    const handleUpdateBudget = () => {
        if (!formData.name || !formData.type || !formData.limitAmount || !formData.logoId) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        request("patch", `/budgets/${budgetId}`, (res) => {
            // console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                userId: localStorage.getItem('userId'),
                name: '',
                type: '',
                limitAmount: 0.0,
                logoId: '',
                description: ''
            });
            onClose();
            handleUpdateBudgetData(res.data);
        }, (error) => {
            console.error("Error creating Budget:", error);
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
        request("get", `/budgets/${budgetId}`, (res) => {
            // console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                name: res.data.name,
                type: res.data.type,
                limitAmount: res.data.budgetLimitHistories[0]?.limitAmount || 0,
                logoId: res.data.logo.logoId,
                description: res.data.description
            }));
            // console.log(formData);
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
                    {title}
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="name">Name*</InputLabel>
                    <Input tabIndex={1} id="name" name="name" value={formData.name} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 1 }}>
                    <InputLabel htmlFor="logoId" sx={{ marginBottom: '4px' }}>Select Logo*</InputLabel>
                    <Button tabIndex={2} sx={{p:0, m:0}}>
                        <LogoSelection onSelect={handleLogoSelect} type="budget" logoId={formData.logoId} />

                    </Button>
                </Box>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="type">Budget Type*</InputLabel>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        tabIndex={3}
                    >
                        {typeOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="limitAmount">Limit Amount*</InputLabel>
                    <Input tabIndex={4} id="limitAmount" name="limitAmount" value={formData.limitAmount || 0} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="name">Description</InputLabel>
                    <Input tabIndex={5} id="description" name="description" value={formData.description} onChange={handleFormChange} />
                </FormControl>
                {warningSubmit && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        Please fill in all required fields.
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateBudget}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        tabIndex={6}
                    >
                        Update Budget
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export const BudgetUpdateIncomeModal = (props) => {
    const typeOptions = [
        { value: 'income', label: 'Thu nhập' }
    ];

    return (
        <BudgetUpdateModal
            {...props}
            typeOptions={typeOptions}
            title="Update Income Budget"
        />
    );
};

export const BudgetUpdateSpendModal = (props) => {
    const typeOptions = [
        { value: 'food_drink', label: 'Các khoản cho ăn uống' },
        { value: 'shopping', label: 'Mua sắm' },
        { value: 'entertainment', label: 'Giải trí' },
        { value: 'study', label: 'Học tập, phát triển' },
        { value: 'family', label: 'Gia đình' },
        { value: 'healthcare', label: 'Chăm sóc sức khỏe' },
        { value: 'travel', label: 'Du lịch, nghỉ dưỡng' },
        { value: 'house', label: 'Nhà cửa' },
        { value: 'transport', label: 'Đi lại, di chuyển' },
        { value: 'pet', label: 'Thú cưng' },
        { value: 'another', label: 'Other' }
    ];

    return (
        <BudgetUpdateModal
            {...props}
            typeOptions={typeOptions}
            title="Update Spend Budget"
        />
    );
};
