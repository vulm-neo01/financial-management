import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Grid, Card, IconButton, CardContent, Typography, CardActionArea } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { request } from 'api';
import { useHistory } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { groupExchangesByTime } from 'utils/groupExchangesByTime';
import { formatDate } from 'utils/formatDate';
import BudgetOverview from './detail-screen/budget/BudgetOverviewGraph';
import CreateSpendModal from 'components/modal/CreateSpendModal';
import CreateIncomeModal from 'components/modal/CreateIncomeModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
const Dashboard = () => {
    const [walletChangeData, setWalletChangeData] = useState([]);
    const [exchangeData, setExchangeData] = useState([]);
    const [incomeSpendData, setIncomeSpendData] = useState([]);
    const [savingsData, setSavingsData] = useState([]);
    const [savingData, setSavingData] = useState();
    const [debtLoanData, setDebtLoanData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [includedInWallets, setIncludedInWallets] = useState([]);
    const [notIncludedInWallets, setNotIncludedInWallets] = useState([]);
    const [addIncome, setAddIncome] = React.useState(false);
    const [addSpend, setAddSpend] = React.useState(false);

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
        request("get", `/wallet/user/${userId}`, (res) => {
            const includedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === true);
            const notIncludedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === false);
            // console.log(includedInTotalAmount);
            setIncludedInWallets(includedInTotalAmount);
            setNotIncludedInWallets(notIncludedInTotalAmount);
        }).then();

        request("get", `/exchanges/wallet/last-30-days/${userId}`, (res) => {
            const transformedData = res.data.map(item => ({
                ...item,
                date: new Date(item.changeDate).toLocaleDateString('vi-VN')
            }));
            transformedData.sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate));
            setWalletChangeData(transformedData);
        }).then();

        request("get", `/exchanges/overview/${userId}`, (res) => {
            setIncomeSpendData(res.data);
        }).then();
        request("get", `/exchanges/all/${userId}`, (res) => {
            setExchangeData(res.data.sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate)));
        }).then();
        request("get", `/exchanges/saving-graph/${userId}`, (res) => {
            console.log(res.data);
            setSavingData(res.data);
            setSavingsData([
                {
                    name: 'Số dư hiện tại',
                    label: 'totalCurrentAmount',
                    totalCurrentAmount: res.data.totalCurrentAmount,
                    fill: '#82ca9d',
                },
                {
                    name: 'Saving Income',
                    label: 'totalIncomeSavingAmount',
                    totalIncomeSavingAmount: res.data.totalIncomeSavingAmount,
                    fill: '#8884d8',
                },
                {
                    name: 'Saving Outcome',
                    label: 'totalOutcomeSavingAmount',
                    totalOutcomeSavingAmount: res.data.totalOutcomeSavingAmount,
                    fill: '#f44336',
                },
            ])
        }).then();
    }, []);

    const handleWalletClick = (walletId) => {
        history.push(`/wallets/${walletId}`);
    };

    const handleUpdateExchange = (updateExchanges) => {
        setExchangeData(updateExchanges.sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate)));
    }

    const handleOpenSpendExchangeDialog = () => {
        setAddSpend(true);
    };

    const handleCloseSpendExchangeDialog = () => {
        setAddSpend(false);
    };

    const handleOpenIncomeExchangeDialog = () => {
        setAddIncome(true);
    };

    const handleCloseIncomeExchangeDialog = () => {
        setAddIncome(false);
    };

    const renderWalletCard = (wallet) => (
        <Card key={wallet.walletId} style={{ margin: 8 }}>
            <CardActionArea onClick={() => handleWalletClick(wallet.walletId)}>
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h6" style={{ color: wallet.color.hexCode }}>{wallet.name}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" color="textPrimary">{formatCurrency(wallet.amount)}</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="textSecondary">{wallet.description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );

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

    const handleExchangeCardClick = (exchangeId) => {
        history.push(`/exchanges/${exchangeId}`);
    }
    
    const exchangeBarChartData = prepareExchangeBarChartData(filteredIncomeSpends);

    const prepareBudgetPieChartData = (exchanges, type) => {
        const categoryTotals = exchanges
            .filter(exchange => exchange.exchangeType === type)
            .reduce((acc, exchange) => {
                const category = exchange.budgetCategory.name;
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
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Wallet Overview</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={walletChangeData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={formatCurrency}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Legend />
                                <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box maxHeight={350} overflow="auto">
                    {includedInWallets.map(wallet => renderWalletCard(wallet))}
                    {notIncludedInWallets.map(wallet => renderWalletCard(wallet))}
                </Box>
            </Grid>
            <Grid item xs={12} md={12}>
                <Tabs value={period} onChange={handlePeriodChange} centered>
                    <Tab label="All" value="all" />
                    <Tab label="This Year" value="year" />
                    <Tab label="Last Month" value="last_month" />
                    <Tab label="This Month" value="month" />
                    <Tab label="This Week" value="week" />
                </Tabs>
            </Grid>

            <Grid item xs={12} md={3}>
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

            <Grid item container xs={12} md={9} spacing={3}>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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

                <Grid item xs={12} md={4}>
                    <Card sx={{ maxHeight: 370, overflowY: 'auto' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                All Exchange
                            </Typography>
                            {filteredExchanges && filteredExchanges.length > 0 ? (
                                <Grid container spacing={2} item xs={12} justifyContent="center" alignItems="center">
                                    {Object.entries(exchangesByTime).map(([label, exchangesInTime]) =>
                                        exchangesInTime.map((exchange) => (
                                            <Grid item xs={12} key={exchange.exchangeId}>
                                                <Card
                                                    onClick={() => handleExchangeCardClick(exchange.exchangeId)}
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
            </Grid>

            <Grid item xs={12} md={12}>
                <BudgetOverview />
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Saving In 30days</Typography>
                        <Typography variant="body1">Total Saving Account: {savingData && savingData.totalSavingAccount}</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={savingsData}
                                margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={formatCurrency} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                {savingsData && savingsData.map((dataItem) => {
                                    console.log(dataItem);
                                    return (<Bar
                                        key={dataItem.name}
                                        dataKey={dataItem.label} 
                                        stackId="a"
                                        fill={dataItem.fill}
                                    />)
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Debt & Loan Overview</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={debtLoanData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="debt" fill="#FF8042" />
                                <Bar dataKey="loan" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Recent Transactions</Typography>
                        <ul>
                            {transactions.map(transaction => (
                                <li key={transaction.id}>
                                    {transaction.date} - {transaction.description} - {transaction.amount}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </Grid>
            <div style={{ position: 'fixed', bottom: 40, right: 40 }}>
                <IconButton
                    color="primary"
                    onClick={handleOpenSpendExchangeDialog}
                    size="large"
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '2rem',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.2)';
                        e.currentTarget.setAttribute('title', 'Add Spend');
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.removeAttribute('title');
                    }}
                >
                    <RemoveCircleOutlineIcon style={{ fontSize: '2rem' }} />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={handleOpenIncomeExchangeDialog}
                    size="large"
                    style={{
                        position: 'fixed',
                        bottom: '120px',
                        right: '20px',
                        zIndex: 1000,
                        backgroundColor: '#388e3c',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '2rem',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.2)';
                        e.currentTarget.setAttribute('title', 'Add Income');
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.removeAttribute('title');
                    }}
                >
                    <AddCircleOutlineIcon style={{ fontSize: '2rem' }} />
                </IconButton>
            </div>

            <CreateSpendModal onCreateExchange={handleUpdateExchange} open={addSpend} onClose={handleCloseSpendExchangeDialog} />
            <CreateIncomeModal onCreateExchange={handleUpdateExchange} open={addIncome} onClose={handleCloseIncomeExchangeDialog}/>
        </Grid>
    );
};

export default Dashboard;
