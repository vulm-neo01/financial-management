import React, {useEffect, useState} from "react";
import {request} from "../api";
import {StandardTable} from "erp-hust/lib/StandardTable";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SavingCard from "./detail-screen/saving/SavingCard";
import './css/ListSaving.css';
import SavingsIcon from '@mui/icons-material/Savings';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SavingCreateModal from "components/modal/SavingCreateModal";
import SavingCreateExchangeModal from "components/modal/SavingCreateExchangeModal";

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

function ListSavingScreen() {
    const userId = localStorage.getItem("userId");
    const [savings, setSavings] = useState([]);
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addSaving, setAddSaving] = useState(false);
    const [addSavingExchange, setAddSavingExchange] = useState(false);
    const history = useHistory();

    useEffect(() => {
        request("get", `/savings/user/${userId}`, (res) => {
            // console.log(res.data);
            const sortedSavings = res.data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setSavings(sortedSavings);
        }).then();
    }, [userId]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenAddSavingDialog = () => {
        setAddSaving(true);
        handleClose();
    };

    const handleCloseAddSavingDialog = () => {
        setAddSaving(false);
    };

    const handleOpenAddSavingExchangeDialog = () => {
        setAddSavingExchange(true);
        handleClose();
    };

    const handleCloseAddSavingExchangeDialog = () => {
        setAddSavingExchange(false);
    };

    const updateDate = () => {
        request("get", `/savings/user/${userId}`, (res) => {
            // console.log(res.data);
            const sortedSavings = res.data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setSavings(sortedSavings);
        }).then();
        handleCloseAddSavingExchangeDialog();
    }

    const handleUpdateSaving = (updateSavings) => {
        setSavings(updateSavings)
    }
    
    const renderSaving = (type) => {
        return savings
            .filter(saving => saving.savingCategory.type === type)
            .map(saving => (
                <div key={saving.savingId} onClick={() => handleClickSavingCard(saving.savingId)}>
                    <SavingCard saving={saving} handleClick={handleClickSavingCard}/>
                </div>
            ));
    };

    const handleClickSaving = () => {
        handleClose();
        alert('Saving');
    };

    const handleClickSavingCard = (savingId) => {
        history.push(`/savings/${savingId}`);
    }

    return (
        <div className="list-saving-screen">
            <Typography variant="h4" gutterBottom>
                Saving Account
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="All Savings" {...a11yProps(0)} />
                    <Tab label="Piggy Bank - Cash" {...a11yProps(1)} />
                    <Tab label="Savings E-wallet - Bank" {...a11yProps(2)} />
                    <Tab label="Certificates of deposit, bonds" {...a11yProps(3)} />
                    <Tab label="Save to buy property" {...a11yProps(4)} />
                    <Tab label="Other" {...a11yProps(5)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className="saving-grid">
                    {
                        savings.map(saving => (
                            <SavingCard key={saving.savingId} saving={saving} handleClick={handleClickSavingCard}/>
                        ))
                    }
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="saving-grid">
                    {renderSaving("cash")}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div className="saving-grid">
                    {renderSaving("e-saving")}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <div className="saving-grid">
                    {renderSaving("bond")}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                <div className="saving-grid">
                    {renderSaving("property")}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
                <div className="saving-grid">
                    {renderSaving("other")}
                </div>
            </CustomTabPanel>
            <div style={{ position: 'fixed', bottom: 40, right: 40 }}>
                <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    aria-label="add"
                    color="primary"
                    size="large"
                    style={{ backgroundColor: '#BDDAFE ', fontSize: '4rem', transition: 'transform 0.3s ease', }} // Điều chỉnh kích thước
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <SavingsIcon fontSize="150%"/>
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
                    <MenuItem onClick={handleOpenAddSavingDialog} style={{ fontSize: '1.4rem', color: 'blue' }}>
                        <AddCircleOutlineRoundedIcon style={{ marginRight: 8, fontSize: '2rem'}} />Create new Saving
                    </MenuItem>
                    <SavingCreateModal onCreateSaving={handleUpdateSaving} onClose={handleCloseAddSavingDialog} open={addSaving}/>
                    <MenuItem onClick={handleOpenAddSavingExchangeDialog} style={{ fontSize: '1.4rem', color: 'green' }}>
                        <CurrencyExchangeRoundedIcon style={{ marginRight: 8, fontSize: '2rem'}} />Create Saving Exchange
                    </MenuItem>
                    <SavingCreateExchangeModal onUpdateExchange={updateDate} onClose={handleCloseAddSavingExchangeDialog} open={addSavingExchange}/>
                </Menu>
            </div>
        </div>
    );
}

export default ListSavingScreen;