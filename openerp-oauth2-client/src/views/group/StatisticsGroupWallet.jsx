import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Grid, Card, IconButton, CardContent, Typography, CardActionArea } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { request } from 'api';
import { useHistory } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { groupExchangesByTime } from 'utils/groupExchangesByTime';
import CreateSpendModal from 'components/modal/CreateSpendModal';
import CreateIncomeModal from 'components/modal/CreateIncomeModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import BudgetOverview from 'views/detail-screen/budget/GroupBudgetOverviewGraph';

const StatisticsGroupWallet = ({groupWalletId}) => {
    const [exchangeData, setExchangeData] = useState([]);
    const [incomeSpendData, setIncomeSpendData] = useState([]);

    const history = useHistory ();
    const theme = useTheme ();
    const [period, setPeriod] = useState('all');
    const userId = localStorage.getItem('userId');
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${formatCurrency(payload[0].value)}`}</p>
            </div>
            );
        }
    
        return null;
    };
    useEffect(() => {
        request("get", `/group/exchanges/overview/${groupWalletId}`, (res) => {
            setIncomeSpendData(res.data);
        }).then();
        request("get", `/group/exchanges/all/${groupWalletId}`, (res) => {
            setExchangeData(res.data.sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate)));
        }).then();
    }, []);

    const RADIAN = Math.PI / 180;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f3ccd2', '#ccd2f3', '#ccf3ed', '#81d8d0', '#81d8a5'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    
    const CurrencyTooltip = ({ payload }) => {
        if (payload && payload.length) {
            const { name, value } = payload[0];
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${name} : ${formatCurrency(value)}`}</p>
                </div>
            );
        }
        return null;
    };
    
    
    const handlePeriodChange = (event, newValue) => {
        setPeriod(newValue);
    };
    
    const filterExchanges = (exchanges, period) => {
        const now = new Date();
        let startDate;
        let endDate = now;
        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - now.getDay()); // Bắt đầu từ Chủ nhật
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
    const filteredExchanges = filterExchanges(exchangeData, period);
    const exchangesByTime = groupExchangesByTime(filteredExchanges);
    const filteredIncomeSpends = filterExchanges(incomeSpendData, period);
    // const exchangesByTime = groupExchangesByTime(filteredIncomeSpends);
    const prepareExchangeBarChartData = (exchanges) => {
        const totals = exchanges.reduce((acc, exchange) => {
            if (exchange.exchangeType === "spend") {
                acc.spend += exchange.amount;
            } else if (exchange.exchangeType === "income") {
                acc.income += exchange.amount;
            }
            return acc;
        }, { spend: 0, income: 0 });
    
        return [
            { name: 'Spend', amount: totals.spend },
            { name: 'Income', amount: totals.income }
        ];
    };

    const handleExchangeCardClick = (groupExchangeId) => {
        history.push(`/exchanges/${groupExchangeId}`);
    }
    
    const exchangeBarChartData = prepareExchangeBarChartData(filteredIncomeSpends);

    const prepareBudgetPieChartData = (exchanges, type) => {
        const categoryTotals = exchanges
            .filter(exchange => exchange.exchangeType === type)
            .reduce((acc, exchange) => {
                const category = exchange.groupBudget.name;
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += exchange.amount;
                return acc;
            }, {});
        
        return Object.entries(categoryTotals).map(([name, amount]) => ({ name, amount }));
    };
    
    const incomePieChartData = prepareBudgetPieChartData(filteredIncomeSpends, 'income');
    const spendPieChartData = prepareBudgetPieChartData(filteredIncomeSpends, 'spend');


    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <Tabs value={period} onChange={handlePeriodChange} centered>
                    <Tab label="All" value="all" />
                    <Tab label="This Year" value="year" />
                    <Tab label="Last Month" value="last_month" />
                    <Tab label="This Month" value="month" />
                    <Tab label="This Week" value="week" />
                </Tabs>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Spend/Income Overview</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={exchangeBarChartData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={formatCurrency}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Legend />
                                <Bar dataKey="amount" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card sx={{ maxHeight: 370, overflowY: 'auto' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            All Exchange
                        </Typography>
                        {filteredExchanges && filteredExchanges.length > 0 ? (
                            <Grid container spacing={2} item xs={12} justifyContent="center" alignItems="center">
                                {Object.entries(exchangesByTime).map(([label, exchangesInTime]) =>
                                    exchangesInTime.map((exchange) => (
                                        <Grid item xs={12} key={exchange.groupExchangeId}>
                                            <Card
                                                onClick={() => handleExchangeCardClick(exchange.groupExchangeId)}
                                                style={{
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.3s',
                                                    marginBottom: theme.spacing(1) // Thêm margin dưới cho mỗi thẻ
                                                }}
                                                sx={{ '&:hover': { backgroundColor: '#f0f0f0' }, minWidth: 200 }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                                From: {exchange.from}
                                                            </Typography>
                                                            <Typography variant="body2" component="h2">
                                                                {exchange.exchangeType.exchangeTypeName}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                                To: {exchange.to}
                                                            </Typography>
                                                            <Typography variant="body2" component="h2">
                                                                {exchange.amount.toLocaleString()} {localStorage.getItem("currency")}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
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
                                    ))
                                )}
                            </Grid>
                        ) : (
                            <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2), alignItems: 'center' }}>
                                Nothing to Show here, create your first Exchange!
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Income Overview</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={incomePieChartData}
                                        dataKey="amount"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={renderCustomizedLabel}
                                    >
                                        {incomePieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CurrencyTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Spend Overview</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={spendPieChartData}
                                        dataKey="amount"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={renderCustomizedLabel}
                                    >
                                        {spendPieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CurrencyTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>


            <Grid item xs={12} md={12}>
                <BudgetOverview groupWalletId={groupWalletId}/>
            </Grid>

        </Grid>
    );
}

export default StatisticsGroupWallet;