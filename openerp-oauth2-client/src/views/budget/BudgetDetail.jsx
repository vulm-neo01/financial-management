import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, Grid, Divider, Tabs, Tab, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { request } from 'api';
import { BudgetUpdateSpendModal, BudgetUpdateIncomeModal } from 'components/modal/BudgetUpdateModal';
// import TransactionsList from './TransactionsList';
// import BudgetGraph from './BudgetGraph';
import '../css/BudgetDetail.css'
import ConfirmationModal from 'components/modal/ConfirmationModal';
import { groupExchangesByTime } from 'utils/groupExchangesByTime';
import BudgetGraph from 'components/chart/BudgetGraph';
import {formatDate, formatDateTime} from "utils/formatDate";
import { useTheme } from "@mui/material/styles";

const typeLabels = {
    food_drink: 'Các khoản cho ăn uống',
    shopping: 'Mua sắm',
    entertainment: 'Giải trí',
    study: 'Học tập, phát triển',
    family: 'Gia đình',
    healthcare: 'Chăm sóc sức khỏe',
    travel: 'Du lịch, nghỉ dưỡng',
    house: 'Nhà cửa',
    transport: 'Đi lại, di chuyển',
    pet: 'Thú cưng',
    another: 'Other',
    income: 'Thu nhập'
};

function BudgetDetail() {
    const { budgetCategoryId } = useParams();
    const history = useHistory();
    const [budget, setBudget] = useState(null);
    const [updateBudgetSpend, setUpdateBudgetSpend] = useState(false);
    const [updateBudgetIncome, setUpdateBudgetIncome] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [period, setPeriod] = useState('all');
    const [exchanges, setExchanges] = useState([]);

    const theme = useTheme();

    useEffect(() => {
        request('get', `/budgets/${budgetCategoryId}`, (res) => {
            console.log(res.data);
            setBudget(res.data);
        });
        request('get', `/exchanges/budget/${budgetCategoryId}`, (res) => {
            console.log(res.data);
            setExchanges(res.data);
        });
    }, [budgetCategoryId]);

    const handleClickOpenModalDelete = () => {
        setIsModalDeleteOpen(true);
    };

    const handleClickCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleDeleteBudget = (budgetCategoryId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/budgets/${budgetCategoryId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
        }, (error) => {
            console.error("Error when delete budget:", error);
            // Xử lý lỗi nếu cần thiết
        });
        setIsModalDeleteOpen(false);
        history.push(`/budgets`);
    };

    const handleUpdateBudgetData = (updatedBudget) => {
        setBudget(updatedBudget);
    };

    const handleOpenUpdateBudgetSpendDialog = () => {
        setUpdateBudgetSpend(true);
    };

    const handleCloseUpdateBudgetSpendDialog = () => {
        setUpdateBudgetSpend(false);
    };

    const handleOpenUpdateBudgetIncomeDialog = () => {
        setUpdateBudgetIncome(true);
    };

    const handleCloseUpdateBudgetIncomeDialog = () => {
        setUpdateBudgetIncome(false);
    };

    const handlePeriodChange = (event, newValue) => {
        setPeriod(newValue);
    };

    const handleCardClick = (exchangeId) => {
        history.push(`/exchanges/${exchangeId}`);
    }

    if (!budget) {
        return <Typography>Loading...</Typography>;
    }
    const filterExchanges = (exchanges, period) => {
        const now = new Date();
        let startDate;
        let endDate = now;
        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'last_month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of the previous month
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = null;
        }
                
        if (startDate) {
            return exchanges.filter(exchange => {
                const exchangeDate = new Date(exchange.exchangeDate);
                return (!startDate || exchangeDate >= startDate) && (!endDate || exchangeDate <= endDate);
            });
        } else {
            return exchanges;
        }
    };
    
    const filteredExchanges = filterExchanges(exchanges, period);
    const exchangesByTime = groupExchangesByTime(filteredExchanges);
    // Thuật toán chọn limit Amount cho từng tháng cụ thể
    const getLimitAmount = () => {
        const limitHistories = budget.budgetLimitHistories || [];
        const now = new Date();
        const sortedHistories = limitHistories.sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate));
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
        let applicableLimit = sortedHistories[0].limitAmount;
    
        for (const history of sortedHistories) {
            const effectiveDate = new Date(history.effectiveDate);
            if (effectiveDate <= firstDayOfCurrentMonth) {
                applicableLimit = history.limitAmount;
            } else {
                break;
            }
        }
    
        return applicableLimit;
    };    
    
    const limitMoney = getLimitAmount();
    return (
        <Box sx={{ display: 'flex', height: '80vh' }}>
            <Box sx={{ width: '25%', padding: 2, borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => history.push("/budgets")}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ flexGrow: 1 }}>{budget.name}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <img src={budget.logo.url} alt={budget.name} style={{ width: '50%', marginBottom: 16 }} />
                        <Typography variant="h6">Loại: {typeLabels[budget.type]}</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>{budget.description}</Typography>
                    </Box>
                </Box>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Button
                        onClick={budget.type === "income" ? handleOpenUpdateBudgetIncomeDialog : handleOpenUpdateBudgetSpendDialog}
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        sx={{ m: 1, minWidth: 120 }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={handleClickOpenModalDelete}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ m: 1, minWidth: 120 }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
            <Box sx={{ width: '75%', padding: 2 }}>
                <Tabs value={period} onChange={handlePeriodChange} centered>
                    <Tab label="All" value="all" />
                    <Tab label="This Year" value="year" />
                    <Tab label="Last Month" value="last_month" />
                    <Tab label="This Month" value="month" />
                    <Tab label="This Week" value="week" />
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                    <BudgetGraph exchanges={filteredExchanges} limitAmount={limitMoney}/>
                    <Box sx={{ marginTop: theme.spacing(2), display: 'flex', maxHeight: '60vh', overflowY: 'auto' }}>
                <Grid container spacing={2}>
                    {
                        Object.entries(exchangesByTime).map(([label, exchangesInTime]) => (
                            <>
                                {exchangesInTime.map((exchange) => (
                                    <Grid item xs={12} sm={6} key={exchange.exchangeId}>
                                        <Card
                                            onClick={() => handleCardClick(exchange.exchangeId)}
                                            style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                                            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}
                                        >
                                            <CardContent>
                                                <Grid container spacing={2}>
                                                    {/* Cột thứ nhất */}
                                                    <Grid item xs={6}>
                                                        <Typography variant="h5" component="h2">
                                                            {exchange.exchangeType.exchangeTypeName}
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                            From: {exchange.from}
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                            To: {exchange.to}
                                                        </Typography>
                                                    </Grid>

                                                    {/* Cột thứ hai */}
                                                    <Grid item xs={6}>
                                                        <Typography variant="h6" component="h2">
                                                            Amount: {exchange.amount.toLocaleString()} {localStorage.getItem("currency")}
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                            Happen Time: {formatDate(exchange.exchangeDate)}
                                                        </Typography>
                                                        {/* Thêm các thông tin khác của giao dịch nếu cần */}
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            {/* Đường viền màu */}
                                            <div style={{
                                                height: '5px',
                                                width: '100%',
                                                backgroundColor: exchange.exchangeType.exchangeTypeId === 'wallet_wallet' ? '#106BB6' :
                                                    exchange.exchangeType.exchangeTypeId === 'income' ? '#008000' :
                                                        exchange.exchangeType.exchangeTypeId === 'spend' ? '#FF0000' :
                                                            exchange.exchangeType.exchangeTypeId === 'wallet_saving' || exchange.exchangeType.exchangeTypeId === 'saving_wallet' ? '#FFD700' :
                                                                exchange.exchangeType.exchangeTypeId === 'wallet_debt' || exchange.exchangeType.exchangeTypeId === 'debt_wallet' ? '#D8BFD8' :
                                                                    exchange.exchangeType.exchangeTypeId === 'wallet_loan' || exchange.exchangeType.exchangeTypeId === 'loan_wallet' ? '#000000' : 'transparent'
                                            }} />
                                        </Card>
                                    </Grid>
                                ))}
                            </>
                        ))
                    }
                </Grid>
            </Box>
                </Box>
            </Box>
            <BudgetUpdateSpendModal onUpdateBudget={handleUpdateBudgetData} open={updateBudgetSpend} onClose={handleCloseUpdateBudgetSpendDialog} budgetId={budget.budgetCategoryId}/>
            <BudgetUpdateIncomeModal onUpdateBudget={handleUpdateBudgetData} open={updateBudgetIncome} onClose={handleCloseUpdateBudgetIncomeDialog} budgetId={budget.budgetCategoryId}/>
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteBudget(budgetCategoryId)}
                    question="Xóa Budget"
                /> 
                : null
            }
        </Box>
    );
}

export default BudgetDetail;
