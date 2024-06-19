import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletSelection from 'components/selection/WalletSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BudgetCategorySelection from 'components/selection/BudgetCategorySelection';
import dayjs from 'dayjs';

function UpdateSpendModal({ onUpdateExchange, open, onClose, exchangeId }) {
    const currency = localStorage.getItem('currency');
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        walletId: "",
        destinationId: "",
        exchangeTypeId: "spend",
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
    const options = Array.from({ length: 11 }, (_, i) => i);
    const [warning, setWarning] = useState(false);
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [budgetCategories, setBudgetCategories] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [currentWalletSendingAmount, setCurrentWalletSendingAmount] = useState();
    const [oldAmount, setOldAmount] = useState(0);
    const [oldWalletId, setOldWalletId] = useState('');
    const [warningOverAmount, setWarningOverAmount] = useState('');

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'amount' && value > currentWalletSendingAmount) {
            setWarningOverAmount(`The amount exceeds the current wallet sending balance: ${value} > ${currentWalletSendingAmount}`);
        } else {
            setWarningOverAmount('');
        }
    };

    const handleUpdateExchange = (updatedExchanges) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onUpdateExchange(updatedExchanges);
    };

    const handleDateChange = (date) => {
        console.log(date);
        setFormData({
            ...formData,
            exchangeDate: date
        });
    };

    const handleZoomImage = () => {
        setIsImageModalOpen(true);
    }

    const handleCreateExchange = () => {
        console.log(formData);
        if (!formData.walletId || !formData.to || !formData.exchangeDate || !formData.amount || !formData.category) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/exchanges/${exchangeId}`, (res) => {
            console.log(res.data);
            // Sau khi tạo xong, reset dữ liệu và đóng modal
            setFormData({
                userId: localStorage.getItem('userId'),
                walletId: "",
                destinationId: "",
                exchangeTypeId: "spend",
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
            handleUpdateExchange(res.data);
        }, (error) => {
            console.error("Error creating wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        onClose();
    };
    const handleWalletSendingSelect = (walletId, walletAmount) => {
        setFormData({
            ...formData,
            walletId: walletId
        });

        if(walletId === oldWalletId){
            setCurrentWalletSendingAmount(walletAmount + oldAmount);
        } else {
            setCurrentWalletSendingAmount(walletAmount);
        }
    };
    const handleSelectCategory = (categoryId) => {
        setFormData({ ...formData, category: categoryId });
    };

    useEffect(() => {
        request("get", `/exchanges/${exchangeId}`, (res) => {
            console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                to: res.data.to,
                amount: res.data.amount,
                walletId: res.data.wallet.walletId,
                exchangeDate: dayjs(res.data.exchangeDate),
                category: res.data.category.budgetCategoryId,
                description: res.data.description,
                imageUrl: res.data.imageUrl,
                walletId: res.data.wallet.walletId
            }));
            setOldAmount(res.data.amount);
            setOldWalletId(res.data.wallet.walletId);
        }).then();
        request("get", `/budgets/spend/${localStorage.getItem('userId')}`, (res) => {
            const category = res.data;
            console.log(category);
            const sortedCategories = category.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setBudgetCategories(sortedCategories);
        }).then();
    }, [])

    return (
        <>
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
                        Update Spend Exchange
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="walletId" sx={{ marginBottom: '8px' }}>Choose Wallet</InputLabel>
                        <WalletSelection onSelect={handleWalletSendingSelect} initialWalletId={formData.walletId}/>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="to">To</InputLabel>
                        <Input id="to" name="to" value={formData.to} onChange={handleFormChange} />
                    </FormControl>
                    {/* {warning && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            
                        </Typography>
                    )} */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                    </FormControl>
                    {warningOverAmount && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {warningOverAmount}
                    </Typography>
                    )}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Exchange Date"
                                value={formData.exchangeDate}
                                onChange={handleDateChange}
                                textField={(params) => <Input {...params} />}
                                maxDate={dayjs()}
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
                                background: "#e06666",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                ":hover": {
                                    background: "#d74b4b",
                                },
                            }}
                            onClick={() => setCategoryModalOpen(true)}
                        >
                            Select Category
                        </Button>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Selected Category: {formData.category && budgetCategories ? budgetCategories.find(category => category.budgetCategoryId === formData.category)?.name || 'Category not found' : 'No category selected'}
                        </Typography>
                    </FormControl>
                    {warningSubmit && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            Please fill in all required fields.
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCreateExchange}
                            disabled={warningOverAmount !== ''}
                            style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <BudgetCategorySelection
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSelectCategory={handleSelectCategory}
                budgetCategories={budgetCategories}
            />
        </>
    );
}

export default UpdateSpendModal;