import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import ColorSelection from 'components/selection/ColorSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function DebtUpdateModal({ onUpdateDebt, open, onClose, debtId }) {
    const currency = localStorage.getItem('currency');
    const [warningSubmit, setWarningSubmit] = useState(false);

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        isCreateExchange: false,
        walletId: "",
        name: "",
        originAmount: 0,
        interestRate: 0,
        colorId: "",
        description: "",
        type: "NO_INTEREST",
        receiveInterestTime: "EMPTY",
        startDate: null,
        returnDate: null
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdateDebt = (updatedDebt) => {
        onUpdateDebt(updatedDebt);
    };

    const handleCreateDebt = () => {
        // console.log(formData);

        if (!formData.name || !formData.colorId || !formData.startDate || !formData.originAmount 
            || !formData.returnDate || !formData.type) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/loan-debt/debt/${debtId}`, (res) => {
            // console.log(res.data);
            setFormData({
                userId: localStorage.getItem('userId'),
                isCreateExchange: false,
                walletId: "",
                name: "",
                originAmount: 0,
                interestRate: 0,
                colorId: "",
                description: "",
                type: "NO_INTEREST",
                receiveInterestTime: "EMPTY",
                startDate: "",
                returnDate: ""
            });
            onClose();
            handleUpdateDebt(res.data);
        }, (error) => {
            console.error("Error updating debt:", error);
        }, formData);
        onClose();
    };

    const handleColorSelect = (colorId) => {
        setFormData({
            ...formData,
            colorId: colorId
        });
    };

    const handleReturnDateChange = (date) => {
        setFormData({
            ...formData,
            returnDate: date
        });
    };

    const handleStartDateChange = (date) => {
        setFormData({
            ...formData,
            startDate: date
        });
    };

    useEffect(() => {
        request("get", `/loan-debt/debt/${debtId}`, (res) => {
            // console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                name: res.data.name,
                originAmount: res.data.originAmount,
                interestRate: res.data.interestRate,
                type: res.data.type,
                colorId: res.data.color && res.data.color.colorId,
                description: res.data.description,
                receiveInterestTime: res.data.receiveInterestTime,
                startDate: dayjs(res.data.startDate),
                returnDate: dayjs(res.data.returnDate),
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
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h4" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Update khoản vay
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="name">Name *</InputLabel>
                    <Input id="name" name="name" value={formData.name} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 2 }}>
                    <InputLabel htmlFor="colorId" sx={{ marginBottom: '8px' }}>Color *</InputLabel>
                    <ColorSelection onSelect={handleColorSelect} type="all" colorId={formData.colorId} />
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="originAmount">Origin Amount</InputLabel>
                    <Input id="originAmount" name="originAmount" value={formData.originAmount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date *"
                            value={formData.startDate}
                            onChange={handleStartDateChange}
                            textField={(params) => <Input {...params} />}
                            maxDate={dayjs()}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Return Date *"
                            value={formData.returnDate}
                            onChange={handleReturnDateChange}
                            textField={(params) => <Input {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="type">Loại vay *</InputLabel>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                    >
                        <MenuItem value="NO_INTEREST">Không có lãi</MenuItem>
                        <MenuItem value="SIMPLE_INTEREST">Lãi đơn</MenuItem>
                        {/* <MenuItem value="INTEREST_RETURN_WALLET">Lãi đơn trả trực tiếp về Wallet</MenuItem> */}
                        <MenuItem value="COMPOUND">Lãi kép không tích lũy</MenuItem>
                        {/* <MenuItem value="ACCUMULATE_COMPOUND">Lãi kép có tích lũy</MenuItem> */}
                    </Select>
                </FormControl>
                {(formData.type !== "NO_INTEREST") && (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="interestRate">Lãi suất/năm</InputLabel>
                            <Input id="interestRate" name="interestRate" value={formData.interestRate} onChange={handleFormChange} endAdornment="%"/>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="receiveInterestTime">Khoảng thời gian nhận lãi</InputLabel>
                            <Select
                                id="receiveInterestTime"
                                name="receiveInterestTime"
                                value={formData.receiveInterestTime}
                                onChange={handleFormChange}
                            >
                                <MenuItem value="EMPTY">Trống</MenuItem>
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
                        onClick={handleCreateDebt}
                        style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                    >
                        Update Debt
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default DebtUpdateModal;