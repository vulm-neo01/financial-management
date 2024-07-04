import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Button, FormControl, FormControlLabel, InputLabel, Input, Modal, Typography, Select, MenuItem } from '@mui/material';
import { request } from 'api';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import GroupBudgetSelection from 'components/selection/GroupBudgetSelection';

function GroupUpdateIncomeModal({ onCreateExchange, open, onClose, groupWalletId, groupExchangeId }) {
    const currency = localStorage.getItem('currency');
    const [formData, setFormData] = useState({
        createdUserId: localStorage.getItem('userId'),
        groupWalletId: groupWalletId,
        groupBudgetId: "",
        name: "",
        from: "",
        to: "",
        exchangeTypeId: "income",
        amount: 0,
        imageUrl: null,
        exchangeDate: null,
        description: ""
    });
    const options = Array.from({ length: 11 }, (_, i) => i);
    const [warning, setWarning] = useState(false);
    const [warningSubmit, setWarningSubmit] = useState(false);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [budgetCategories, setBudgetCategories] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [warningOverAmount, setWarningOverAmount] = useState('');
    // const [groupAmount, setGroupAmount] = useState(0);

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

    const handleSelectCategory = (groupBudgetId) => {
        setFormData({ ...formData, groupBudgetId: groupBudgetId });
        console.log(groupBudgetId);
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            exchangeDate: date
        });
    };

    const handleCreateExchange = async () => {
        // console.log(formData);
        if (!formData.from || !formData.to || !formData.exchangeDate || !formData.amount || !formData.groupBudgetId) {
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
                console.log(imageData);
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
                setImage(null);
            }

            const formUploadResponse = await request("patch", `/group/exchanges/${groupExchangeId}`, () => {
                // console.log("success")
            }, (err) => {
                console.log("failure: " + err)
            }, updatedFormData);
            // console.log(formUploadResponse.data);
            setFormData({
                createdUserId: localStorage.getItem('userId'),
                groupWalletId: groupWalletId,
                groupBudgetId: "",
                name: "",
                from: "",
                to: "",
                exchangeTypeId: "income",
                amount: 0,
                imageUrl: null,
                exchangeDate: null,
                description: ""
            });
            onClose();
            handleUpdateExchange(formUploadResponse.data);
            setIsUploading(false);
        } catch (error) {
            console.error("Error creating income exchange:", error);
            setIsUploading(false);
            alert("Error uploading!");
            setFormData({
                createdUserId: localStorage.getItem('userId'),
                groupWalletId: groupWalletId,
                groupBudgetId: "",
                name: "",
                from: "",
                to: "",
                exchangeTypeId: "income",
                amount: 0,
                imageUrl: null,
                exchangeDate: null,
                description: ""
            });
            onClose();
        }
    };

    useEffect(() => {
        request("get", `/group/budgets/all/${groupWalletId}`, (res) => {
            const category = res.data.filter(c => c.type === "income");
            const sortedCategories = category.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setBudgetCategories(sortedCategories);
        }).then();
        // request("get", `/group/wallets/${groupWalletId}`, (res) => {
        //     setGroupAmount(res.data.amount);
        // }).then();
        request("get", `/group/exchanges/${groupExchangeId}`, (res) => {
            console.log(res.data);
            setFormData(prevData => ({
                ...prevData,
                name: res.data.name,
                from: res.data.from,
                to: res.data.to,
                amount: res.data.amount,
                exchangeDate: dayjs(res.data.exchangeDate),
                groupBudgetId: res.data.budget?.groupBudgetId || "",
                description: res.data.description,
                imageUrl: res.data.imageUrl,
            }));
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
                        Update Income
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="from">From</InputLabel>
                        <Input id="from" name="from" value={formData.from} onChange={handleFormChange} />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="to">To</InputLabel>
                        <Input id="to" name="to" value={formData.to} onChange={handleFormChange} />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <Input id="amount" name="amount" value={formData.amount} onChange={handleFormChange} endAdornment={currency}/>
                    </FormControl>
                    {/* {warningOverAmount && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {warningOverAmount}
                    </Typography>
                    )} */}
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
                            Select Budget
                        </Button>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Selected Budget: {formData.groupBudgetId && budgetCategories ? budgetCategories.find(budget => budget.groupBudgetId === formData.groupBudgetId)?.name || 'Category not found' : 'No category selected'}
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
                            // disabled={warningOverAmount !== ''}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <GroupBudgetSelection
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSelectCategory={handleSelectCategory}
                budgetCategories={budgetCategories}
            />
        </>
    );
}

export default GroupUpdateIncomeModal;