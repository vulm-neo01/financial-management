import React, { useState, useEffect } from "react";
import { request } from "../api";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import './css/ListBudgetScreen.css';
import AddIcon from '@mui/icons-material/Add';
import OverviewBudget from "./detail-screen/budget/OverviewBudget";
import {BudgetCreateSpendModal} from "components/modal/BudgetCreateModal";
import {BudgetCreateIncomeModal} from "components/modal/BudgetCreateModal";
import { Container, IconButton, Modal, Tooltip, Button, Grid, Link } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import SixJarIcon from '../assets/6cailo.jpg'
import FiftyTwentyThirtyIcon from '../assets/502030.jpeg'
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

function ListBudgetScreen() {
    const [budgets, setBudgets] = useState([]);
    const [value, setValue] = useState(0);
    const [addBudgetSpend, setAddBudgetSpend] = useState(false);
    const [addBudgetIncome, setAddBudgetIncome] = useState(false);
    const userId = localStorage.getItem('userId');
    const history = useHistory();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        request("get", `/budgets/user/${userId}`, (res) => {
            // console.log(res.data);
            const sortedBudgets = res.data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setBudgets(sortedBudgets);
        }).then();
    }, [budgets.length]);

    const handleBudgetClick = (budgetCategoryId) => {
        history.push(`/budgets/${budgetCategoryId}`);
    };

    const handleOpenAddBudgetSpendDialog = (event) => {
        setAddBudgetSpend(true);
    };

    const handleCloseAddBudgetSpendDialog = () => {
        setAddBudgetSpend(false);
    };

    const handleOpenAddBudgetIncomeDialog = (event) => {
        setAddBudgetIncome(true);
    };

    const handleCloseAddBudgetIncomeDialog = () => {
        setAddBudgetIncome(false);
    };

    const handleUpdateBudgetData = (updatedBudgets) => {
        const sortedBudgets = updatedBudgets.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        setBudgets(sortedBudgets);
    };

    const renderIncomeBudgets = (type) => {
        return budgets
            .filter(budget => budget.type === type)
            .map(budget => (
                <div key={budget.budgetCategoryId} className="budget-card" onClick={() => handleBudgetClick(budget.budgetCategoryId)}>
                    <img src={budget.logo.url} alt={budget.name} className="budget-logo" />
                    <Typography variant="body1">{budget.name}</Typography>
                </div>
            ));
    };

    const renderSpendBudgets = (type) => {
        return budgets
            .filter(budget => budget.type !== type)
            .map(budget => (
                <div key={budget.budgetCategoryId} className="budget-card" onClick={() => handleBudgetClick(budget.budgetCategoryId)}>
                    <img src={budget.logo.url} alt={budget.name} className="budget-logo" />
                    <Typography variant="body1">{budget.name}</Typography>
                </div>
            ));
    };

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
                Một số phương pháp phân chia ngân sách cho bạn
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                Việc phân chia ngân sách hợp lý dựa hoàn toàn trên vấn đề <strong>chi tiêu</strong> và <strong>thu nhập</strong> của bạn. Do vậy bạn không thể phân chia ngân sách hợp lý nếu không nắm được khoảng thu nhập và khoảng chi tiêu của bản thân.
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                Vậy nên chúng tôi gợi ý bạn ban đầu hãy phân chia ngân sách chi tiêu và thu nhập theo dạng cơ bản như:
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                <strong>Chi tiêu bao gồm các mục:</strong> Đồ ăn, Nhà cửa, Đi lại, Cà phê, Giải trí, Du lịch, Học tập, ...
            </Typography>
            <Typography variant="body1" gutterBottom align="left">
                <strong>Về phân Thu nhập:</strong> Lương, Trợ cấp, Cho thuê, Thu nhập Thụ động,...
            </Typography>

            <Typography variant="body1" gutterBottom align="left">
                Bên dưới là một số phương pháp phân chia ngân sách phổ biến và hiệu quả hiện tại, sau khi nắm rõ tình hình tài chính của mình, bạn có thể tham khảo để áp dụng cho bản thân
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} display="flex" justifyContent="center">
                    <Button
                        onClick={() => setViewMethod('method1')}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <img src={SixJarIcon} alt="Method 1" style={{ width: 200 }} />
                        <Typography variant="subtitle1">Phương pháp 6 chiếc hũ</Typography>
                    </Button>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center">
                    <Button
                        onClick={() => setViewMethod('method2')}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <img src={FiftyTwentyThirtyIcon} alt="Method 2" style={{ width: 200 }} />
                        <Typography variant="subtitle1">Phương pháp 50/20/30</Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );

    const displayMethod1 = () => (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Phương pháp 6 chiếc hũ
            </Typography>
            <img src={SixJarIcon} alt="Method 1" style={{ width: 200 }} />
            <Typography paragraph sx={{ textAlign: 'left' }}>
                Phương pháp này chia thu nhập của bạn thành 6 phần chính:
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>1. Necessities (55%):</strong> Chi phí cho những nhu cầu cơ bản như tiền nhà, ăn uống, đi lại, hóa đơn,...
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>2. Education (10%):</strong> Đầu tư vào giáo dục và phát triển bản thân như sách, khóa học,...
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>3. Long-term Savings (10%):</strong> Tiết kiệm cho các mục tiêu dài hạn như mua nhà, hưu trí,...
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>4. Play (10%):</strong> Chi tiêu cho các hoạt động vui chơi, giải trí để thưởng cho bản thân.
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>5. Financial Freedom (10%):</strong> Đầu tư vào các tài sản để tạo ra thu nhập thụ động.
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>6. Giving (5%):</strong> Dành cho các hoạt động từ thiện, giúp đỡ người khác.
            </Typography>
            
            <Button variant="contained" onClick={() => setViewMethod(null)}>Quay lại</Button>
            <Button variant="contained" sx={{ ml: 1 }}>
                <a href="https://glints.com/vn/blog/quy-tac-6-chiec-lo-quan-ly-tai-chinh/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Tìm hiểu thêm
                </a>
            </Button>
        </Box>
    );

    const displayMethod2 = () => (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Phương pháp 50/20/30
            </Typography>
            <img src={FiftyTwentyThirtyIcon} alt="Method 2" style={{ width: 300 }} />
            <Typography paragraph sx={{ textAlign: 'left' }}>
                Phương pháp này chia thu nhập của bạn thành 3 phần chính:
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>1. Needs (50%):</strong> Chi phí cho các nhu cầu cơ bản như tiền nhà, ăn uống, đi lại, hóa đơn,...
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>2. Wants (30%):</strong> Chi tiêu cho các mong muốn như giải trí, du lịch, mua sắm,...
            </Typography>
            <Typography paragraph sx={{ textAlign: 'left' }}>
                <strong>3. Savings (20%):</strong> Tiết kiệm và đầu tư cho tương lai.
            </Typography>
            
            <Button variant="contained" onClick={() => setViewMethod(null)}>Quay lại</Button>
            <Button variant="contained" sx={{ ml: 1 }}>
                <a href="https://topi.vn/quy-tac-50-20-30.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Tìm hiểu thêm
                </a>
            </Button>
        </Box>
    );

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Ngân sách của bạn
                <Tooltip title="Một số phương pháp lập ngân sách">
                    <IconButton aria-label="refresh" onClick={handleOpenModalInfo}>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Overview" {...a11yProps(0)} />
                    <Tab label="Spend" {...a11yProps(1)} />
                    <Tab label="Income" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <OverviewBudget budgets={budgets} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="budget-grid">
                    {renderSpendBudgets("income")}
                    <div className="budget-card add-budget-card" onClick={handleOpenAddBudgetSpendDialog}>
                        <AddIcon style={{ fontSize: 50 }} />
                        <Typography variant="body1">Add Budget</Typography>
                    </div>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div className="budget-grid">
                    {renderIncomeBudgets("income")}
                    <div className="budget-card add-budget-card" onClick={handleOpenAddBudgetIncomeDialog}>
                        <AddIcon style={{ fontSize: 50 }} />
                        <Typography variant="body1">Add Budget</Typography>
                    </div>
                </div>
            </CustomTabPanel>
            <BudgetCreateSpendModal onCreateBudget={handleUpdateBudgetData} open={addBudgetSpend} onClose={handleCloseAddBudgetSpendDialog}/>
            <BudgetCreateIncomeModal onCreateBudget={handleUpdateBudgetData} open={addBudgetIncome} onClose={handleCloseAddBudgetIncomeDialog}/>
            <Modal
                open={openModalInfo}
                onClose={handleCloseModalInfo}
                aria-labelledby="financial-methods-modal"
                aria-describedby="financial-methods-description"
            >
                <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 2, boxShadow: 24 }}>
                        {viewMethod === 'method1' ? displayMethod1() : viewMethod === 'method2' ? displayMethod2() : displayMainScreen()}
                    </Box>
                </Container>
            </Modal>
        </div>
    );
}

export default ListBudgetScreen;
