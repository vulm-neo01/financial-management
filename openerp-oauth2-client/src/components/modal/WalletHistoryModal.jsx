import React, { useState, useEffect } from 'react';
import { Box, Modal} from '@mui/material';
import { request } from 'api';
import LogoSelection from 'components/selection/LogoSelection';
import ColorSelection from 'components/selection/ColorSelection';
import { useHistory } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import {formatDate, formatDateTime} from "utils/formatDate";
import { groupExchangesByTime } from "utils/groupExchangesByTime";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

function WalletHistoryModal({open, onClose }) {
    const currency = localStorage.getItem('currency');
    const userId = localStorage.getItem('userId');
    const [exchanges, setExchanges] = useState([]);
    const history = useHistory ();
    const exchangesByTime = groupExchangesByTime(exchanges);
    const theme = useTheme();

    useEffect(() => {
        request("get", `exchanges/all/${userId}`, (res) => {
            const filteredData = res.data.filter(exchange => 
                exchange.exchangeType.exchangeTypeId.includes('wallet') || 
                exchange.exchangeType.exchangeTypeId === 'income' || 
                exchange.exchangeType.exchangeTypeId === 'spend'
            );
            // Sắp xếp dữ liệu theo ngày giao dịch
            const sortedData = filteredData.sort((a, b) => new Date(b.exchangeDate) - new Date(a.exchangeDate));
            // console.log(sortedData);
            setExchanges(sortedData);
        }).then();
    }, []);
    const handleCardClick = (exchangeId) => {
        history.push(`/exchanges/${exchangeId}`);
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
                    <Box                 
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: 'background.paper',
                            pt: 2,
                            pb: 2,
                            pl: 4,
                            pr: 4,
                            borderRadius: 2,
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}
                    >
                        {exchanges && exchanges.length > 0 ? 
                        <Grid container spacing={2} item xs={12} justifyContent="center" alignItems="center">
                            <Typography variant="h5" gutterBottom style={{marginTop: "8px"}}>
                                Wallet History
                            </Typography>
                            {
                                Object.entries(exchangesByTime).map(([label, exchangesInTime]) => (
                                    <div key={label}>  
                                        {exchangesInTime && exchangesInTime.length > 0 &&
                                            <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), alignItems: 'center'}}>
                                                {label}
                                            </Typography>            
                                        }
                                        {exchangesInTime.map((exchange) => (
                                            <Grid item xs={12} key={exchange.exchangeId}>
                                                <Card
                                                    onClick={() => handleCardClick(exchange.exchangeId)} 
                                                    style={{ 
                                                        cursor: 'pointer', 
                                                        transition: 'background-color 0.3s',
                                                        marginBottom: theme.spacing(1) // Thêm margin dưới cho mỗi thẻ
                                                    }}
                                                    sx={{ '&:hover': { backgroundColor: '#f0f0f0' }, minWidth: 400}}
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
                                                                    <strong>Amount:</strong> {exchange.amount.toLocaleString()} đ
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
                                    </div>
                                ))
                            }
                        </Grid>
                        : 
                            <Typography variant="h6" gutterBottom style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2), alignItems: 'center'}}>
                                Nothing to Show here, create your first Exchange!
                            </Typography>
                        }
                    </Box>
        </Modal>
    );
}

export default WalletHistoryModal;
