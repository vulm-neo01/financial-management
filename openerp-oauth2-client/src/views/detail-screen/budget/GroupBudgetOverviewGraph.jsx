import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Grid, Card, CardContent, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import '../budget/css/BudgetChart.css';
import { request } from 'api';

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

const BudgetOverview = ({groupWalletId}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [budgetData, setBudgetData] = useState([]);

    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 15));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 15));
    };

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth());

    useEffect(() => {
        console.log(currentMonth)
        request("post", `/group/exchanges/graph-overview`, (res) => {
            console.log(res.data);
            setBudgetData(res.data);
        },(error) => {
            console.error("Error creating wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, {
            "exchangeDate": currentMonth,
            "groupWalletId": groupWalletId,
        }).then();
    }, [currentMonth]);

    return (
        <Grid item xs={12} md={12}>
            <div className="month-controls">
                <Button onClick={handlePreviousMonth}>
                    <ArrowCircleLeftIcon />
                </Button>
                <Typography variant="body1">
                    {startOfMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </Typography>
                <Button onClick={handleNextMonth}>
                    <ArrowCircleRightIcon />
                </Button>
            </div>
            <Card>
                <CardContent>
                    <Typography variant="body1"><strong>Toàn bộ ngân sách</strong></Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={budgetData}
                            margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="spentAmount" stackId="a" fill="#8884d8" />
                            <Bar dataKey="remainAmount" stackId="a" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>
    );
};

BudgetOverview.propTypes = {
    budgets: PropTypes.array.isRequired,
};

export default BudgetOverview;
