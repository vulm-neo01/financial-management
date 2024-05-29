import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { request } from "api";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Menu, MenuItem } from '@mui/material';
import WalletRoundedIcon from '@mui/icons-material/WalletRounded';
import Divider from '@mui/material/Divider';
import UpdateWalletModal from "components/modal/UpdateWalletModal";
import ConfirmationModal from "components/modal/ConfirmationModal";
import {formatDate, formatDateTime} from "utils/formatDate";
import { groupExchangesByTime } from "utils/groupExchangesByTime";
import WalletGraph from "components/chart/WalletGraph";

function WalletDetailScreen() {
    const [wallet, setWallet] = useState(null);
    const [exchanges, setExchanges] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [updateWallet, setUpdateWallet] = React.useState(false);
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
    const exchangesByTime = groupExchangesByTime(exchanges);
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

    const useStyles = makeStyles((theme) => ({
        cardContainer: {
            display: "flex",
            justifyContent: "center",
        },
        card: {
            marginTop: theme.spacing(2),
            backgroundColor: wallet?.color?.hexCode || defaultColor, // Sử dụng màu nền từ dữ liệu ví
            width: "60%",
        },
        logo: {
            borderRadius: "20%",
            background: "rgba(255, 255, 255, 0.9)", // Màu trắng nhẹ cho nền logo
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng cho logo
            padding: theme.spacing(2), // Thêm một số khoảng trắng xung quanh logo
            width: "100px",
            height: "100px",
            margin: "0 auto",
            display: "block",
            marginTop: theme.spacing(1),
            border: "2px solid white", // Thêm viền màu trắng
        },
        title: {
            fontWeight: "bold",
            color: theme.palette.text.primary,
            textAlign: "center",
            marginBottom: theme.spacing(2),
        },
        info: {
            padding: theme.spacing(2),
        },
        infoRow: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: theme.spacing(1),
        },
        infoLabel: {
            fontWeight: "bold",
            marginLeft: theme.spacing(10),
            marginRight: theme.spacing(1),
            minWidth: "150px", // Đặt chiều rộng tối thiểu cho nhãn thông tin
        },
        infoValue: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(10),
            minWidth: "150px", // Đặt chiều rộng tối thiểu cho nhãn thông tin
            textAlign: "right",
        },
    }));
    const theme = useTheme();
    const classes = useStyles();

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

    // const calculateInitialBalance = (currentBalance, exchanges) => {
    //     // Tính toán số dư ban đầu bằng cách lùi lại các giao dịch
    //     let initialBalance = currentBalance;
    //     exchanges.slice().reverse().forEach(exchange => {
    //         if (exchange.exchange_type_id === 'spend') {
    //             initialBalance += exchange.amount;
    //         } else if (exchange.exchange_type_id === 'income') {
    //             initialBalance -= exchange.amount;
    //         } else if (exchange.exchange_type_id === 'wallet_wallet'){
    //             if(exchange.wallet_id === walletId){
    //                 initialBalance += exchange.amount;
    //             } else if(exchange.destination_id === walletId){
    //                 initialBalance -= exchange.amount;
    //             }
    //         }
    //     });
    //     return initialBalance;
    // };
    // const prepareChartDate = (exchanges, currentBalance) => {
    //     let balance = calculateInitialBalance(exchanges, currentBalance);
    //     const data = exchanges.map(exchange => {
    //         if (exchange.type === 'Spend') {
    //             balance -= exchange.amount;
    //         } else if (exchange.type === 'Income') {
    //             balance += exchange.amount;
    //         } else if (exchange.exchange_type_id === 'wallet_wallet'){
    //             if(exchange.wallet_id === walletId){
    //                 balance -= exchange.amount;
    //             } else if(exchange.destination_id === walletId){
    //                 balance += exchange.amount;
    //             }
    //         }
    //         return {
    //             date: new Date(exchange.date).toLocaleDateString(),
    //             balance: balance
    //         };
    //     });
    //     return data;
    // }

    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold'}}>
                Wallet Detail Information
            </Typography>
            <Divider variant="middle" sx={{ margin: '0 auto', width: '50%', backgroundColor: wallet?.color?.hexCode || defaultColor }} />
            {wallet && (
                <>
                    <div className={classes.cardContainer}>
                        <Card className={classes.card}>
                            {wallet.logo && wallet.logo.url && (
                                <img src={wallet.logo.url} alt="logo" className={classes.logo} />
                            )}
                            <Typography variant="h4" component="h1" className={classes.title}>
                            {wallet.name}
                            </Typography>
                            <Typography variant="h5" component="h1" className={classes.title}>
                            Số dư: {wallet.amount.toLocaleString()} {localStorage.getItem("currency")}
                            </Typography>
                            {/* <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Số tiền:</span>
                                <span className={classes.infoValue}>
                                    {wallet.amount} {localStorage.getItem("currency")}
                                </span>
                            </div> */}
                            <CardContent className={classes.info}>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Tên người sở hữu:</span>
                                <span className={classes.infoValue}>
                                    {wallet.user && `${wallet.user.firstName} ${wallet.user.lastName}`}
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Email:</span>
                                <span className={classes.infoValue}>
                                    {wallet.user && wallet.user.email}
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Loại ví:</span>
                                <span className={classes.infoValue}>
                                    {typeLabels[wallet.type]}
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Miêu tả chi tiết:</span>
                                <span className={classes.infoValue}>
                                    {wallet.description}
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Created At:</span>
                                <span className={classes.infoValue}>
                                    {formatDateTime(wallet.createdAt)}
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Updated At:</span>
                                <span className={classes.infoValue}>
                                    {formatDateTime(wallet.updatedAt)}
                                </span>
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Box sx={{ marginTop: theme.spacing(2), display: 'flex', maxHeight: '60vh', overflowY: 'auto', }}>
                        {/* <Typography variant="h5" gutterBottom style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2), alignItems: 'center'}}>
                            Exchange History
                        </Typography> */}
                        {exchanges && exchanges.length > 0 ? 
                        <Grid container spacing={2} item xs={6} justifyContent="center" alignItems="center" key={exchanges.exchangeId}>
                            {
                                Object.entries(exchangesByTime).map(([label, exchangesInTime]) => (
                                    <>  
                                        {exchangesInTime && exchangesInTime.length > 0 &&
                                            <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), alignItems: 'center'}}>
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
                                                                <Typography variant="h5" component="h2">
                                                                    {exchange.exchangeType.exchangeTypeName}
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
                                                                <Typography variant="h6" component="h2">
                                                                    Amount: {exchange.amount.toLocaleString()} {localStorage.getItem("currency")}
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
                        : 
                            <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2), alignItems: 'center'}}>
                                Nothing to Show here, create your first Exchange!
                            </Typography>
                        }

                        <div style={{ width: theme.spacing(4) }} />  

                        {/* Phần Graph */}
                        {exchanges && exchanges.length > 0 && 
                        <WalletGraph exchanges={exchanges} currentBalance={wallet.amount} walletId={walletId} createAt={wallet.createdAt}/>
                        }
                    </Box>
                </>
            )}
            <div style={{ position: 'fixed', bottom: 40, right: 40 }}>
                <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    aria-label="add"
                    color="primary"
                    size="large"
                    style={{ backgroundColor: '#BDDAFE ', fontSize: '4rem' }} // Điều chỉnh kích thước
                >
                    <WalletRoundedIcon fontSize="150%"/>
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top', // Chỉnh sửa dòng này
                        horizontal: 'top',
                    }}
                    transformOrigin={{
                        vertical: 'bottom', // Chỉnh sửa dòng này
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleClickOpenModalDelete} style={{ fontSize: '1.4rem', color: 'red' }}>
                        <DeleteIcon style={{ marginRight: 8, fontSize: '2rem'}} /> Delete
                    </MenuItem>
                    <MenuItem onClick={handleOpenUpdateWalletDialog} style={{ fontSize: '1.4rem', color: 'blue' }}>
                        <EditIcon style={{ marginRight: 8, fontSize: '2rem'}} /> Edit
                    </MenuItem>
                </Menu>
            </div>
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
