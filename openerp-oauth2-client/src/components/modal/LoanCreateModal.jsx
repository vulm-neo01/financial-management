import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import ColorSelection from 'components/selection/ColorSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Label } from 'recharts';
import WalletAcceptSendingSelection from 'components/selection/WalletAcceptSendingSelection';

function LoanCreateModal({ onCreateLoan, open, onClose }) {
    const currency = localStorage.getItem('currency');
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState();
    const [warningOverAmount, setWarningOverAmount] = useState('');

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

        if (name === 'originAmount' && value > currentWalletSendingAmount) {
            setWarningOverAmount(`The amount exceeds the current wallet sending balance: ${value.toLocaleString()} > ${currentWalletSendingAmount.toLocaleString()}`);
        } else {
            setWarningOverAmount('');
        }
    };

    const handleCheckBoxChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUpdateLoans = (updatedLoans) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateLoan(updatedLoans);
    };

    const handleCreateLoan = () => {
        console.log(formData);

        if (!formData.name || !formData.colorId || !formData.startDate || !formData.originAmount 
            || !formData.returnDate || !formData.type) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("post", "/loan-debt/loan", (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
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
            handleUpdateLoans(res.data);
        }, (error) => {
            console.error("Error creating loans:", error);
            // Xử lý lỗi nếu cần thiết
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
                <Typography variant="h4" id="modal-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Tạo Khoản cho vay mới - Loan
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="name">Name *</InputLabel>
                    <Input tabIndex={1} id="name" name="name" value={formData.name} onChange={handleFormChange} />
                </FormControl>
                <Box sx={{ mb: 1 }}>
                    <InputLabel htmlFor="colorId" sx={{ marginBottom: '4px' }}>Color *</InputLabel>
                    <ColorSelection onSelect={handleColorSelect} type="all" colorId={formData.colorId} />
                </Box>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="originAmount">Origin Amount</InputLabel>
                    <Input tabIndex={2} id="originAmount" name="originAmount" value={formData.originAmount} onChange={handleFormChange} endAdornment={currency}/>
                </FormControl>
                {warningOverAmount && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        {warningOverAmount}
                    </Typography>
                )}
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                id="isCreateExchange"
                                name="isCreateExchange"
                                checked={formData.isCreateExchange}
                                onChange={handleCheckBoxChange}
                            />
                        }
                        label="Tạo giao dịch liên kết đến Ví?"
                    />
                </FormControl>
                {formData.isCreateExchange &&
                    <FormControl fullWidth sx={{ mb: 1, maxWidth: 250 }}>
                        <InputLabel htmlFor="walletId">Wallet Selection</InputLabel>
                        <WalletAcceptSendingSelection onSelect={handleWalletSendingSelect} />
                    </FormControl>
                }
                <FormControl fullWidth sx={{ mb: 1 }}>
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
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Return Date *"
                            value={formData.returnDate}
                            onChange={handleReturnDateChange}
                            textField={(params) => <Input {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="type">Loại vay *</InputLabel>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        tabIndex={3}
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
                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <InputLabel htmlFor="interestRate">Lãi suất/năm</InputLabel>
                            <Input tabIndex={4} id="interestRate" name="interestRate" value={formData.interestRate} onChange={handleFormChange} endAdornment="%"/>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <InputLabel htmlFor="receiveInterestTime">Khoảng thời gian nhận lãi</InputLabel>
                            <Select
                                id="receiveInterestTime"
                                name="receiveInterestTime"
                                value={formData.receiveInterestTime}
                                onChange={handleFormChange}
                                tabIndex={5}
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
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel htmlFor="name">Description</InputLabel>
                    <Input tabIndex={6} id="description" name="description" value={formData.description} onChange={handleFormChange} />
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
                        onClick={handleCreateLoan}
                        style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}
                        disabled={warningOverAmount !== ''}
                        tabIndex={7}
                    >
                        Create Loan
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default LoanCreateModal;