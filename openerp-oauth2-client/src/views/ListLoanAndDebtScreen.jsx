import React, { useEffect, useState } from "react";
import { request } from "../api";
import { Card, CardContent, Typography, Grid, IconButton, Paper, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./css/ListLoanDebt.css";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import LoanCreateModal from "components/modal/LoanCreateModal";
import DebtCreateModal from "components/modal/DebtCreateModal";

function ListLoanAndDebtScreen() {
    const [loans, setLoans] = useState([]);
    const [debts, setDebts] = useState([]);
    const [addLoan, setAddLoan] = useState(false);
    const [addDebt, setAddDebt] = useState(false);
    const userId = localStorage.getItem('userId');
    const history = useHistory();

    useEffect(() => {
        request("get", `/loan-debt/loan/${userId}`, (res) => {
            const sortedLoans = res.data.sort((a, b) => {
                if (a.openStatus === b.openStatus) {
                    return new Date(a.returnDate) - new Date(b.returnDate);
                }
                return b.openStatus - a.openStatus;
            });
            setLoans(sortedLoans);
        }).then();
        request("get", `/loan-debt/debt/${userId}`, (res) => {
            const sortedDebts = res.data.sort((a, b) => {
                if (a.openStatus === b.openStatus) {
                    return new Date(a.returnDate) - new Date(b.returnDate);
                }
                return b.openStatus - a.openStatus;
            });
            setDebts(sortedDebts);
        }).then();
    }, [])


    const handleCardClick = (id, type) => {
        history.push(`/${type}/${id}`);
    }

    const handleAddButtonClick = (type) => {
        history.push(`/${type}/create`);
    }

    const handleOpenAddLoanModal = (event) => {
        setAddLoan(true);
    };

    const handleCloseAddLoanModal = () => {
        setAddLoan(false);
    };

    const handleOpenAddDebtModal = (event) => {
        setAddDebt(true);
    };

    const handleCloseAddDebtModal = () => {
        setAddDebt(false);
    };

    const handleUpdateLoans = (updatedLoans) => {
        const sortedLoans = updatedLoans.sort((a, b) => {
            if (a.openStatus === b.openStatus) {
                return new Date(a.returnDate) - new Date(b.returnDate);
            }
            return b.openStatus - a.openStatus;
        });
        setLoans(sortedLoans);
    };

    const handleUpdateDebts = (updatedDebts) => {
        const sortedDebts = updatedDebts.sort((a, b) => {
            if (a.openStatus === b.openStatus) {
                return new Date(a.returnDate) - new Date(b.returnDate);
            }
            return b.openStatus - a.openStatus;
        });
        setDebts(sortedDebts);
    };

    const renderCard = (item, type) => {
        const {
            name,
            color,
            currentAmount,
            startDate,
            returnDate,
            openStatus,
            description,
        } = item;

        const backgroundColor = color.colorId || "#f5f5f5";
        const formattedStartDate = startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'N/A';
        const formattedReturnDate = returnDate ? format(new Date(returnDate), 'dd/MM/yyyy') : 'N/A';

        return (
            <Grid item xs={12} sm={12} md={6} key={item[`${type}Id`]}>
                <Paper
                    className={`item-card ${!openStatus ? "disabled" : ""}`}
                    style={{ backgroundColor }}
                    onClick={() => openStatus && handleCardClick(item[`${type}Id`], type)}
                >
                    <Box>
                        <Typography variant="h6">{name || "Unnamed"}</Typography>
                        <Typography variant="body2" className="current-amount">{currentAmount ? `${currentAmount.toLocaleString()} VNĐ` : 'N/A'}</Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">From: {formattedStartDate}</Typography>
                            <Typography variant="body2">To: {formattedReturnDate}</Typography>
                        </div>
                        {description && <Typography variant="body2">{description}</Typography>}
                    </Box>
                </Paper>
            </Grid>
        );
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item md={6}>
                    <Typography variant="h4" gutterBottom>
                        Loan Management
                    </Typography>
                    <div className="add-card-button" onClick={handleOpenAddLoanModal}>
                        <AddIcon />
                        <Typography variant="h6">Add Loan</Typography>
                    </div>

                    <Grid container spacing={3} className="card-container">
                        {loans.map(loan => renderCard(loan, 'loan'))}
                    </Grid>
                </Grid>
                <Grid item md={6}>
                    <Typography variant="h4" gutterBottom>
                        Debt Management
                    </Typography>
                    <div className="add-card-button" onClick={handleOpenAddDebtModal}>
                        <AddIcon />
                        <Typography variant="h6">Add Debt</Typography>
                    </div>
                    <Grid container spacing={3} className="card-container">
                        {debts.map(debt => renderCard(debt, 'debt'))}
                    </Grid>
                </Grid>
            </Grid>
            <LoanCreateModal onCreateLoan={handleUpdateLoans} open={addLoan} onClose={handleCloseAddLoanModal}/>
            <DebtCreateModal onCreateDebt={handleUpdateDebts} open={addDebt} onClose={handleCloseAddDebtModal}/>
        </div>
    );
}

export default ListLoanAndDebtScreen;