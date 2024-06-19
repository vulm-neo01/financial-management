import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';
import ColorSelection from 'components/selection/ColorSelection';
import SavingCategorySelection from 'components/selection/SavingCategorySelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';

function SavingUpdateModal({ onCreateSaving, open, onClose, savingId }) {
    const currency = localStorage.getItem('currency');
    const [budgetCategories, setBudgetCategories] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        name: '',
        logoId: '',
        colorId: '',
        description: '',
        savingCategoryId: "",
        targetAmount: 0,
        originAmount: 0,
        interestRate: 0,
        targetDate: null,
        savingType: "NO_INTEREST",
        walletId: "",
        receiveInterestTime: "MONTHLY",
        startDate: null
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectCategory = (categoryId) => {
        setFormData({ ...formData, savingCategoryId: categoryId });
    };

    const handleUpdateSaving = (updatedSaving) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateSaving(updatedSaving);
    };

    const handleCreateSaving = () => {
        console.log(formData);

        if (!formData.name || !formData.logoId || !formData.savingType || !formData.savingCategoryId 
            || !formData.targetAmount || !formData.targetDate || !formData.startDate) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/savings/${savingId}`, (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                userId: localStorage.getItem('userId'),
                name: '',
                logoId: '',
                colorId: '',
                description: '',
                savingCategoryId: "",
                targetAmount: 0,
                originAmount: 0,
                interestRate: 0,
                targetDate: null,
                savingType: "NO_INTEREST",
                walletId: "",
                receiveInterestTime: "MONTHLY",
                startDate: null
            });
            onClose();
            handleUpdateSaving(res.data);
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

    const handleTargetDateChange = (date) => {
        setFormData({
            ...formData,
            targetDate: date
        });
    };

    const handleStartDateChange = (date) => {
        setFormData({
            ...formData,
            startDate: date
        });
    };

    const handleWalletSendingSelect = (walletId) => {
        setFormData({
            ...formData,
            walletId: walletId
        });
    };

    useEffect(() => {
        request("get", `/savings/category`, (res) => {
            const category = res.data;
            const sortedCategories = category.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setBudgetCategories(sortedCategories);
        }).then();

        request("get", `/savings/${savingId}`, (res) => {
            console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                name: res.data.name,
                savingCategoryId: res.data.savingCategory.savingCategoryId,
                targetAmount: res.data.targetAmount,
                originAmount: res.data.originAmount,
                interestRate: res.data.interestRate,
                savingType: res.data.savingType,
                logoId: res.data.logo.logoId,
                colorId: res.data.color && res.data.color.colorId,
                walletId: res.data.walletId,
                description: res.data.description,
                receiveInterestTime: res.data.receiveInterestTime,
                startDate: dayjs(res.data.startDate),
                targetDate: dayjs(res.data.targetDate),
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
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h4" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Update Saving
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="name">Name *</InputLabel>
                    <Input id="name" name="name" value={formData.name} onChange={handleFormChange} />
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
                            onClick={() => setCategoryModalOpen(true)}
                        >
                            Select Category *
                        </Button>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Selected Category: {formData.savingCategoryId && budgetCategories ? budgetCategories.find(category => category.savingCategoryId === formData.savingCategoryId)?.name || 'Category not found' : 'No category selected'}
                        </Typography>
                        <SavingCategorySelection
                            open={categoryModalOpen}
                            onClose={() => setCategoryModalOpen(false)}
                            onSelectCategory={handleSelectCategory}
                            savingCategories={budgetCategories}
                        />
                    </FormControl>
                <Box sx={{ mb: 2 }}>
                    <InputLabel htmlFor="logoId" sx={{ marginBottom: '8px' }}>Select Logo *</InputLabel>
                    <LogoSelection onSelect={handleLogoSelect} type="saving" logoId={formData.logoId} />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel htmlFor="colorId" sx={{ marginBottom: '8px' }}>Color</InputLabel>
                    <ColorSelection onSelect={handleColorSelect} type="all" colorId={formData.colorId} />
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="originAmount">Origin Amount</InputLabel>
                    <Input id="originAmount" name="originAmount" value={formData.originAmount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="targetAmount">Target Amount *</InputLabel>
                    <Input id="targetAmount" name="targetAmount" value={formData.targetAmount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                {/* <FormControl fullWidth sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date *"
                            value={formData.startDate}
                            onChange={handleStartDateChange}
                            textField={(params) => <Input {...params} />}
                            maxDate={dayjs()}
                        />
                    </LocalizationProvider>
                </FormControl> */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Target Date *"
                            value={formData.targetDate}
                            onChange={handleTargetDateChange}
                            textField={(params) => <Input {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="savingType">Saving Type *</InputLabel>
                    <Select
                        id="savingType"
                        name="savingType"
                        value={formData.savingType}
                        onChange={handleFormChange}
                    >
                        <MenuItem value="NO_INTEREST">Không có lãi</MenuItem>
                        <MenuItem value="SIMPLE_INTEREST">Lãi đơn</MenuItem>
                        {/* <MenuItem value="INTEREST_RETURN_WALLET">Lãi đơn trả trực tiếp về Wallet</MenuItem> */}
                        <MenuItem value="COMPOUND">Lãi kép không tích lũy</MenuItem>
                        <MenuItem value="ACCUMULATE_COMPOUND">Lãi kép có tích lũy</MenuItem>
                    </Select>
                </FormControl>
                {(formData.savingType !== "NO_INTEREST") && (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="interestRate">Interest Rate</InputLabel>
                            <Input id="interestRate" name="interestRate" value={formData.interestRate} onChange={handleFormChange} endAdornment="%"/>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="receiveInterestTime">Receive Interest Time</InputLabel>
                            <Select
                                id="receiveInterestTime"
                                name="receiveInterestTime"
                                value={formData.receiveInterestTime}
                                onChange={handleFormChange}
                            >
                                <MenuItem value="DAILY">Hàng ngày</MenuItem>
                                <MenuItem value="WEEKLY">Hàng tuần</MenuItem>
                                <MenuItem value="MONTHLY">Hàng tháng</MenuItem>
                                <MenuItem value="EVERY_TWO_MONTH">Mỗi 2 tháng</MenuItem>
                                <MenuItem value="EVERY_THREE_MONTH">Mỗi 3 tháng</MenuItem>
                                <MenuItem value="EVERY_SIX_MONTH">Mỗi 6 tháng</MenuItem>
                                <MenuItem value="YEARLY">Hàng năm</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}

                {/* {(formData.savingType === "INTEREST_RETURN_WALLET") && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="walletId">Wallet Receive Money</InputLabel>
                        <WalletAcceptSendingSelection onSelect={handleWalletSendingSelect} initialWalletId={formData.walletId} />
                    </FormControl>
                )} */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="name">Description</InputLabel>
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
                        onClick={handleCreateSaving}
                        style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                    >
                        Update Saving
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SavingUpdateModal;