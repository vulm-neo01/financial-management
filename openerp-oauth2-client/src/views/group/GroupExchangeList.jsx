import React, { useState, useEffect } from "react";
import { request } from "api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { TabPanel } from "components/tab/TabPanel";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { currency, symbol } from "utils/currency";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { formatDate } from "utils/formatDate";
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCardIcon from '@mui/icons-material/AddCard';
import WalletIcon from '@mui/icons-material/Wallet';
import SavingsIcon from '@mui/icons-material/Savings';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useHistory } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ConfirmationModal from "components/modal/ConfirmationModal";
import GroupCreateSpendModal from "components/modal/GroupCreateSpendModal";
import GroupCreateIncomeModal from "components/modal/GroupCreateIncomeModal";
import ImageZoomModal from "components/modal/ImageZoomModal";
import GroupUpdateIncomeModal from "components/modal/GroupUpdateIncomeModal";
import GroupUpdateSpendModal from "components/modal/GroupUpdateSpendModal";


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

const GroupExchangeList  = ({groupWalletId, onUpdateAmount}) => {
    const [exchanges, setExchanges] = useState([]);
    const [selectedExchangeType, setSelectedExchangeType] = useState("spend");
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [exchangeId, setExchangeId] = React.useState(null);
    const [addIncome, setAddIncome] = React.useState(false);
    const [updateIncome, setUpdateIncome] = React.useState(false);
    const [updateSpend, setUpdateSpend] = React.useState(false);
    const [addSpend, setAddSpend] = React.useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq');
    const userId = localStorage.getItem("userId");
    const history = useHistory ();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOpenIncomeExchangeDialog = () => {
        setAddIncome(true);
        handleClose();
    };

    const handleCloseIncomeExchangeDialog = () => {
        setAddIncome(false);
    };

    const handleOpenUpdateExchangeDialog = (rowData) => {
        console.log(rowData.exchangeType.exchangeTypeId);
        setExchangeId(rowData.groupExchangeId);
        if(rowData.exchangeType.exchangeTypeId === 'income'){
            setUpdateIncome(true);
        } else if(rowData.exchangeType.exchangeTypeId === 'spend'){
            setUpdateSpend(true);
        }
        handleClose();
    };

    const handleCloseUpdateExchangeDialog = () => {
        setExchangeId(null);
        setUpdateIncome(false);
        setUpdateSpend(false);
    };

    const handleOpenSpendExchangeDialog = () => {
        setAddSpend(true);
        handleClose();
    };

    const handleCloseSpendExchangeDialog = () => {
        setAddSpend(false);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpenModalDelete = (rowData) => {
        setExchangeId(rowData.groupExchangeId);
        setIsModalDeleteOpen(true);
        handleClose();
    };
    
    const handleClickCloseModalDelete = () => {
        setExchangeId(null);
        setIsModalDeleteOpen(false);
    };

    // const handleUpdateAmount = () => {
    //     request('get', `/group/wallets/${groupWalletId}`, (res) => {
    //         console.log(res.data);
    //         onUpdateAmount(res.data);
    //     });

    // }

    const handleUpdateExchange = (updateExchanges) => {
        setExchanges(updateExchanges);
        request('get', `/group/wallets/${groupWalletId}`, (res) => {
            console.log(res.data);
            onUpdateAmount(res.data);
        });
    }

    const handleClickImage = (exchange) => {
        const url = exchange.imageUrl ? exchange.imageUrl : 'https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq';
        setImageUrl(url);
        setIsImageModalOpen(true);
    };

    useEffect(() => {
        request("get", `/group/exchanges/all/${groupWalletId}`, (res) => {
            // console.log(res.data);
            setExchanges(res.data);
        }).then();
    }, []);
    
    
    const handleDeleteExchange = (exchangeId) => {
        console.log(exchangeId);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/group/exchanges/${exchangeId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
            setExchanges(res.data);
            request('get', `/group/wallets/${groupWalletId}`, (res) => {
                console.log(res.data);
                onUpdateAmount(res.data);
            });
        }, (error) => {
            console.error("Error when delete exchange:", error);
            // Xử lý lỗi nếu cần thiết
        });
        setIsModalDeleteOpen(false);
    };

    const filteredExchanges =
        selectedExchangeType === "spend"
        ? exchanges
        : exchanges.filter((exchange) => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === selectedExchangeType);

    const columns = [
    {
        title: "Budget",
        field: "budget",
        render: rowData => {
        const logoUrl = rowData.budget?.logo?.url || "";
        const groupBudgetId = rowData.budget?.groupBudgetId || "";
        return (
            <div>
            {logoUrl ? (
                <IconButton onClick={() => history.push(`/group/budgets/${groupBudgetId}`)}>
                <img
                    src={logoUrl}
                    alt="Category Logo"
                    style={{ width: 40, height: 40, borderRadius: "10%" }}
                />
                </IconButton>
                // <a href={`/budgets/${budgetCategoryId}`} target="_blank" rel="noopener noreferrer">
                // </a>
            ) : (
                <>{rowData.budget?.name}</>
            )}
            </div>
        );
        }
    },
    {
        title: "From",
        field: "from",
    },
    {
        title: "To",
        field: "to",
    },
    {
        title: "Amount",
        field: "amount",
        render: (rowData) => {
            const formattedAmount = rowData.amount.toLocaleString();
            return `${formattedAmount} ${symbol}`;
        }
    },
    // {
    //   title: "Description",
    //   field: "description",
    // },
    {
        title: "Happen Time",
        field: "exchangeDate",
        render: (rowData) => formatDate(rowData.exchangeDate),
        sorting: true, // Cho phép sắp xếp theo cột này
        defaultSort: 'desc' // Sắp xếp mặc định từ gần đây nhất đến lâu hơn
    },
    {
        title: "Created By",
        field: "createdUser.username",
    },
    {
        title: "Image",
        sorting: false,
        render: (rowData) => (
            <IconButton
                onClick={() => {
                    handleClickImage(rowData)
                }}
                variant="contained"
                color="primary"
            >
                <VisibilityIcon/>
            </IconButton>
        ),
        width: '10%'
    },
    {
        title: "Chức năng",
        sorting: false,
        render: (rowData) => (
            <div>
                <IconButton
                    onClick={() => handleOpenUpdateExchangeDialog(rowData)}
                    variant="contained"
                    color="success"
                >
                    <EditIcon/>
                </IconButton>
                {/* <UpdateWalletModal open={updateWallet} onClose={handleCloseUpdateWalletDialog} exchangeId={rowData.exchangeId}/> */}
                <IconButton
                    onClick={() => handleClickOpenModalDelete(rowData)}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon/>
                </IconButton>
            </div>
        ),
        width: '10%'
    },
    ];

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

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Spend" {...a11yProps(0)} />
                <Tab label="Income" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <StandardTable
                title="Spend Exchanges"
                columns={columns}
                data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "spend")}
                options={{
                    selection: false,
                    pageSize: 10,
                    search: true,
                    sorting: true,
                }}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StandardTable
                title="Income Exchanges"
                columns={columns}
                data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "income")}
                options={{
                    selection: false,
                    pageSize: 10,
                    search: true,
                    sorting: true,
                }}
                />
            </TabPanel>
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
                    <CurrencyExchangeRoundedIcon fontSize="120%"/>
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
                    <MenuItem onClick={handleOpenSpendExchangeDialog} style={{ fontSize: '1.2rem', color: 'red' }}>
                        <AddShoppingCartIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Spend
                    </MenuItem>
                    <GroupCreateSpendModal  onCreateExchange={handleUpdateExchange} open={addSpend} onClose={handleCloseSpendExchangeDialog} groupWalletId={groupWalletId}/>
                    {/* <CreateSpendModal onCreateExchange={handleUpdateExchange} open={addSpend} onClose={handleCloseSpendExchangeDialog} /> */}
                    <MenuItem onClick={handleOpenIncomeExchangeDialog} style={{ fontSize: '1.2rem', color: 'green' }}>
                        <AddCardIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Income
                    </MenuItem>
                    <GroupCreateIncomeModal  onCreateExchange={handleUpdateExchange} open={addIncome} onClose={handleCloseIncomeExchangeDialog} groupWalletId={groupWalletId}/>
                    {/* <CreateIncomeModal onCreateExchange={handleUpdateExchange} open={addIncome} onClose={handleCloseIncomeExchangeDialog}/> */}
            </Menu>
            </div>
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteExchange(exchangeId)
                    }
                    question="Xóa Exchange"
                    alert="Lưu ý xóa Exchange sẽ dẫn đến sự thay đổi trong các số dư Ví liên quan!"
                /> 
                : null
            }
            {isImageModalOpen &&
                <ImageZoomModal imageUrl={imageUrl} onClose={() => setIsImageModalOpen(false)}/>
            }
            {updateIncome ?
                    <GroupUpdateIncomeModal onCreateExchange={handleUpdateExchange} open={updateIncome} onClose={handleCloseUpdateExchangeDialog} groupWalletId={groupWalletId} groupExchangeId={exchangeId}/>
                    : null
            }
            {
                updateSpend ?
                <GroupUpdateSpendModal onCreateExchange={handleUpdateExchange} open={updateSpend} onClose={handleCloseUpdateExchangeDialog} groupWalletId={groupWalletId} groupExchangeId={exchangeId}/>
                : null
            }
        </div>
    )
}

export default GroupExchangeList;