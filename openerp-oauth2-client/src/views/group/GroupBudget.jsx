import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, Grid, Divider, Tabs, Tab, Avatar, LinearProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { request } from 'api';
import PropTypes from 'prop-types';
import { TabPanel } from 'components/tab';
import AddIcon from "@mui/icons-material/Add";
import GroupBudgetCreateModal from 'components/modal/GroupBudgetCreateModal';
import GroupBudgetUpdateModal from 'components/modal/GroupBudgetUpdateModal';
import ConfirmationModal from 'components/modal/ConfirmationModal';

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

const GroupBudget = ({groupWalletId}) => {
    const [groupBudgetComparisons, setGroupBudgetComparisons] = useState([])
    const [spendBudgets, setSpendBudgets] = useState([])
    const [incomeBudgets, setIncomeBudgets] = useState([])
    const [value, setValue] = useState(0);
    const userId = localStorage.getItem('userId');
    const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openUpdateBudgetModal, setOpenUpdateBudgetModal] = useState(false);
    const [budgetId, setBudgetId] = useState(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const [formData, setFormData] = useState({
        createdUserId: userId,
        groupWalletId: groupWalletId,
        name: '',
        type: '',
        limitAmount: 0.0,
        logoId: '',
        description: ''
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        request('get', `/group/budgets/all/${groupWalletId}`, (res) => {
            const spends = res.data.filter(budget => budget.type === "spend")
            const incomes = res.data.filter(budget => budget.type === "income")
            setSpendBudgets(spends);
            setIncomeBudgets(incomes);
        });
        request('get', `/group/exchanges/total-amount/${groupWalletId}`, (res) => {
            setGroupBudgetComparisons(res.data);
            // console.log(res.data);
        });

        request('get', `/group/members/check/${userId}/${groupWalletId}`, (res) => {
            setIsAdmin(res.data);
            // console.log(res.data);
        });
    }, []);

    const getCurrentAmount = (budgetId) => {
        const budgetComparison = groupBudgetComparisons.find(budget => budget.groupBudgetId === budgetId);
        return budgetComparison ? budgetComparison.currentAmount : 0;
    };

    const isOverLimit = (budgetId) => {
        const budgetComparison = groupBudgetComparisons.find(budget => budget.groupBudgetId === budgetId);
        return budgetComparison ? budgetComparison.overLimit : false;
    };

    const handleOpenUpdateBudgetModal = (budget) => {
        setBudgetId(budget.groupBudgetId);
        setOpenUpdateBudgetModal(true);
    };

    const handleClickOpenModalDelete = (budget) => {
        setBudgetId(budget.groupBudgetId);
        setIsModalDeleteOpen(true);
    };
    
    const handleClickCloseModalDelete = () => {
        setBudgetId(null);
        setIsModalDeleteOpen(false);
    };

    const handleCloseUpdateBudgetModal = () => {
        setBudgetId(null);
        setOpenUpdateBudgetModal(false);
    };

    const handleDeleteExchange = (budgetId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/group/budgets/delete/${budgetId}`, (res) => {
            // console.log(res.data);
            setIsModalDeleteOpen(false);
            handleUpdateBudgetData(res.data);
        }, (error) => {
            console.error("Error when delete group budget:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        setIsModalDeleteOpen(false);
    };

    const handleUpdateBudgetData = (updatedBudgets) => {
        const spends = updatedBudgets.filter(budget => budget.type === "spend")
        const incomes = updatedBudgets.filter(budget => budget.type === "income")
        setSpendBudgets(spends);
        setIncomeBudgets(incomes);
    }

    const renderBudgetCard = (budget) => {
        const currentAmount = getCurrentAmount(budget.groupBudgetId);
        const progress = Math.min((currentAmount / budget.limitAmount) * 100, 100);
        const progressColor = isOverLimit(budget.groupBudgetId) ? 'error' : 'primary';
        const remainAmount = Math.max(budget.limitAmount - currentAmount, 0);

        return (
            <Card key={budget.groupBudgetId} sx={{ mb: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={1.5}>
                            <Avatar sx={{ width: 56, height: 56 }} src={budget.logo.url} alt={budget.logo.name} />
                        </Grid>
                        <Grid item xs={7.5}>
                            <Typography variant="h6">{budget.name}</Typography>
                            <Typography variant="body2">Created by: {budget.createdUser && budget.createdUser.username || ""}</Typography>
                            <Typography variant="body2">Description: {budget.description}</Typography>
                        </Grid>
                            {isAdmin &&
                            <Grid item xs={3} sx={{ textAlign: 'right' }}>
                                <IconButton onClick={() => handleOpenUpdateBudgetModal(budget)} size='large' aria-label="edit" sx={{ color: 'primary.main' }}>
                                    <EditIcon fontSize='40px'/>
                                </IconButton>
                                <IconButton onClick={() => handleClickOpenModalDelete(budget)} size='large' aria-label="delete" sx={{ color: 'error.main' }}>
                                    <DeleteIcon fontSize='40px' />
                                </IconButton>
                            </Grid>
                            }
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="body2" color={progressColor}>
                                    Current: {currentAmount.toLocaleString()} đ / Limit: {budget.limitAmount.toLocaleString()} đ
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <LinearProgress variant="determinate" value={progress} color={progressColor} />
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                {budgetId &&
                    <GroupBudgetUpdateModal open={openUpdateBudgetModal} onClose={handleCloseUpdateBudgetModal} onCreateBudget={handleUpdateBudgetData} groupWalletId={groupWalletId} groupBudgetId={budgetId} />
                }
                {
                    isModalDeleteOpen ? 
                    <ConfirmationModal
                        open={isModalDeleteOpen}
                        onClose={handleClickCloseModalDelete}
                        onConfirm={() => handleDeleteExchange(budgetId)
                        }
                        question="Xóa Ngân sách"
                    /> 
                    : null
                }
            </Card>
        );
    };
    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Spend Budget" {...a11yProps(0)} />
                    <Tab label="Income Budget" {...a11yProps(1)} />
                </Tabs>
                {isAdmin &&
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenCreateBudgetModal(true)}>
                        Add Budget
                    </Button>
                }
                <GroupBudgetCreateModal open={openCreateBudgetModal} onClose={() => setOpenCreateBudgetModal(false)} onCreateBudget={handleUpdateBudgetData} groupWalletId={groupWalletId}/>
            </Box>
            <TabPanel value={value} index={0}>
                {spendBudgets.map(renderBudgetCard)}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {incomeBudgets.map(renderBudgetCard)}
            </TabPanel>
        </div>
    );
}

export default GroupBudget;