import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Hàm tính toán số dư ban đầu
const calculateInitialBalance = (currentBalance, exchanges, walletId) => {
    let initialBalance = currentBalance;
    exchanges.slice().reverse().forEach(exchange => {
        if (exchange.exchangeType.exchangeTypeId === 'spend') {
            initialBalance += exchange.amount;
        } else if (exchange.exchangeType.exchangeTypeId === 'income') {
            initialBalance -= exchange.amount;
        } else if (exchange.exchangeType.exchangeTypeId === 'wallet_wallet'){
            if(exchange.wallet.walletId === walletId){
                initialBalance += exchange.amount;
            } else if(exchange.destinationId === walletId){
                initialBalance -= exchange.amount;
            }
        }
    });
    return initialBalance;
};

// Hàm chuẩn bị dữ liệu biểu đồ
const prepareChartData = (exchanges, initialBalance, walletId, createAt) => {
    let balance = initialBalance;
    const dailyChanges = {};

    exchanges.sort((a, b) => new Date(a.exchangeDate) - new Date(b.exchangeDate)).forEach(exchange => {
        const date = new Date(exchange.exchangeDate).toLocaleDateString();
        if (!dailyChanges[date]) {
            dailyChanges[date] = 0;
        }
        if (exchange.exchangeType.exchangeTypeId === 'spend') {
            dailyChanges[date] -= exchange.amount;
        } else if (exchange.exchangeType.exchangeTypeId === 'income') {
            dailyChanges[date] += exchange.amount;
        } else if (exchange.exchangeType.exchangeTypeId === 'wallet_wallet') {
            if (exchange.wallet.walletId === walletId) {
                dailyChanges[date] -= exchange.amount;
            } else if (exchange.destinationId === walletId) {
                dailyChanges[date] += exchange.amount;
            }
        }
    });

    const data = [];
    for (const [date, change] of Object.entries(dailyChanges)) {
        balance += change;
        data.push({ date, balance });
    }

    // Thêm số dư ban đầu vào ngày tạo tài khoản
    data.unshift({
        date: new Date(createAt).toLocaleDateString(),
        balance: initialBalance
    });

    return data;
}

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

// Component biểu đồ Wallet
const WalletChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={400} >
        <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    </ResponsiveContainer>
);

const WalletGraph = ({ exchanges, currentBalance, walletId, createAt }) => {
    const theme = useTheme();
    const initialBalance = calculateInitialBalance(currentBalance, exchanges, walletId);
    const data = prepareChartData(exchanges, initialBalance, walletId, createAt);

    return (
        <Box sx={{ marginTop: theme.spacing(2), display: 'flex', maxHeight: '80vh', overflowY: 'auto' }}>
            {exchanges && exchanges.length > 0 ? (
                <Grid container alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom style={{ marginTop: theme.spacing(3) }}>
                            Wallet Graph Statistics
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ width: '100%' }}>
                        {/* Hiển thị biểu đồ */}
                        <WalletChart data={data} />
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2), alignItems: 'center' }}>
                    Nothing to Show here, create your first Exchange!
                </Typography>
            )}
        </Box>
    );
};

export default WalletGraph;