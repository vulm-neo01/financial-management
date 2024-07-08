import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, Grid, Divider, Tabs, Tab, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { request } from 'api';
import ConfirmationModal from 'components/modal/ConfirmationModal';
import { useTheme } from "@mui/material/styles";
import GroupWalletUpdateModal from 'components/modal/GroupWalletUpdateModal';
import PropTypes from 'prop-types';
import StatisticsGroupWallet from './StatisticsGroupWallet';
import GroupMember from './GroupMember';
import GroupExchangeList from './GroupExchangeList';
import GroupBudget from './GroupBudget';
import LogoutIcon from '@mui/icons-material/Logout';

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

function GroupWalletOverview() {
    const { groupWalletId } = useParams();
    const [value, setValue] = useState(0);
    const history = useHistory();
    const [groupWallet, setGroupWallet] = useState(null);
    const [updateGroup, setUpdateGroup] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalOutGroupOpen, setIsModalOutGroupOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const theme = useTheme();
    const userId = localStorage.getItem('userId');
    const [formData, setFormData] = useState({
        ownerId: userId,
        groupName: '',
        amount: 0.0,
        logoId: '',
        description: ''
    });
    useEffect(() => {
        request('get', `/group/wallets/${groupWalletId}`, (res) => {
            console.log(res.data);
            setGroupWallet(res.data);
        });
        // request('get', `group/exchanges/all/${groupWalletId}`, (res) => {
        //     console.log(res.data);
        //     setExchanges(res.data);
        // });
        request("get", `group/members/all/${groupWalletId}`, (res) => {
            setMembers(res.data);
            console.log(res.data);
        }).then();
    }, [groupWalletId]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClickOpenModalDelete = () => {
        setIsModalDeleteOpen(true);
    };

    const handleClickCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleClickOpenModalOutGroup = () => {
        setIsModalOutGroupOpen(true);
    };

    const handleClickCloseModalOutGroup = () => {
        setIsModalOutGroupOpen(false);
    };

    const handleDeleteGroupWallet = (groupWalletId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `group/wallets/delete/${groupWalletId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
        }, (error) => {
            console.error("Error when delete group wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        setIsModalDeleteOpen(false);
        history.push(`/group-wallets`);
    };

    const handleUpdateGroupWalletData = (updatedGroupWallet) => {
        setGroupWallet(updatedGroupWallet);
    };

    const handleOpenUpdateGroupDialog = () => {
        setUpdateGroup(true);
    };

    const handleCloseUpdateGroupDialog = () => {
        setUpdateGroup(false);
    };

    if (!groupWallet) {
        return <Typography>Loading...</Typography>;
    }

    const handleUpdateAmount = (updatedWallet) => {
        setGroupWallet(updatedWallet);
    }

    const handleOutGroup = () => {
        request("patch", `group/members/out-group`, (res) => {
        }, (error) => {
            console.error("Error when delete group wallet:", error);
            // Xử lý lỗi nếu cần t
        }, {
            createdUserId: userId,
            userId: null,
            groupWalletId: groupWalletId,
            role: null
        });
        history.push(`/group-wallets`);
    }

    const isAdmin = (userId) => {
        const member = members.find(m => m.user.userId === userId);
        return member && member.role === "ADMIN";
    };
    
    return (
        <Box sx={{ display: 'flex', height: '80vh' }}>
            <Box sx={{ width: '25%', padding: 2, borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconButton onClick={() => history.push("/group-wallets")}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>{groupWallet.groupName}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <img src={groupWallet.logo.url} alt={groupWallet.groupName} style={{ width: '40%', marginBottom: 12 }} />
                        <Typography variant="body1"><strong>Số tiền hiện tại: {groupWallet.amount.toLocaleString()} đ</strong></Typography>
                        <Typography variant="body2">Người tạo: {groupWallet.owner.username}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>{groupWallet.description}</Typography>
                    </Box>

                </Box>
                {isAdmin(userId) &&
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                        <Button
                            onClick={handleOpenUpdateGroupDialog}
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            sx={{ m: 1, minWidth: 100 }}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={handleClickOpenModalDelete}
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            sx={{ m: 1, minWidth: 100 }}
                        >
                            Delete
                        </Button>
                    </Box>
                }
            </Box>
            <Box sx={{ width: '75%', padding: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Overview" {...a11yProps(0)} />
                        <Tab label="Exchanges" {...a11yProps(1)} />
                        <Tab label="Budgets" {...a11yProps(2)} />
                        <Tab label="Members" {...a11yProps(3)} />
                    </Tabs>
                    <Button
                        variant='contained'
                        color="primary" 
                        onClick={handleClickOpenModalOutGroup}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }}
                    >
                        <LogoutIcon sx={{ marginRight: 1 }} />
                        <Typography variant="button" sx={{ fontSize: '0.8rem' }}>
                            Out Group
                        </Typography>
                    </Button>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <StatisticsGroupWallet groupWalletId={groupWalletId}  />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <GroupExchangeList groupWalletId={groupWalletId} onUpdateAmount={handleUpdateAmount}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <GroupBudget groupWalletId={groupWalletId}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    <GroupMember groupWalletId={groupWalletId}/>
                </CustomTabPanel>
            </Box>
            <GroupWalletUpdateModal onCreateWallet={handleUpdateGroupWalletData} open={updateGroup} onClose={handleCloseUpdateGroupDialog} groupWalletId={groupWallet.groupWalletId}/>
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteGroupWallet(groupWalletId)}
                    question="Xóa Group Wallet"
                /> 
                : null
            }

            {
                isModalOutGroupOpen ? 
                <ConfirmationModal
                    open={isModalOutGroupOpen}
                    onClose={handleClickCloseModalOutGroup}
                    onConfirm={handleOutGroup}
                    question="Thoát khỏi nhóm"
                /> 
                : null
            }
        </Box>
    );
}

export default GroupWalletOverview;