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
import { Modal, Tooltip, Grid, Button, Container } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

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

    const handleDeleteSaving = (savingId) => {
        request("delete", `/savings/${savingId}`, (res) => {
            fetchSavings(); // Refresh the list after deletion
        }, (error) => {
            console.error("Error when delete saving:", error);
        });
    };

    const fetchSavings = () => {
        request("get", `/savings/user/${userId}`, (res) => {
            const sortedSavings = res.data.sort((a, b) => {
                if (a.isActive === b.isActive) {
                    return a.name.localeCompare(b.name);
                }
                return b.isActive - a.isActive;
            });
            setSavings(sortedSavings);
        });
    };

    useEffect(() => {
        request("get", `/savings/user/${userId}`, (res) => {
            console.log(res.data);
            const sortedSavings = res.data.sort((a, b) => {
                if (a.isActive === b.isActive) {
                    return a.name.localeCompare(b.name);
                }
                return b.isActive - a.isActive;
            });
            setSavings(sortedSavings);
        }).then();
    }, [savings.length]);

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

    const [openModalInfo, setOpenModalInfo] = useState(false);
    const [viewMethod, setViewMethod] = useState(null);

    const handleOpenModalInfo = () => setOpenModalInfo(true);
    const handleCloseModalInfo = () => {
        setOpenModalInfo(false);
        setViewMethod(null);
    };

    const displayMainScreen = () => (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Một số lưu ý khi tạo các khoản tiết kiệm
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                Trong <strong>Financial Saver</strong>, các khoản tiết kiệm được chia làm các loại như: Không lãi suất, Lãi đơn, Lãi kép, Lãi kép có tích lũy.
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                Việc phân chia hoàn toàn dựa trên thực tế các khoản tiết kiệm hiện tại. Tuy nhiên việc đảm bảo chuẩn xác hoàn toàn là không chắc chắn do mỗi đơn vị, doanh nghiệp thường có phương pháp tính lãi, kỳ hạn riêng. Ở đây, chúng tôi sử dụng cách tính toán phổ biến nhất với các khoản tiết kiệm, cụ thể như sau:
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                <strong>1. Không có lãi:</strong> Các khoản tiết kiệm dạng tiền mặt, lợn đất,... Dạng này hỗ trợ tích lũy thêm, rút tiền, tất toán.
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                <strong>2. Lãi đơn:</strong> Đại diện cho các khoản tiết kiệm với tiền gốc không thay đổi. Dạng này hỗ trợ rút tiền, tất toán, <strong>tuy nhiên không hỗ trợ tích lũy thêm</strong>
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                <strong>3. Lãi kép:</strong> Đại diện cho các khoản tiết kiệm với tiền gốc được cộng thêm lãi mỗi kỳ hạn. Dạng này hỗ trợ rút tiền, tất toán, <strong>tuy nhiên không hỗ trợ tích lũy thêm</strong>
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                <strong>4. Lãi kép có tích lũy:</strong> Đại diện các khoản tiết kiệm ngoài thực tế dạng lãi kép, tuy nhiên có thể tích lũy thêm tiền. <strong>Chú ý</strong>: Tiền gửi vào giữa kỳ hạn sẽ được bắt đầu tính lãi từ đầu kỳ hạn sau, Tiền rút ra sẽ ảnh hưởng trực tiếp đến tiền lãi của kỳ hạn đó.
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                Ngoài ra hệ thống cũng hỗ trợ các thời gian kỳ hạn từ Ngày, Tuần, Tháng đến Năm. Đảm bảo đa dạng nhu cầu người dùng.
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                Để dễ dàng cho quản lý khi có nhiều khoản tiết kiệm, hệ thống cũng sắp xếp sẵn các loại phổ biến như: Tiền mặt, Tiết kiệm ngân hàng, E-wallet, Tiết kiệm để mua tài sản nhất định,...
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Chúc các bạn có những khoản tiết kiệm luôn đầy ắp!!!</strong>
            </Typography>
        </Box>
    );

    return (
        <div className="list-saving-screen">
            <Typography variant="h5" gutterBottom>
                Tài khoản Tiết kiệm
                <Tooltip title="Lưu ý khi tiết kiệm">
                    <IconButton onClick={handleOpenModalInfo} aria-label="refresh">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
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
                    <SavingsIcon fontSize="120%"/>
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
                    <MenuItem onClick={handleOpenAddSavingDialog} style={{ fontSize: '1.2rem', color: 'blue' }}>
                        <AddCircleOutlineRoundedIcon style={{ marginRight: 8, fontSize: '1.5rem'}} />Create new Saving
                    </MenuItem>
                    <SavingCreateModal onCreateSaving={handleUpdateSaving} onClose={handleCloseAddSavingDialog} open={addSaving}/>
                    <MenuItem onClick={handleOpenAddSavingExchangeDialog} style={{ fontSize: '1.2rem', color: 'green' }}>
                        <CurrencyExchangeRoundedIcon style={{ marginRight: 8, fontSize: '1.5rem'}} />Create Saving Exchange
                    </MenuItem>
                    <SavingCreateExchangeModal onUpdateExchange={updateDate} onClose={handleCloseAddSavingExchangeDialog} open={addSavingExchange}/>
                </Menu>
            </div>
            <Modal
                open={openModalInfo}
                onClose={handleCloseModalInfo}
                aria-labelledby="financial-methods-modal"
                aria-describedby="financial-methods-description"
            >
                <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <Box sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2, boxShadow: 24 }}>
                        {displayMainScreen()}
                    </Box>
                </Container>
            </Modal>
        </div>
    );
}

export default ListSavingScreen;