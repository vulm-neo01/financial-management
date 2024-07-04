import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { request } from 'api';

const SavingGraph = ({history, targetAmount}) => {
    // const [history, setHistory] = useState([]);

    // useEffect(() => {
    //     request('get', `/exchanges/saving-history/${savingId}`, (res) => {
    //         console.log(res.data);
            // const transformedData = res.data.map(item => ({
            //     ...item,
            //     date: new Date(item.exchangeDate).toLocaleDateString('vi-VN')
            // }));
    //         setHistory(transformedData);
    //     });
    // }, []);

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

    const getMaxAmount = () => {
        const maxAmount = Math.max(...history.map(item => item.amount), targetAmount);
        return maxAmount;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={history} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatCurrency} domain={[0, getMaxAmount()]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                <ReferenceLine y={targetAmount} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Target Amount', fill: 'red' }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SavingGraph;