import React, { useState, useEffect } from "react";
import { request } from "../api";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import './css/ListBudgetScreen.css';
import AddIcon from '@mui/icons-material/Add';
import OverviewBudget from "./detail-screen/budget/OverviewBudget";
import {BudgetCreateSpendModal} from "components/modal/BudgetCreateModal";
import {BudgetCreateIncomeModal} from "components/modal/BudgetCreateModal";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ListBudgetScreen() {
    const [budgets, setBudgets] = useState([]);
    const [value, setValue] = useState(0);
    const [addBudgetSpend, setAddBudgetSpend] = useState(false);
    const [addBudgetIncome, setAddBudgetIncome] = useState(false);
    const userId = localStorage.getItem('userId');
    const history = useHistory();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        request("get", `/budgets/user/${userId}`, (res) => {
            // console.log(res.data);
            const sortedBudgets = res.data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setBudgets(sortedBudgets);
        }).then();
    }, [budgets.length]);

    const handleBudgetClick = (budgetCategoryId) => {
        history.push(`/budgets/${budgetCategoryId}`);
    };

    const handleOpenAddBudgetSpendDialog = (event) => {
        setAddBudgetSpend(true);
    };

    const handleCloseAddBudgetSpendDialog = () => {
        setAddBudgetSpend(false);
    };

    const handleOpenAddBudgetIncomeDialog = (event) => {
        setAddBudgetIncome(true);
    };

    const handleCloseAddBudgetIncomeDialog = () => {
        setAddBudgetIncome(false);
    };

    const handleUpdateBudgetData = (updatedBudgets) => {
        const sortedBudgets = updatedBudgets.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        setBudgets(sortedBudgets);
    };

    const renderIncomeBudgets = (type) => {
        return budgets
            .filter(budget => budget.type === type)
            .map(budget => (
                <div key={budget.budgetCategoryId} className="budget-card" onClick={() => handleBudgetClick(budget.budgetCategoryId)}>
                    <img src={budget.logo.url} alt={budget.name} className="budget-logo" />
                    <Typography variant="body1">{budget.name}</Typography>
                </div>
            ));
    };

    const renderSpendBudgets = (type) => {
        return budgets
            .filter(budget => budget.type !== type)
            .map(budget => (
                <div key={budget.budgetCategoryId} className="budget-card" onClick={() => handleBudgetClick(budget.budgetCategoryId)}>
                    <img src={budget.logo.url} alt={budget.name} className="budget-logo" />
                    <Typography variant="body1">{budget.name}</Typography>
                </div>
            ));
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Budgets Category
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Overview" {...a11yProps(0)} />
                    <Tab label="Spend" {...a11yProps(1)} />
                    <Tab label="Income" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <OverviewBudget budgets={budgets} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="budget-grid">
                    {renderSpendBudgets("income")}
                    <div className="budget-card add-budget-card" onClick={handleOpenAddBudgetSpendDialog}>
                        <AddIcon style={{ fontSize: 50 }} />
                        <Typography variant="body1">Add Budget</Typography>
                    </div>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div className="budget-grid">
                    {renderIncomeBudgets("income")}
                    <div className="budget-card add-budget-card" onClick={handleOpenAddBudgetIncomeDialog}>
                        <AddIcon style={{ fontSize: 50 }} />
                        <Typography variant="body1">Add Budget</Typography>
                    </div>
                </div>
            </CustomTabPanel>
            <BudgetCreateSpendModal onCreateBudget={handleUpdateBudgetData} open={addBudgetSpend} onClose={handleCloseAddBudgetSpendDialog}/>
            <BudgetCreateIncomeModal onCreateBudget={handleUpdateBudgetData} open={addBudgetIncome} onClose={handleCloseAddBudgetIncomeDialog}/>

        </div>
    );
}

export default ListBudgetScreen;
