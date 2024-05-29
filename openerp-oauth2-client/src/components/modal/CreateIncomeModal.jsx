import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import WalletSelection from 'components/selection/WalletSelection';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import BudgetCategorySelection from 'components/selection/BudgetCategorySelection';

function CreateIncomeModal({ onCreateExchange, open, onClose }) {
    const currency = localStorage.getItem('currency');
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        walletId: "",
        destinationId: "",
        exchangeTypeId: "income",
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
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [budgetCategories, setBudgetCategories] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    const handleUpdateExchange = (updatedExchanges) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onCreateExchange(updatedExchanges);
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            exchangeDate: date
        });
    };

    const handleCreateExchange = async () => {
        console.log(formData);
        if (!formData.walletId || !formData.from || !formData.exchangeDate || !formData.amount || !formData.category) {
            setWarningSubmit(true);
            setTimeout(() => {
                setWarningSubmit(false);
            }, 3000);
            return;
        }
                
        try {
            let updatedFormData = { ...formData };
            if(image){
                const imageData = new FormData();
                imageData.append('image', image); // Append the selected file
                // console.log(imageData);
                setIsUploading(true)
    
                const imageUploadResponse = await request("post", "/exchanges/image", () => {
                    // console.log("success")
                }, (err) => {
                    console.log("failure: " + err)
                }, imageData);
                console.log(imageUploadResponse.data);
                updatedFormData = {
                    ...formData,
                    imageUrl: imageUploadResponse.data, // Assuming the response contains an 'url' property
                };
            }

            const formUploadResponse = await request("post", "/exchanges/new_exchange", () => {
                // console.log("success")
            }, (err) => {
                console.log("failure: " + err)
            }, updatedFormData);
            // console.log(formUploadResponse.data);
            setFormData({
                userId: localStorage.getItem('userId'),
                walletId: "",
                destinationId: "",
                exchangeTypeId: "income",
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
            handleUpdateExchange(formUploadResponse.data);
            setIsUploading(false);
        } catch (error) {
            console.error("Error creating income exchange:", error);
            setIsUploading(false);
            alert("Error uploading!");
            setFormData({
                userId: localStorage.getItem('userId'),
                walletId: "",
                destinationId: "",
                exchangeTypeId: "income",
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
        }
    };
    const handleWalletSendingSelect = (walletId) => {
        setFormData({
            ...formData,
            walletId: walletId
        });
    };

    const handleSelectCategory = (categoryId) => {
        setFormData({ ...formData, category: categoryId });
    };

    useEffect(() => {
        request("get", `/budgets/income/${localStorage.getItem('userId')}`, (res) => {
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
                        Income Exchange
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="walletId" sx={{ marginBottom: '8px' }}>Choose Wallet</InputLabel>
                        <WalletSelection onSelect={handleWalletSendingSelect}/>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="from">From</InputLabel>
                        <Input id="from" name="from" value={formData.from} onChange={handleFormChange} />
                    </FormControl>
                    {/* {warning && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            
                        </Typography>
                    )} */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Exchange Date"
                                value={formData.exchangeDate}
                                onChange={handleDateChange}
                                textField={(params) => <Input {...params} />}
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
                                background: "#529733",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                ":hover": {
                                    background: "#428625",
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
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                background: "#529733",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                ":hover": {
                                    background: "#428625",
                                },
                            }}
                        >
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                                encType="multipart/form-data"
                            />
                            Select Image
                        </Button>
                    </FormControl>
                    {warningSubmit && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            Please fill in all required fields.
                        </Typography>
                    )}
                    {isUploading && 
                    <CircularProgress 
                        size={60} 
                        sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} 
                    />}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleCreateExchange}
                            style={{ fontSize: '1.3rem', marginTop: '1rem' }}
                        >
                            Create Exchange
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

export default CreateIncomeModal;