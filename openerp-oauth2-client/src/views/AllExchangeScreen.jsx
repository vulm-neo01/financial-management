import React, { useState, useEffect } from "react";
import { request } from "../api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { TabPanel } from "components/tab/TabPanel";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {currency, symbol} from '../utils/currency'
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
import ConfirmationModal from "components/modal/ConfirmationModal";
import CreateExchangeWallet from "components/modal/CreateExchangeWalletModal";
import CreateIncomeModal from "components/modal/CreateIncomeModal";
import CreateSpendModal from "components/modal/CreateSpendModal";
import { useHistory } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UpdateIncomeModal from "components/modal/UpdateIncomeModal";
import UpdateSpendModal from "components/modal/UpdateSpendModal";
import UpdateWalletExchangeModal from "components/modal/UpdateWalletExchangeModal";
import SavingCreateExchangeModal from "components/modal/SavingCreateExchangeModal";
import SavingUpdateExchangeModal from "components/modal/SavingExchangeUpdateModal";

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

function AllExchangeScreen() {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchangeType, setSelectedExchangeType] = useState("all");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [exchangeId, setExchangeId] = React.useState(null);
  const [addWalletExchange, setAddWalletExchange] = React.useState(false);
  const [addIncome, setAddIncome] = React.useState(false);
  const [updateIncome, setUpdateIncome] = React.useState(false);
  const [updateSpend, setUpdateSpend] = React.useState(false);
  const [updateWalletToWallet, setUpdateWalletToWallet] = React.useState(false);
  const [updateSavingExchange, setUpdateSavingExchange] = React.useState(false);
  const [addSpend, setAddSpend] = React.useState(false);
  const [addSavingExchange, setAddSavingExchange] = React.useState(false);
  const userId = localStorage.getItem("userId");
  const history = useHistory ();

  const [userIdRequest, setUserIdRequest] = useState(
    {
        userId: localStorage.getItem('userId')
    }
);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenWalletExchangeDialog = () => {
    setAddWalletExchange(true);
    handleClose();
  };

  const handleCloseWalletExchangeDialog = () => {
      setAddWalletExchange(false);
  };

  const handleOpenIncomeExchangeDialog = () => {
    setAddIncome(true);
    handleClose();
  };

  const handleCloseIncomeExchangeDialog = () => {
      setAddIncome(false);
  };

  const handleOpenSavingExchangeDialog = () => {
    setAddSavingExchange(true);
    handleClose();
  };

  const handleCloseSavingExchangeDialog = () => {
      setAddSavingExchange(false);
  };

  const handleOpenUpdateExchangeDialog = (rowData) => {
    console.log(rowData.exchangeType.exchangeTypeId);
    setExchangeId(rowData.exchangeId);
    if(rowData.exchangeType.exchangeTypeId === 'income'){
      setUpdateIncome(true);
    } else if(rowData.exchangeType.exchangeTypeId === 'spend'){
      setUpdateSpend(true);
    } else if(rowData.exchangeType.exchangeTypeId === 'wallet_wallet'){
      setUpdateWalletToWallet(true);
    } else if(rowData.exchangeType.exchangeTypeId === 'wallet_saving' || rowData.exchangeType.exchangeTypeId === 'saving_wallet'){
      setUpdateSavingExchange(true);
    }
    handleClose();
  };

  const handleCloseUpdateExchangeDialog = () => {
      setExchangeId(null);
      setUpdateIncome(false);
      setUpdateSpend(false);
      setUpdateSavingExchange(false);
      setUpdateWalletToWallet(false);
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
    setExchangeId(rowData.exchangeId);
    setIsModalDeleteOpen(true);
    handleClose();
  };

  const handleClickCloseModalDelete = () => {
    setExchangeId(null);
    setIsModalDeleteOpen(false);
  };

  const handleDeleteExchange = (exchangeId) => {
    console.log(userIdRequest);
    console.log(exchangeId);
    // Gửi dữ liệu lên cơ sở dữ liệu
    request("delete", `/exchanges/${exchangeId}`, (res) => {
        console.log(res.data);
        setIsModalDeleteOpen(false);
        setExchanges(res.data);
    }, (error) => {
        console.error("Error when delete exchange:", error);
        // Xử lý lỗi nếu cần thiết
    }, userIdRequest);
    setIsModalDeleteOpen(false);
  };

  const handleUpdateExchange = (updateExchanges) => {
    setExchanges(updateExchanges)
  }

  const handleClickExchangeDetail = (exchange) => {
    const exchangeId = exchange.exchangeId;
    history.push(`/exchanges/${exchangeId}`);
  };

  useEffect(() => {
    request("get", `/exchanges/all/${userId}`, (res) => {
      // console.log(res.data);
      setExchanges(res.data);
    }).then();
  }, []);

  const filteredExchanges =
    selectedExchangeType === "all"
      ? exchanges
      : exchanges.filter((exchange) => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === selectedExchangeType);

  const columns = [
  {
    title: "Budget",
    field: "category",
    render: rowData => {
      const logoUrl = rowData.category?.logo?.url || "";
      const budgetCategoryId = rowData.category?.budgetCategoryId || "";
      return (
        <div>
          {logoUrl ? (
            <IconButton onClick={() => history.push(`/budgets/${budgetCategoryId}`)}>
              <img
                src={logoUrl}
                alt="Category Logo"
                style={{ width: 40, height: 40, borderRadius: "10%" }}
              />
            </IconButton>
            // <a href={`/budgets/${budgetCategoryId}`} target="_blank" rel="noopener noreferrer">
            // </a>
          ) : (
            <>{rowData.category?.name}</>
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
      title: "Detail",
      sorting: false,
      render: (rowData) => (
          <IconButton
              onClick={() => {
                  handleClickExchangeDetail(rowData)
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
              {/* <IconButton
                  variant="contained"
                  color="primary"
                  // onClick={() => handleClickOpenModalChangeStatus(rowData)}
              >
                  <ContentCopyIcon/>
              </IconButton> */}
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
      <Typography variant="h5" gutterBottom>
        Quản lý giao dịch
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Spend" {...a11yProps(1)} />
          <Tab label="Income" {...a11yProps(2)} />
          <Tab label="Wallet To Wallet" {...a11yProps(3)} />
          <Tab label="Saving" {...a11yProps(4)} />
          <Tab label="Debt and Loan" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <StandardTable
          title="Toàn bộ giao dịch"
          columns={columns}
          data={filteredExchanges}
          options={{
            selection: false,
            pageSize: 20,
            search: true,
            sorting: true,
          }}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StandardTable
          title="Giao dịch chi tiêu"
          columns={columns}
          data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "spend")}
          options={{
            selection: false,
            pageSize: 20,
            search: true,
            sorting: true,
          }}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <StandardTable
          title="Giao dịch thu nhập"
          columns={columns}
          data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "income")}
          options={{
            selection: false,
            pageSize: 20,
            search: true,
            sorting: true,
          }}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <StandardTable
          title="Chuyển từ Ví đến Ví"
          columns={columns}
          data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "wallet_wallet")}
          options={{
            selection: false,
            pageSize: 20,
            search: true,
            sorting: true,
          }}
        />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <StandardTable
          title="Giao dịch tiết kiệm"
          columns={columns}
          data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "wallet_saving" 
          || exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "saving_wallet")}
          options={{
            selection: false,
            pageSize: 20,
            search: true,
            sorting: true,
          }}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <StandardTable
          title="Giao dịch cho vay/nợ"
          columns={columns}
          data={filteredExchanges.filter(exchange => exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "wallet_loan" 
          || exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "loan_wallet" || exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "debt_wallet"
          || exchange.exchangeType && exchange.exchangeType.exchangeTypeId === "wallet_debt")}
          options={{
            selection: false,
            pageSize: 20,
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
            <CreateSpendModal onCreateExchange={handleUpdateExchange} open={addSpend} onClose={handleCloseSpendExchangeDialog} />
            <MenuItem onClick={handleOpenIncomeExchangeDialog} style={{ fontSize: '1.2rem', color: 'green' }}>
                <AddCardIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Income
            </MenuItem>
            <CreateIncomeModal onCreateExchange={handleUpdateExchange} open={addIncome} onClose={handleCloseIncomeExchangeDialog}/>
            <MenuItem onClick={handleOpenWalletExchangeDialog} style={{ fontSize: '1.2rem', color: 'blue' }}>
                <WalletIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Wallet To Wallet
            </MenuItem>
            <CreateExchangeWallet onCreateExchange={handleUpdateExchange} open={addWalletExchange} onClose={handleCloseWalletExchangeDialog}/>

            <MenuItem onClick={handleOpenSavingExchangeDialog} style={{ fontSize: '1.2rem', color: 'orange' }}>
                <SavingsIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Wallet - Saving
            </MenuItem>
            <SavingCreateExchangeModal onUpdateExchange={handleUpdateExchange} onClose={handleCloseSavingExchangeDialog} open={addSavingExchange}/>
            {/* <MenuItem onClick={handleClose} style={{ fontSize: '1.2rem', color: 'purple' }}>
                <MoneyOffIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Wallet - Debt
            </MenuItem>
            <MenuItem onClick={handleClose} style={{ fontSize: '1.2rem', color: 'black' }}>
                <PaymentsIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Wallet - Loan
            </MenuItem> */}
          </Menu>
          {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteExchange(exchangeId)}
                    question="Xóa Exchange"
                    alert="Lưu ý xóa Exchange sẽ dẫn đến sự thay đổi trong các Wallet, Saving,... liên quan!"
                /> 
                : null
            }
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
            {
              updateSavingExchange ?
              <SavingUpdateExchangeModal 
                onUpdateExchange={handleUpdateExchange} 
                open={updateSavingExchange} 
                onClose={handleCloseUpdateExchangeDialog} 
                exchangeId={exchangeId}
              />
              : null
            }
      </div>
    </div>
  );
}

export default AllExchangeScreen;

