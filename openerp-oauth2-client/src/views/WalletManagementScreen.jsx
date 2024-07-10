import React, {useEffect} from "react";
import VisibleWalletScreen from "./detail-screen/wallet/VisibleWalletScreen";
import HiddenWalletScreen from "./detail-screen/wallet/HiddenWalletScreen";
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import WalletRoundedIcon from '@mui/icons-material/WalletRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { MenuItem, Tooltip } from '@mui/material';
import CreateWalletModal from "components/modal/CreateWalletModal";
import { request } from "api";
import Typography from '@mui/material/Typography';
import CreateExchangeWallet from "components/modal/CreateExchangeWalletModal";
import RefreshIcon from '@mui/icons-material/Refresh';
import WalletHistoryModal from "components/modal/WalletHistoryModal";

function WalletManagementScreen() {
    const [showHiddenWallets, setShowHiddenWallets] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addWallet, setAddWallet] = React.useState(false);
    const [openHistory, setOpenHistory] = React.useState(false);
    const [addExchange, setAddExchange] = React.useState(false);

    const [includedInWallets, setIncludedInWallets] = React.useState([]);
    const [notIncludedInWallets, setNotIncludedInWallets] = React.useState([]);
    const [refreshData, setRefreshData] = useState(false);

    const handleRefreshData = () => {
        setRefreshData(!refreshData); // Đảo ngược giá trị của refreshData để gọi lại API và cập nhật dữ liệu
        request("get", `/wallet/user/${localStorage.getItem('userId')}`, (res) => {
            const includedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === true);
            const notIncludedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === false);
            // console.log(includedInTotalAmount);
            setIncludedInWallets(includedInTotalAmount);
            setNotIncludedInWallets(notIncludedInTotalAmount);

        }).then();
    };
    
    const handleOpenAddWalletDialog = (event) => {
        setAddWallet(true);
        handleClose();
    };

    const handleCloseAddWalletDialog = () => {
        setAddWallet(false);
    };

    const handleOpenHistoryModal = (event) => {
        setOpenHistory(true);
        handleClose();
    };
    const handleCloseHistoryModal = () => {
        setOpenHistory(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleHiddenWallets = () => {
        setShowHiddenWallets(!showHiddenWallets);
    };

    const handleOpenWalletExchangeDialog = (event) => {
        setAddExchange(true);
        handleClose();
    };

    const handleCloseWalletExchangeDialog = () => {
        setAddExchange(false);
    };
    useEffect(() => {
        request("get", `/wallet/user/${localStorage.getItem('userId')}`, (res) => {
            const includedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === true);
            const notIncludedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === false);
            // console.log(includedInTotalAmount);
            setIncludedInWallets(includedInTotalAmount);
            setNotIncludedInWallets(notIncludedInTotalAmount);

        }).then();
    }, [])

    const handleUpdateWalletData = (updatedWallets) => {
        // Cập nhật dữ liệu danh sách ví trong WalletManagementScreen
        const includedInTotalAmount = updatedWallets.filter(item => item.includeInTotalAmount === true);
        const notIncludedInTotalAmount = updatedWallets.filter(item => item.includeInTotalAmount === false);
        setIncludedInWallets(includedInTotalAmount);
        setNotIncludedInWallets(notIncludedInTotalAmount);
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Quản lý Ví
                <Tooltip title="Reload dữ liệu">
                    <IconButton onClick={handleRefreshData} aria-label="refresh">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Typography>
            <VisibleWalletScreen wallets={includedInWallets} onUpdateWalletData={handleUpdateWalletData}/> {/* Render ListWalletScreen */}
            <IconButton
                onClick={toggleHiddenWallets}
                variant="contained"
                color="warning"
                style={{ fontSize: '1rem' }} // Thay đổi kích thước icon ở đây
            >
                {showHiddenWallets ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                <span style={{ marginLeft: '5px', marginTop: '10px'}}>
                    {showHiddenWallets ? "Hide Hidden Wallets" : "Show Hidden Wallets"}
                </span>
            </IconButton>
            {showHiddenWallets && (
                <div>
                    <HiddenWalletScreen hiddenWallets={notIncludedInWallets} onUpdateWalletData={handleUpdateWalletData}/>
                </div>
            )}
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
                    <WalletRoundedIcon fontSize="120%"/>
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
                    <MenuItem onClick={handleOpenHistoryModal} style={{ fontSize: '1.2rem', color: 'blue' }}>
                        <HistoryRoundedIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> History
                    </MenuItem>
                    <MenuItem onClick={handleOpenWalletExchangeDialog} style={{ fontSize: '1.2rem', color: 'green' }}>
                        <CurrencyExchangeRoundedIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Exchange
                    </MenuItem>
                    <MenuItem onClick={handleOpenAddWalletDialog} style={{ fontSize: '1.2rem', color: 'red' }}>
                        <AddCircleOutlineRoundedIcon style={{ marginRight: 8, fontSize: '1.5rem'}} /> Add Wallet
                    </MenuItem>
                </Menu>
            </div>
            <CreateExchangeWallet onCreateExchange={handleCloseWalletExchangeDialog} open={addExchange} onClose={handleCloseWalletExchangeDialog}/>
            <CreateWalletModal onCreateWallet={handleUpdateWalletData} open={addWallet} onClose={handleCloseAddWalletDialog}/>
            <WalletHistoryModal open={openHistory} onClose={handleCloseHistoryModal} />
        </div>
    );
}

export default WalletManagementScreen;