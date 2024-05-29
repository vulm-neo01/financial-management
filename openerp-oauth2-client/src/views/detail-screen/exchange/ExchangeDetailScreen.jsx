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
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Menu, MenuItem, Tooltip } from '@mui/material';
import Divider from '@mui/material/Divider';
import ConfirmationModal from "components/modal/ConfirmationModal";
import {formatDate, formatDateTime} from "utils/formatDate";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import UpdateSpendModal from "components/modal/UpdateSpendModal";
import UpdateIncomeModal from "components/modal/UpdateIncomeModal";
import UpdateWalletExchangeModal from "components/modal/UpdateWalletExchangeModal";
import ImageZoomModal from "components/modal/ImageZoomModal";

function ExchangeDetailScreen() {
    const [exchange, setExchange] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [updateIncome, setUpdateIncome] = React.useState(false);
    const [updateSpend, setUpdateSpend] = React.useState(false);
    const [updateWalletToWallet, setUpdateWalletToWallet] = React.useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const [changeStatusForm, setChangeStatusForm] = useState(
        {
            userId: localStorage.getItem('userId'),
            status: false
        }
    );
    const history = useHistory ();
    let { exchangeId } = useParams();
    const currency = localStorage.getItem("currency");
    const defaultColor = "#ffffff";

    const handleDeleteExchange = () => {
        console.log(changeStatusForm);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/exchanges/${exchangeId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
        }, (error) => {
            console.error("Error when delete exchange:", error);
            // Xử lý lỗi nếu cần thiết
        }, changeStatusForm);
        setIsModalDeleteOpen(false);
        history.push(`/exchanges`);
    };

    const handleUpdateExchange = (updateExchanges) => {
        const filteredExchange = updateExchanges.find((exchange) => exchange.exchangeId === exchangeId);
        setExchange(filteredExchange)
    }

    useEffect(() => {
        console.log("Exchange ID:", exchangeId);
        request("get", `/exchanges/${exchangeId}`, (res) => {
        console.log(res.data);
        setExchange(res.data);
        }).then();
    }, []);

    const handleOpenUpdateExchangeDialog = () => {
        console.log(exchange.exchangeType.exchangeTypeId);
        if(exchange.exchangeType.exchangeTypeId === 'income'){
        setUpdateIncome(true);
        } else if(exchange.exchangeType.exchangeTypeId === 'spend'){
        setUpdateSpend(true);
        } else if(exchange.exchangeType.exchangeTypeId === 'wallet_wallet'){
        setUpdateWalletToWallet(true);
        }
        handleClose();
    };
    
    const handleCloseUpdateExchangeDialog = () => {
        setUpdateIncome(false);
        setUpdateSpend(false);
        setUpdateWalletToWallet(false);
    };

    const handleClickOpenModalDelete = () => {
        setIsModalDeleteOpen(true);
        handleClose();
    };

    const handleClickCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleZoomImage = () => {
        setIsImageModalOpen(true);
    }

    const handleFromClick = () => {
        console.log('handleFromClick: ' + exchange.exchangeType.exchangeTypeId)
        const exchangeTypeId = exchange.exchangeType.exchangeTypeId;
        const exchangeTypeParts = exchangeTypeId.split('_');
        const fromType = exchangeTypeParts[0];
        if (fromType === 'wallet' || exchangeTypeId === 'spend') {
            history.push(`/wallets/${exchange.wallet.walletId}`);
        } else if (fromType === 'saving'){
            history.push(`/savings/${exchange.walletId}`);
        } else if (fromType === 'debt'){
            history.push(`/debts/${exchange.walletId}`);
        } else if (fromType === 'loan'){
            history.push(`/loans/${exchange.walletId}`);
        }
    };
    
    const handleToClick = () => {
        const exchangeTypeId = exchange.exchangeType.exchangeTypeId;
        const exchangeTypeParts = exchangeTypeId.split('_');
        const toType = exchangeTypeParts[1];
        console.log("ToType:" + toType)
        if (exchangeTypeId === 'income') {
            history.push(`/wallets/${exchange.wallet.walletId}`);
        } else if (toType === 'wallet'){
            history.push(`/wallets/${exchange.destinationId}`);
        } else if (toType === 'saving'){
            history.push(`/savings/${exchange.destinationId}`);
        } else if (toType === 'debt'){
            history.push(`/debts/${exchange.destinationId}`);
        } else if (toType === 'loan'){
            history.push(`/loans/${exchange.destinationId}`);
        }
    };
    const useStyles = makeStyles((theme) => ({
        cardContainer: {
            display: "flex",
            justifyContent: "center",
        },
        title: {
            fontWeight: "bold",
            color: theme.palette.text.primary,
            textAlign: "center",
            marginBottom: theme.spacing(2),
        },
        card: {
            marginTop: theme.spacing(2),
            backgroundColor: defaultColor,
            width: "60%",
        },
        info: {
            padding: theme.spacing(2),
        },
        infoRow: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: theme.spacing(2),
        },
        infoLabel: {
            fontWeight: "bold",
            marginLeft: theme.spacing(10),
            marginRight: theme.spacing(1),
            minWidth: "200px",
        },
        infoValue: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(10),
            minWidth: "200px",
            textAlign: "right",
        },
        link: {
            textDecoration: 'none',
            cursor: 'pointer',
            color: 'blue',
            '&:hover': {
                color: 'darkblue',
                fontWeight: 'bold',
            },
        },
        imageRow: {
            display: "flex",
            justifyContent: "center",
            marginBottom: theme.spacing(2),
        },
        exchangeImage: {
            /* Adjust these properties as needed */
            maxWidth: "300px", /* Set a maximum width for the image */
            maxHeight: "200px", /* Set a maximum height for the image */
            borderRadius: "4px", /* Add rounded corners */
            objectFit: "cover", /* Scale the image to fill the container while maintaining aspect ratio */
        },
        logo: {
            borderRadius: "20%",
            background: "rgba(255, 255, 255, 0.9)", // Màu trắng nhẹ cho nền logo
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng cho logo
            padding: theme.spacing(2), // Thêm một số khoảng trắng xung quanh logo
            width: "120px",
            height: "120px",
            display: "block",
            border: "2px solid white", // Thêm viền màu trắng
        },
        linkLogo: {
            borderRadius: "20%",
            background: "rgba(255, 255, 255, 0.9)", // Màu trắng nhẹ cho nền logo
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng cho logo
            padding: theme.spacing(1), // Thêm một số khoảng trắng xung quanh logo
            width: "120px",
            height: "120px",
            margin: "0 auto",
            display: "block",
            marginTop: theme.spacing(1),
            border: "2px solid white", // Thêm viền màu trắng
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
    const typeLabels = {
        "income": "Thu nhập",
        "spend": "Chi tiêu",
        "wallet_wallet": "Chuyển từ Ví qua Ví",
        "wallet_saving": "Chuyển từ Ví qua Tiết kiệm",
        "other": "Khác",
    };
    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
                Exchange Detail Information
            </Typography>
            <Divider
                variant="middle"
                sx={{
                margin: "0 auto",
                width: "50%",
                backgroundColor: "#BDDAFE",
                }}
            />
            {exchange && (
                <>
                <div className={classes.cardContainer}>
                    <Card className={classes.card}>
                        {exchange.category?.logo && exchange.category?.logo?.url ? (
                            <a href={`/budgets/${exchange.category.budgetCategoryId}`} target="_blank" rel="noopener noreferrer" className={classes.linkLogo}>
                                <img 
                                src={exchange.category.logo.url} 
                                alt={exchange.category.name} 
                                className={classes.logo} 
                                />
                            </a>
                        ) : null}

                        <CardContent className={classes.info}>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>From:</span>
                                <span className={classes.infoValue} onClick={handleFromClick}>
                                    <span className={classes.link}>
                                        {exchange.from}
                                    </span>
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>To:</span>
                                <span className={classes.infoValue} onClick={handleToClick}>
                                    <span className={classes.link}>
                                        {exchange.to}
                                    </span>
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Amount:</span>
                                <span className={classes.infoValue}>
                                    {exchange.amount.toLocaleString()} {currency}
                                </span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Budget:</span>
                                {exchange.category && exchange.category.name ?
                                    (<span className={classes.infoValue}>{exchange.category.name}</span>)
                                    :
                                    (<span className={classes.infoValue}>No Budget Available!</span>)
                                }
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Exchange Type:</span>
                                <span className={classes.infoValue}>{typeLabels[exchange.exchangeType.exchangeTypeId]}</span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Exchange Date:</span>
                                <span className={classes.infoValue}>{formatDate(exchange.exchangeDate)}</span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Created At:</span>
                                <span className={classes.infoValue}>{formatDateTime(exchange.createdAt)}</span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Updated At:</span>
                                <span className={classes.infoValue}>{formatDateTime(exchange.updatedAt)}</span>
                            </div>
                            <div className={classes.infoRow}>
                                <span className={classes.infoLabel}>Description:</span>
                                <span className={classes.infoValue}>{exchange.description}</span>
                            </div>
                                  {/* Image section */}
                            <div className={classes.imageRow}>
                                {exchange.imageUrl ? (
                                    <>
                                        <img
                                            src={exchange.imageUrl}
                                            alt={exchange.description || "Exchange Image"} // Add alt text for accessibility
                                            className={classes.exchangeImage}
                                            onClick={handleZoomImage}
                                            style={{ cursor: 'pointer' }} // Add hover cursor style
                                        />
                                        {isImageModalOpen &&
                                            <ImageZoomModal imageUrl={exchange.imageUrl} onClose={() => setIsImageModalOpen(false)}/>
                                        }
                                    </>
                                ) : (<span className={classes.infoValue}>No Image Exchange added!</span>)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
                    <CurrencyExchangeRoundedIcon fontSize="150%"/>
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
                    <MenuItem onClick={handleOpenUpdateExchangeDialog} style={{ fontSize: '1.4rem', color: 'green' }}>
                        <EditIcon style={{ marginRight: 8, fontSize: '2rem'}} /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleClose} style={{ fontSize: '1.4rem', color: 'blue' }}>
                        <ContentCopyIcon style={{ marginRight: 8, fontSize: '2rem'}} /> Copy Exchange
                    </MenuItem>
                    <MenuItem onClick={handleClickOpenModalDelete} style={{ fontSize: '1.4rem', color: 'red' }}>
                        <DeleteIcon style={{ marginRight: 8, fontSize: '2rem'}} /> Delete
                    </MenuItem>
                </Menu>
            </div>
            {isModalDeleteOpen && (
                <ConfirmationModal
                open={isModalDeleteOpen}
                onClose={handleClickCloseModalDelete}
                onConfirm={handleDeleteExchange}
                question="Xóa Exchange"
                alert="Lưu ý: Xóa Exchange sẽ không thể hoàn tác."
                />
            )}
            {
                updateIncome ?
                <UpdateIncomeModal 
                    onUpdateExchange={handleUpdateExchange} 
                    open={updateIncome} 
                    onClose={handleCloseUpdateExchangeDialog} 
                    exchangeId={exchangeId}
                />
                : null
            }
            {
                updateSpend ?
                <UpdateSpendModal 
                    onUpdateExchange={handleUpdateExchange} 
                    open={updateSpend} 
                    onClose={handleCloseUpdateExchangeDialog} 
                    exchangeId={exchangeId}
                />
                : null
            }
            {
                updateWalletToWallet ?
                <UpdateWalletExchangeModal 
                    onUpdateExchange={handleUpdateExchange} 
                    open={updateWalletToWallet} 
                    onClose={handleCloseUpdateExchangeDialog} 
                    exchangeId={exchangeId}
                />
                : null
            }
            </Box>
        );
    }

export default ExchangeDetailScreen;
