import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../css/OverviewBudget.css'; // Import CSS file for custom styling
import { request } from "api";
import BudgetCard from "./BudgetCard";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function OverviewBudget({ budgets }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));
    };

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    return (
        <div className="overview-budget">
            <div className="month-controls">
                <Button onClick={handlePreviousMonth}>
                    <ArrowCircleLeftIcon />
                </Button>
                <Typography variant="h6">
                    {startOfMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </Typography>
                <Button onClick={handleNextMonth}>
                    <ArrowCircleRightIcon />
                </Button>
            </div>
            <div className="budget-cards">
                {budgets.map(budget => (
                    <BudgetCard key={budget.budgetCategoryId} budget={budget} currentMonth={currentMonth} />
                ))}
            </div>
        </div>
    );
};

OverviewBudget.propTypes = {
    budgets: PropTypes.array.isRequired,
};

export default OverviewBudget;