import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Hàm chuẩn bị dữ liệu biểu đồ
const prepareChartData = (exchanges) => {
    let balance = 0;
    const dailyChanges = {};

    exchanges.sort((a, b) => new Date(a.exchangeDate) - new Date(b.exchangeDate)).forEach(exchange => {
        const date = new Date(exchange.exchangeDate).toLocaleDateString();
        if (!dailyChanges[date]) {
            dailyChanges[date] = 0;
        }
        dailyChanges[date] += exchange.amount;
    });

    const data = [];
    for (const [date, change] of Object.entries(dailyChanges)) {
        balance += change;
        data.push({ date, balance });
    }

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
const ExchangeChart = ({ data, getMaxAmount, limitAmount }) => (
    <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 25, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} domain={[0, getMaxAmount()]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="balance" fill="#8884d8" />
            <ReferenceLine y={limitAmount} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Limit Amount', fill: 'red' }} />

            {/* <ReferenceLine y={limitAmount} label="Limit Amount" stroke="red" strokeDasharray="3 3" /> */}
        </BarChart>
    </ResponsiveContainer>
);

const BudgetGraph = ({ exchanges, limitAmount }) => {
    const theme = useTheme();
    const data = prepareChartData(exchanges);
    
    const getMaxAmount = () => {
        const maxAmount = Math.max(...exchanges.map(item => item.amount), limitAmount || 0);
        return maxAmount;
    };
    return (
        <Box sx={{ marginTop: theme.spacing(2), display: 'flex', maxHeight: '60vh', overflowY: 'auto' }}>
            {exchanges && exchanges.length > 0 ? (
                <Grid container alignItems="center">
                    <Grid item xs={12} style={{ width: '100%' }}>
                        {/* Hiển thị biểu đồ */}
                        <ExchangeChart data={data} getMaxAmount={getMaxAmount} limitAmount={limitAmount || 0}/>
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2), alignItems: 'center' }}>
                    Không tìm thấy giao dịch trong khoảng thời gian này
                </Typography>
            )}
        </Box>
    );
};

export default BudgetGraph;