import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, Grid, Divider, Tabs, Tab, IconButton, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { request } from 'api';
import ConfirmationModal from 'components/modal/ConfirmationModal';
import {formatDate, formatDateTime} from "utils/formatDate";
import { useTheme } from "@mui/material/styles";
import "../../css/SavingDetail.css"
import { currency } from 'utils/currency';
import SavingUpdateModal from 'components/modal/SavingUpdateModal';
import { groupExchangesByTime } from 'utils/groupExchangesByTime';
import SavingGraph from 'components/chart/SavingGraph';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SavingDoneModal from 'components/modal/SavingDoneModal';

const receiveTypes = {
    DAILY: "Hằng ngày",
    WEEKLY: "Hằng tuần",
    MONTHLY: "Hằng tháng",
    EVERY_TWO_MONTH: "Mỗi 2 tháng",
    EVERY_THREE_MONTH: "Mỗi 3 tháng",
    EVERY_SIX_MONTH: "Mỗi 6 tháng",
    YEARLY: "Hằng năm"
}
const savingTypes = {
    NO_INTEREST: "Không lãi suất",
    SIMPLE_INTEREST: "Lãi đơn",
    COMPOUND: "Lãi kép không tích lũy",
    ACCUMULATE_COMPOUND: "Lãi kép có tích lũy",
    INTEREST_RETURN_WALLET: "Lãi trả về Wallet",
}
function SavingDetailScreen() {
    const { savingId } = useParams();
    const history = useHistory();
    const [saving, setSaving] = useState(null);
    const [updateSaving, setUpdateSaving] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [exchanges, setExchanges] = useState([]);
    const [exchangesHistory, setExchangesHistory] = useState([]);
    const [isMessageOpen, setIsMessageOpen] = useState(true);
    const [period, setPeriod] = useState('all');
    const [doneSaving, setDoneSaving] = useState(false);
    const handleClickOpenModalDelete = () => {
        setIsModalDeleteOpen(true);
    };

    const handleClickCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOpenUpdateSavingDialog = () => {
        setUpdateSaving(true);
    };

    const handleCloseUpdateSavingDialog = () => {
        setUpdateSaving(false);
    };

    const handleOpenDoneSaving = () => {
        setDoneSaving(true);
    };

    const handleCloseDoneSaving = () => {
        setDoneSaving(false);
    };

    const handleUpdateSaving = (updatedSaving) => {
        setSaving(updatedSaving);
        request('get', `/exchanges/saving/${savingId}`, (res) => {
            // console.log(res.data);
            setExchanges(res.data);
        });
        request('get', `/exchanges/saving-history/${savingId}`, (res) => {
            const transformedData = res.data.map(item => ({
                ...item,
                date: new Date(item.exchangeDate).toLocaleDateString('vi-VN')
            }));
            setExchangesHistory(transformedData);
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
    const calculateProgress = () => {
        if (!saving) return 0;
        const { currentAmount, targetAmount } = saving;
        if(currentAmount > targetAmount){
            return 100;
        }
        return (currentAmount / targetAmount) * 100;
    };

    const calculateTimeProgress = () => {
        if (!saving) return 0;
        const { startDate, targetDate } = saving;
        const totalDuration = new Date(targetDate) - new Date(startDate);
        const elapsedDuration = new Date() - new Date(startDate);
        if(elapsedDuration > totalDuration){
            return 100;
        }
        return (elapsedDuration / totalDuration) * 100;
    };

    const getMotivationalMessage = () => {
        const progress = calculateProgress();
        const timeProgress = calculateTimeProgress();

        if (progress >= 100) {
            return "Chúc mừng! Bạn đã đạt được mục tiêu tiết kiệm.";
        } else if (timeProgress >= 100) {
            return "Tiếc quá, có vẻ thời gian tiết kiệm đã hết rồi :<";
        } else if (progress >= 75) {
            return "Bạn đã rất gần mục tiêu rồi đó!";
        } else if (progress >= 50) {
            return "Bạn đã đi được một nửa chặng đường. Tiếp tục tiết kiệm nha!";
        } else if (progress >= 25) {
            return "Khởi đầu tuyệt vời! Tiếp tục tiết kiệm nhé!";
        } else {
            return "Bắt đầu hành trình tiết kiệm. Hãy giữ vững tinh thần!";
        }
    };

    const handleDeleteSaving = (savingId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/savings/${savingId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
        }, (error) => {
            console.error("Error when delete saving:", error);
            // Xử lý lỗi nếu cần thiết
        });
        setIsModalDeleteOpen(false);
        history.push(`/savings`);
    };

    useEffect(() => {
        request('get', `/savings/${savingId}`, (res) => {
            // console.log(res.data);
            setSaving(res.data);
        });
        request('get', `/exchanges/saving/${savingId}`, (res) => {
            // console.log(res.data);
            setExchanges(res.data);
        });
        request('get', `/exchanges/saving-history/${savingId}`, (res) => {
            console.log(res.data);
            const transformedData = res.data.map(item => ({
                ...item,
                date: new Date(item.exchangeDate).toLocaleDateString('vi-VN')
            }));
            setExchangesHistory(transformedData);
        });
    }, [savingId]);

    return (
        <>
            {
                saving 
                && 
                <Box sx={{ display: 'flex', maxHeight: '110vh' }}>
                    <Box sx={{ backgroundColor: `${saving.color && saving.color.colorId}`, width: '25%', padding: 2, borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '12px'  }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <IconButton onClick={() => history.push("/savings")}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography style={{marginLeft: "4px"}} variant="h6" sx={{ flexGrow: 1 }}>{saving.name}</Typography>
                            </Box>
                            <div className='saving-detail'>
                                <Box className="info">
                                    <img src={saving.logo.url} alt={saving.name} sizes='40px' />
                                    <div className="field" style={{justifyContent: "center"}}>
                                        <span>{saving.savingCategory.name}</span>
                                    </div>
                                    <div className="field">
                                        <label>Loại Saving:</label>
                                        <span>{savingTypes[saving.savingType]}</span>
                                    </div>
                                    <div className="field">
                                        <label>Tiền gốc:</label>
                                        <span>{saving.originAmount.toLocaleString()} đ</span>
                                    </div>
                                    <div className="field">
                                        <label>Hiện tại:</label>
                                        <span>{saving.currentAmount.toLocaleString()} đ</span>
                                    </div>
                                    <div className="field">
                                        <label>Mục tiêu:</label>
                                        <span>{saving.targetAmount.toLocaleString()} đ</span>
                                    </div>
                                    {saving.savingType !== "NO_INTEREST" && (
                                        <>
                                            <div className="field">
                                                <label>Kỳ hạn nhận lãi:</label>
                                                <span>{receiveTypes[saving.receiveInterestTime]}</span>
                                            </div>
                                            <div className="field">
                                                <label>Lãi:</label>
                                                <span>{saving.interestRate} %/năm</span>
                                            </div>
                                        </>
                                    )}
                                    {/* {saving.savingType === "INTEREST_RETURN_WALLET" && (
                                        <div className="field">
                                            <label>Wallet Receive:</label>
                                            <span style={{textDecoration: 'none', cursor: 'pointer', color: 'blue'}} 
                                                            onClick={() => history.push(`/wallets/${saving.walletId}`)}>
                                                Click here
                                            </span>
                                        </div>
                                    )} */}
                                    <div className="field">
                                        <label>Ngày bắt đầu:</label>
                                        <span>{new Date(saving.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="field">
                                        <label>Ngày mục tiêu:</label>
                                        <span>{new Date(saving.targetDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="field">
                                        <label>Mô tả:</label>
                                        <span>{saving.description}</span>
                                    </div>
                                </Box>
                            </div>
                        </Box>
                        <Box sx={{ textAlign: 'center'}} className="action-buttons">
                            <Button
                                onClick={handleOpenDoneSaving}
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                sx={{ m: 1, minWidth: 190 }}
                                disabled={!saving.isActive}
                            >
                                Done Saving
                            </Button>
                            <Button
                                onClick={handleOpenUpdateSavingDialog}
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                sx={{ ml: 1, mr:1, mt: 1, minWidth: 100 }}
                                disabled={!saving.isActive}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleClickOpenModalDelete}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{ ml: 1, mr:1, mt: 1, minWidth: 100 }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{width: '75%', paddingLeft: 2, paddingRight: 2}}>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Tiến độ tiết kiệm</Typography>
                                <LinearProgress variant="determinate" value={calculateProgress()} sx={{ height: 10, borderRadius: 5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body2">Tiền gốc: {saving.originAmount.toLocaleString()} {currency}</Typography>
                                    <Typography variant="body2">Hiện tại: {saving.currentAmount.toLocaleString()} {currency}</Typography>
                                    <Typography variant="body2">Mục tiêu: {saving.targetAmount.toLocaleString()} {currency}</Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <LinearProgress variant="determinate" value={calculateTimeProgress()} sx={{ height: 10, borderRadius: 5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Ngày bắt đầu: {new Date(saving.startDate).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Ngày hiện tại: {new Date().toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Ngày mục tiêu: {new Date(saving.targetDate).toLocaleDateString()}</Typography>
                                </Box>
                                {isMessageOpen &&
                                    <div onClick={() => setIsMessageOpen(false)}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                                            {isMessageOpen && getMotivationalMessage()}
                                        </Typography>
                                    </div>
                                }
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Biểu đồ tiết kiệm</Typography>
                                <SavingGraph history={exchangesHistory} targetAmount={saving.targetAmount}/>
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
                                                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                                                            <strong>From:</strong> {exchange.from}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                                                            <strong>To:</strong> {exchange.to}
                                                                        </Typography>
                                                                    </Grid>

                                                                    {/* Cột thứ hai */}
                                                                    <Grid item xs={6}>
                                                                        <Typography variant="body1" component="h2">
                                                                            <strong>{exchange.amount.toLocaleString()} đ</strong>
                                                                        </Typography>
                                                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                                                            <strong>Happen Time:</strong> {formatDate(exchange.exchangeDate)}
                                                                        </Typography>
                                                                        {/* Thêm các thông tin khác của giao dịch nếu cần */}
                                                                    </Grid>
                                                                </Grid>
                                                            </CardContent>
                                                            {/* Đường viền màu */}
                                                            <div style={{
                                                                height: '5px',
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
                    onConfirm={() => handleDeleteSaving(saving.savingId)}
                    question="Xóa Saving"
                /> 
                : null
            }
            {
                updateSaving ?
                <SavingUpdateModal
                    open={updateSaving}
                    onClose={handleCloseUpdateSavingDialog}
                    onCreateSaving={handleUpdateSaving}
                    savingId={saving.savingId}
                /> : null
            }
            {
                doneSaving ?
                <SavingDoneModal onClose={handleCloseDoneSaving} open={doneSaving} onUpdateSaving={handleUpdateSaving} savingId={savingId}/>
                : null
            }
        </>
    );
}

export default SavingDetailScreen;