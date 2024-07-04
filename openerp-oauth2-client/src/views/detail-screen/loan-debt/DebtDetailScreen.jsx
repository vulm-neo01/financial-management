import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Menu, MenuItem, Box, Button, Typography, Card, CardContent, Grid, Divider, Tabs, Tab, IconButton, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { request } from 'api';
import ConfirmationModal from 'components/modal/ConfirmationModal';
import {formatDate, formatDateTime} from "utils/formatDate";
import "../../css/SavingDetail.css"
import { currency } from 'utils/currency';
import { groupExchangesByTime } from 'utils/groupExchangesByTime';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PaidIcon from '@mui/icons-material/Paid';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import DebtUpdateModal from 'components/modal/DebtUpdateModal';
import DebtDoneModal from 'components/modal/DebtDoneModal';
import DebtPayModal from 'components/modal/DebtPayModal';

const receiveTypes = {
    DAILY: "Hằng ngày",
    WEEKLY: "Hằng tuần",
    MONTHLY: "Hằng tháng",
    EVERY_TWO_MONTH: "Mỗi 2 tháng",
    EVERY_THREE_MONTH: "Mỗi 3 tháng",
    EVERY_SIX_MONTH: "Mỗi 6 tháng",
    YEARLY: "Hằng năm"
}
const DebtTypes = {
    NO_INTEREST: "Không lãi suất",
    SIMPLE_INTEREST: "Lãi đơn",
    COMPOUND: "Lãi kép không tích lũy",
}
function DebtDetailScreen() {
    const { debtId } = useParams();
    const history = useHistory();
    const [debt, setDebt] = useState(null);
    const [updateDebt, setUpdateDebt] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [exchanges, setExchanges] = useState([]);
    const [period, setPeriod] = useState('all');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openPaidAll, setOpenPaidAll] = useState(false);
    const [openPaidAPart, setOpenPaidAPart] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpenModalPaidAll = () => {
        setOpenPaidAll(true);
        handleClose();
    };

    const handleClickCloseModalPaidAll = () => {
        setOpenPaidAll(false);
    };

    const handleClickOpenModalPaidAPart = () => {
        setOpenPaidAPart(true);
        handleClose();
    };

    const handleClickCloseModalPaidAPart = () => {
        setOpenPaidAPart(false);
    };

    const handleClickOpenModalDelete = () => {
        setIsModalDeleteOpen(true);
    };

    const handleClickCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOpenUpdateDebtDialog = () => {
        setUpdateDebt(true);
    };

    const handleCloseUpdateDebtDialog = () => {
        setUpdateDebt(false);
    };

    const handleUpdateDebt = (updatedDebt) => {
        setDebt(updatedDebt);
        request('get', `/exchanges/saving/${debtId}`, (res) => {
            console.log(res.data);
            setExchanges(res.data);
        });
    }

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
    
    const filteredExchanges = filterExchanges(exchanges, period);
    const exchangesByTime = groupExchangesByTime(filteredExchanges);

    const handleCardClick = (exchangeId) => {
        history.push(`/exchanges/${exchangeId}`);
    }

    const calculatePaidAmount = (transactions) => {
        return transactions
            .filter(transaction => transaction.exchangeType.exchangeTypeId === "wallet_debt")
            .reduce((total, transaction) => total + transaction.amount, 0);
    };

    const calculateProgress = (debt, paidAmount) => {
        if (!debt || debt.currentAmount === undefined) {
            return { totalAmount: 0, progress: 0 };
        }
        const totalAmount = debt.currentAmount + paidAmount;
        const progress = (paidAmount / totalAmount) * 100;
        return { totalAmount, progress };
    };

    const paidAmount = calculatePaidAmount(exchanges);
    const { totalAmount, progress } = calculateProgress(debt, paidAmount);

    const calculateTimeProgress = () => {
        if (!debt) return 0;
        const { changeDate, returnDate } = debt;
        const totalDuration = new Date(returnDate) - new Date(changeDate);
        const elapsedDuration = new Date() - new Date(changeDate);
        if(elapsedDuration > totalDuration){
            return 100;
        }
        return (elapsedDuration / totalDuration) * 100;
    };

    const handleDeleteDebt = (debtId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/loan-debt/debt/${debtId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
        }, (error) => {
            console.error("Error when delete debt:", error);
            // Xử lý lỗi nếu cần thiết
        });
        setIsModalDeleteOpen(false);
        history.push(`/all-loan-debt`);
    };

    useEffect(() => {
        request('get', `/loan-debt/debt/${debtId}`, (res) => {
            console.log(res.data);
            setDebt(res.data);
        });
        request('get', `/exchanges/saving/${debtId}`, (res) => {
            console.log(res.data);
            setExchanges(res.data);
        });
        // request('get', `/exchanges/saving-history/${debtId}`, (res) => {
        //     console.log(res.data);
        //     setExchangesHistory(res.data);
        // });
    }, [debtId]);

    return (
        <>
            {
                debt 
                && 
                <Box sx={{ display: 'flex', maxHeight: '100vh' }}>
                    <Box sx={{ backgroundColor: `${debt.color && debt.color.colorId}`, width: '25%', padding: 2, borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '12px'  }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <IconButton onClick={() => history.push("/all-loan-debt")}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography style={{marginLeft: "4px"}} variant="h6" sx={{ flexGrow: 1 }}>{debt.name}</Typography>
                            </Box>
                            <div className='saving-detail'>
                                <Box className="info">
                                    <div className="field">
                                        <label>Loại vay:</label>
                                        <span>{DebtTypes[debt.type]}</span>
                                    </div>
                                    <div className="field">
                                        <label>Tiền gốc:</label>
                                        <span>{debt.originAmount && debt.originAmount.toLocaleString()} {currency}</span>
                                    </div>
                                    <div className="field">
                                        <label>Hiện tại:</label>
                                        <span>{debt.currentAmount.toLocaleString()} {currency}</span>
                                    </div>
                                    {debt.type !== "NO_INTEREST" && (
                                        <>
                                            <div className="field">
                                                <label>Kỳ hạn:</label>
                                                <span>{receiveTypes[debt.receiveInterestTime]}</span>
                                            </div>
                                            <div className="field">
                                                <label>Lãi:</label>
                                                <span>{debt.interestRate} %/năm</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="field">
                                        <label>Vay từ:</label>
                                        <span>{new Date(debt.changeDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="field">
                                        <label>Ngày tính mới:</label>
                                        <span>{new Date(debt.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="field">
                                        <label>Ngày kết thúc:</label>
                                        <span>{new Date(debt.returnDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="field">
                                        <label>Mô tả:</label>
                                        <span>{debt.description}</span>
                                    </div>
                                </Box>
                            </div>
                        </Box>
                        <Box sx={{ textAlign: 'center', mb: 2 }} className="action-buttons">
                            <Button
                                onClick={handleOpenUpdateDebtDialog}
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                sx={{ m: 1, minWidth: 120 }}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleClickOpenModalDelete}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{ m: 1, minWidth: 120 }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{width: '75%', paddingLeft: 2, paddingRight: 2}}>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Tiến độ khoản cho vay</Typography>
                                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    {/* <Typography variant="body2">Số tiền đã trả: {paidAmount.toLocaleString()} {currency}</Typography>
                                    <Typography variant="body2">Còn lại: {loan.currentAmount.toLocaleString()} {currency}</Typography>
                                    <Typography variant="body2">Tổng số: {totalAmount.toLocaleString()} {currency}</Typography> */}
                                    <Typography variant="body2">Số tiền đã trả: {paidAmount !== undefined ? paidAmount.toLocaleString() : 0} {currency}</Typography>
                                    <Typography variant="body2">Còn lại: {debt && debt.currentAmount !== undefined ? debt.currentAmount.toLocaleString() : 0} {currency}</Typography>
                                    <Typography variant="body2">Tổng số: {totalAmount !== undefined ? totalAmount.toLocaleString() : 0} {currency}</Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <LinearProgress variant="determinate" value={calculateTimeProgress()} sx={{ height: 10, borderRadius: 5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Cho vay từ: {new Date(debt.changeDate).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Ngày hiện tại: {new Date().toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Hạn dự kiến: {new Date(debt.returnDate).toLocaleDateString()}</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6">Lịch sử giao dịch</Typography>
                                <Tabs value={period} onChange={handlePeriodChange} centered>
                                    <Tab label="All" value="all" />
                                    <Tab label="This Year" value="year" />
                                    <Tab label="Last Month" value="last_month" />
                                    <Tab label="This Month" value="month" />
                                    <Tab label="This Week" value="week" />
                                </Tabs>
                                <Grid container spacing={2}>
                                    {
                                        Object.entries(exchangesByTime).map(([label, exchangesInTime]) => (
                                            <>
                                                {exchangesInTime.map((exchange) => (
                                                    <Grid item xs={12} sm={6} key={exchange.exchangeId}>
                                                        <Card
                                                            onClick={() => handleCardClick(exchange.exchangeId)}
                                                            style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                                                            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}
                                                        >
                                                            <CardContent>
                                                                <Grid container spacing={2}>
                                                                    {/* Cột thứ nhất */}
                                                                    <Grid item xs={6}>
                                                                        <Typography variant="body1" component="h2">
                                                                            <strong>{exchange.exchangeType.exchangeTypeName}</strong>
                                                                        </Typography>
                                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                                            From: {exchange.from}
                                                                        </Typography>
                                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                                            To: {exchange.to}
                                                                        </Typography>
                                                                    </Grid>

                                                                    {/* Cột thứ hai */}
                                                                    <Grid item xs={6}>
                                                                        <Typography variant="body1" component="h2">
                                                                            <strong>{exchange.amount.toLocaleString()} {localStorage.getItem("currency")}</strong>
                                                                        </Typography>
                                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                                            Happen Time: {formatDate(exchange.exchangeDate)}
                                                                        </Typography>
                                                                        {/* Thêm các thông tin khác của giao dịch nếu cần */}
                                                                    </Grid>
                                                                </Grid>
                                                            </CardContent>
                                                            {/* Đường viền màu */}
                                                            <div style={{
                                                                height: '4px',
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
                                                ))}
                                            </>
                                        ))
                                    }
                                </Grid>
                            </CardContent>
                        </Card>

                    
                    </Box>
                </Box>
            }
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteDebt(debt.debtId)}
                    question="Xóa Debt"
                /> 
                : null
            }
            {
                updateDebt ?
                <DebtUpdateModal
                    open={updateDebt}
                    onClose={handleCloseUpdateDebtDialog}
                    onUpdateDebt={handleUpdateDebt}
                    debtId={debt.debtId}
                /> : null
            }

            <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
                <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    aria-label="add"
                    color="primary"
                    size="medium"
                    style={{ backgroundColor: '#BDDAFE ', fontSize: '3rem', transition: 'transform 0.3s ease', }} // Điều chỉnh kích thước
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <SyncAltIcon fontSize="120%"/>
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'top',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleClickOpenModalPaidAll} style={{ fontSize: '1.2rem', color: 'blue' }}>
                        <PriceCheckIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Done Debt
                    </MenuItem>
                    <DebtDoneModal onUpdateDebt={handleUpdateDebt} onClose={handleClickCloseModalPaidAll} open={openPaidAll} debtId={debtId}/>
                    <MenuItem onClick={handleClickOpenModalPaidAPart} style={{ fontSize: '1.2rem', color: 'green' }}>
                        <PaidIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Pay an Amount
                    </MenuItem>
                    <DebtPayModal onUpdateDebt={handleUpdateDebt} onClose={handleClickCloseModalPaidAPart} open={openPaidAPart} debtId={debtId}/>
                </Menu>
            </div>
        </>
    );
}

export default DebtDetailScreen;