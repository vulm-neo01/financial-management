// src/components/BudgetCard.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import '../budget/css/BudgetCard.css'; // Import CSS file for custom styling
import { request } from 'api'; // Import the request function

const BudgetCard = ({ budget, currentMonth }) => {
    const [exchanges, setExchanges] = useState([]);
    const [spentAmount, setSpentAmount] = useState(0);
    
    useEffect(() => {
        request("get", `/exchanges/budget/${budget.budgetCategoryId}`, (res) => {
            // console.log(res.data);
            setExchanges(res.data);
            
            const totalSpent = res.data.reduce((acc, exchange) => {
                const exchangeDate = new Date(exchange.exchangeDate);
                if (exchangeDate.getMonth() === currentMonth.getMonth() && exchangeDate.getFullYear() === currentMonth.getFullYear()) {
                    return acc + exchange.amount;
                }
                return acc;
            }, 0);
            
            setSpentAmount(totalSpent);
        }).then();
    }, [currentMonth]);
    
    // Thuật toán chọn limit Amount cho từng tháng cụ thể
    const getLimitAmount = () => {
        const limitHistories = budget.budgetLimitHistories || [];
        const sortedHistories = limitHistories.sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate));
        const firstDayOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
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
    const remainAmount = Math.max(limitMoney - spentAmount, 0);
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    return (
        <div key={budget.budgetCategoryId} className="overview-card">
            <div className="overview-logo-name">
                <img src={budget.logo.url} alt={budget.name} className="overview-logo" />
                <Typography variant="h6">{budget.name}</Typography>
            </div>
            <div className="timeline-info">
                <span>{startOfMonth.toLocaleDateString()}</span>
                <span>{endOfMonth.toLocaleDateString()}</span>
            </div>
            <div className="overview-timeline">
                {budget.type === 'income' ? 
                    <div className="timeline-income-bar">
                        <div className="spent-income-bar" style={{ width: `${(spentAmount / limitMoney) * 100}%` }}></div>
                    </div>
                : 
                    <div className="timeline-bar">
                        <div className="spent-bar" style={{ width: `${(spentAmount / limitMoney) * 100}%` }}></div>
                    </div>
                }
                <div className="timeline-info">
                    <span>{budget.type === 'income' ? "Receive" : "Spent"}: {spentAmount} đ</span>
                    <span>Remain: {remainAmount} đ</span>
                    <span>Limit: {limitMoney} đ</span>
                </div>
            </div>
        </div>
    );
};

BudgetCard.propTypes = {
    budget: PropTypes.object.isRequired,
};

export default BudgetCard;