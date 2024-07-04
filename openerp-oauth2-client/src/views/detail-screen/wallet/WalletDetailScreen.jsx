import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { request } from "api";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Tabs, Tab, Card, CardContent, Divider, Button } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import WalletRoundedIcon from '@mui/icons-material/WalletRounded';
import UpdateWalletModal from "components/modal/UpdateWalletModal";
import ConfirmationModal from "components/modal/ConfirmationModal";
import {formatDate, formatDateTime} from "utils/formatDate";
import { groupExchangesByTime } from "utils/groupExchangesByTime";
import WalletGraph from "components/chart/WalletGraph";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../css/WalletDetail.css'

function WalletDetailScreen() {
    const [wallet, setWallet] = useState(null);
    const [exchanges, setExchanges] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [updateWallet, setUpdateWallet] = React.useState(false);
    const [period, setPeriod] = useState('all');
    const [changeStatusForm, setChangeStatusForm] = useState(
        {
            userId: localStorage.getItem('userId'),
            status: false
        }
    );
    const history = useHistory ();
    let { walletId } = useParams();
    const currency = localStorage.getItem("currency");
    const defaultColor = "#ffffff";
    const typeLabels = {
        "cash": "Cash Wallet",
        "e-wallet": "E-Wallet",
        "bank-account": "Bank Account",
        "credit": "Credit Card",
        "other": "Other",
    };
    const handleOpenUpdateWalletDialog = () => {
        setUpdateWallet(true);
        handleClose();
    };
    
    const handleCloseUpdateWalletDialog = () => {
        setUpdateWallet(false);
        // setWalletId(null);
    };
    
    const handleClickOpenModalDelete = () => {
        setIsModalDeleteOpen(true);
        handleClose();
    };
    
    const handleClickCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleDeleteWallet = (walletId) => {
        console.log(changeStatusForm);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/wallet/${walletId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
        }, (error) => {
            console.error("Error when delete wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, changeStatusForm);
        setIsModalDeleteOpen(false);
        history.push(`/wallets`);
    };
    
    useEffect(() => {
        // console.log("Wallet ID:", walletId);
        request("get", `/wallet/${walletId}`, (res) => {
            console.log(res.data);
            setWallet(res.data);
        }).then();
        
        request("get", `/exchanges/wallet/${walletId}`, (res) => {
            console.log(res.data.sort((a, b) => new Date(b.exchangeDate) - new Date(a.exchangeDate)));
            setExchanges(res.data);
        }).then();
    }, []);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleCardClick = (exchangeId) => {
        history.push(`/exchanges/${exchangeId}`);
    }
    
    const handleUpdateWalletData = (updatedWallets) => {
        // Cập nhật dữ liệu danh sách ví trong WalletManagementScreen
        // console.log(updatedWallets);
        const updateWalletItem = updatedWallets.find(item => item.walletId === walletId);
        console.log(updateWalletItem);
        setWallet(updateWalletItem);
    };
    
    const filterExchanges = (exchanges, period) => {
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                    case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                break;
                default:
                    startDate = null;
                }
                
                if (startDate) {
                    return exchanges.filter(exchange => new Date(exchange.exchangeDate) >= startDate);
                } else {
            return exchanges;
        }
    };
    
    const handlePeriodChange = (event, newValue) => {
        setPeriod(newValue);
    };
    
    const filteredExchanges = filterExchanges(exchanges, period);
    const exchangesByTime = groupExchangesByTime(filteredExchanges);

    return (
            <Box sx={{ display: 'flex', height: '80vh' }}>
                {wallet && 
                    <Box sx={{ backgroundColor: `${wallet.color && wallet.color.colorId}`, width: '25%', padding: 2, borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '12px' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <IconButton onClick={() => history.push("/wallets")}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>{wallet.name}</Typography>
                            </Box>
                            <div className="wallet-detail">
                                <Box className="info" sx={{ textAlign: 'center', mt: 2 }}>
                                    <img src={wallet.logo.url} alt={wallet.name} style={{ width: '50%', marginBottom: 16 }} />
                                    <Typography className="field" variant="body1">
                                        <label>
                                            Số dư: 
                                        </label>
                                        {wallet.amount.toLocaleString()} đ
                                    </Typography>
                                    <Typography className="field" variant="body2">
                                        <label>
                                            Loại ví: 
                                        </label>
                                        {typeLabels[wallet.type]}
                                    </Typography>
                                    <Typography className="field" variant="body2">
                                        <label>
                                            Ngày tạo: 
                                        </label>
                                        {formatDate(wallet.createdAt)}
                                    </Typography>
                                    <Typography className="field" variant="body2">
                                        <label>
                                            Ngày cập nhật: 
                                        </label>
                                        {formatDate(wallet.updatedAt)}
                                    </Typography>
                                    <Typography className="field" variant="caption">
                                        <label>
                                            Mô tả: 
                                        </label>
                                        {wallet.description}
                                    </Typography>
                                    
                                </Box>
                            </div>
                        </Box>
                        <Box sx={{ textAlign: 'center', mb: 1 }}>
                            <Button
                                onClick={handleOpenUpdateWalletDialog}
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                sx={{ ml: 1, mr: 1, mt: 1, minWidth: 100 }}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleClickOpenModalDelete}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{ ml: 1, mr: 1, mt: 1, minWidth: 100 }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                }
                <Box sx={{width: '75%', paddingLeft: 2, paddingRight: 2}}>
                    {wallet && (
                        <>
                            <Tabs value={period} onChange={handlePeriodChange} centered>
                                <Tab label="All" value="all" />
                                <Tab label="This Year" value="year" />
                                <Tab label="This Month" value="month" />
                                <Tab label="This Week" value="week" />
                            </Tabs>
                            {/* Phần Graph */}
                            {filteredExchanges && filteredExchanges.length > 0 && 
                                <WalletGraph exchanges={filteredExchanges} currentBalance={wallet.amount} walletId={walletId} createAt={wallet.createdAt}/>
                            }
                            <Divider />
                            
                            <Box sx={{ display: 'flex',justifyContent: 'center', maxHeight: '80vh', overflowY: 'auto', }}>
                                {filteredExchanges && filteredExchanges.length > 0 ? 
                                <Grid container spacing={2} item xs={10} justifyContent="center" alignItems="center" key={exchanges.exchangeId}>
                                    {
                                        Object.entries(exchangesByTime).map(([label, exchangesInTime]) => (
                                            <>  
                                                {exchangesInTime && exchangesInTime.length > 0 &&
                                                    <Typography variant="h6" gutterBottom style={{marginTop: '24px', alignItems: 'center'}}>
                                                        {label}
                                                    </Typography>            
                                                }
                                                {exchangesInTime.map((exchange) => (
                                                    <Grid item xs={12} key={exchange.exchangeId}>
                                                        <Card
                                                            onClick={() => handleCardClick(exchange.exchangeId)} 
                                                            style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                                                            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}
                                                            key={exchange.exchangeId}
                                                        >
                                                            <CardContent>
                                                                <Grid container spacing={2}>
                                                                    {/* Cột thứ nhất */}
                                                                    <Grid item xs={6}>
                                                                        <Typography variant="h6" component="h2">
                                                                            {exchange.exchangeType.exchangeTypeName}
                                                                        </Typography>
                                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                                            <strong>Từ:</strong> {exchange.from}
                                                                        </Typography>
                                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                                            <strong>Đến:</strong> {exchange.to}
                                                                        </Typography>
                                                                    </Grid>

                                                                    {/* Cột thứ hai */}
                                                                    <Grid item xs={6}>
                                                                        <Typography variant="h6" component="h2">
                                                                            Số tiền: {exchange.amount.toLocaleString()} {localStorage.getItem("currency")}
                                                                        </Typography>
                                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                                            <strong>Thời gian:</strong> {formatDate(exchange.exchangeDate)}
                                                                        </Typography>
                                                                        {/* Thêm các thông tin khác của giao dịch nếu cần */}
                                                                    </Grid>
                                                                </Grid>
                                                            </CardContent>
                                                            {/* Đường viền màu */}
                                                            <div style={{
                                                                height: '3px',
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
                                : 
                                    <Typography variant="h6" gutterBottom style={{ marginTop: '8px', alignItems: 'center'}}>
                                        Nothing to Show here, create your first Exchange!
                                    </Typography>
                                }
                            </Box>
                        </>
                    )}
                </Box>
            {updateWallet ? 
                <UpdateWalletModal onUpdateWallet={handleUpdateWalletData} open={updateWallet} onClose={handleCloseUpdateWalletDialog} walletId={walletId}/>
                : null
            }
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteWallet(walletId)}
                    question="Xóa Wallet"
                /> 
                : null
            }
        </Box>
    );
}

export default WalletDetailScreen;
