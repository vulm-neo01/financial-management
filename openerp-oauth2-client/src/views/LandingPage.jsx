import React, {useEffect } from "react";
import { Box, Typography, Button, Container, Grid, Link } from "@mui/material";
import BudgetIcon from "../assets/budgeting.gif"; // replace with your actual icons
import GroupIcon from "../assets/presentation.gif"; // replace with your actual icons
import SavingIcon from "../assets/saving-money.gif"; // replace with your actual icons
import LoanDebtIcon from "../assets/alms.gif"; // replace with your actual icons
import ExchangeIcon from "../assets/transaction.gif"; // replace with your actual icons
import AccountIcon from "../assets/wallet.gif"; // replace with your actual icons
import FinancialIcon from "../assets/financial-report.png"; 
import SecureIcon from "../assets/secure.png"; // replace with your actual icons
import UserFriendlyIcon from "../assets/like.png"
import StartIcon from "../assets/start.png"; // replace with your actual icons
import { useKeycloak } from "@react-keycloak/web";
import { useHistory } from "react-router-dom";

const LandingPage = () => {
    const { keycloak } = useKeycloak();
    const history = useHistory();

    useEffect(() => {
        if (keycloak.authenticated) {
            history.push("/general");
        }
    }, [keycloak, history]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                backgroundColor: "#fff",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    width: "100%",
                    padding: "50px 0",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: "url('/path/to/your/background-image.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.5,
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(to bottom, rgba(25, 118, 210, 0.8), rgba(25, 118, 210, 0.9))",
                        zIndex: 2,
                    }}
                />
                <Container
                    maxWidth="lg"
                    sx={{
                        position: "relative",
                        zIndex: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "2.5rem", md: "3.5rem" },
                            animation: "fadeInUp 1s ease-in-out",
                        }}
                    >
                        Welcome to Our Financial Management System
                    </Typography>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            marginBottom: "30px",
                            fontSize: { xs: "1.25rem", md: "2rem" },
                            animation: "fadeInUp 1.5s ease-in-out",
                        }}
                    >
                        Manage your personal and group finances effortlessly.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => keycloak.login()}
                        sx={{
                            padding: "10px 20px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            animation: "fadeInUp 2s ease-in-out",
                            backgroundColor: "#43ABFA"
                        }}
                    >
                        Get Started
                    </Button>
                </Container>
            </Box>

            <Box sx={{ width: "100%", padding: "50px 0" }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h3" gutterBottom>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={AccountIcon} alt="Account Management" style={{ width: 80, height: 80 }} />
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Account Management
                                </Typography>
                                <Typography>
                                    Manage all your accounts in one place, easily track balances, and monitor account activity.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={ExchangeIcon} alt="Transaction Management" style={{ width: 80, height: 80 }} />
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Transaction Management
                                </Typography>
                                <Typography>
                                    Keep track of all your transactions, categorize them, and stay on top of your spending.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={BudgetIcon} alt="Budget Management" style={{ width: 80, height: 80 }} />
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Budget Management
                                </Typography>
                                <Typography>
                                    Create and manage budgets to ensure you stay within your financial goals.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={SavingIcon} alt="Savings Management" style={{ width: 80, height: 80 }} />
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Savings Management
                                </Typography>
                                <Typography>
                                    Plan and track your savings goals to secure your future.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={LoanDebtIcon} alt="Loan/Debt Management" style={{ width: 80, height: 80 }} />
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Loan/Debt Management
                                </Typography>
                                <Typography>
                                    Monitor your loans and debts, and create repayment plans to manage them effectively.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={GroupIcon} alt="Group Finance Management" style={{ width: 80, height: 80 }} />
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Group Finance Management
                                </Typography>
                                <Typography>
                                    Collaborate with your team, track group expenses, and achieve your financial goals together.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ backgroundColor: "#e0e0e0", width: "100%", padding: "50px 0" }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h3" gutterBottom>
                        Why Choose Us?
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <img src={UserFriendlyIcon} alt="Group Finance Management" style={{ width: 80, height: 80 }} />
                            <Typography variant="h6" component="h4" gutterBottom>
                                User-Friendly Interface
                            </Typography>
                            <Typography>
                                Our platform is designed with you in mind, making it easy to navigate and use.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <img src={SecureIcon} alt="Group Finance Management" style={{ width: 80, height: 80 }} />
                            <Typography variant="h6" component="h4" gutterBottom>
                                Secure and Reliable
                            </Typography>
                            <Typography>
                                Your data is safe with us. We prioritize your privacy and the security of your financial information.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <img src={FinancialIcon} alt="Group Finance Management" style={{ width: 80, height: 80 }} />
                            <Typography variant="h6" component="h4" gutterBottom>
                                Comprehensive Features
                            </Typography>
                            <Typography>
                                From budgeting to group finance management, we have all the tools you need to succeed financially.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ width: "100%", padding: "50px 0" }}>
                <Container maxWidth="lg">
                    <img src={StartIcon} alt="Group Finance Management" style={{ width: 80, height: 80 }} />
                    <Typography variant="h4" component="h3" gutterBottom>
                        Ready to step on the path to financial freedom?
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => keycloak.login()}>
                        Join Now
                    </Button>
                </Container>
            </Box>

            <Box sx={{ backgroundColor: "#1976d2", color: "#fff", width: "100%", padding: "20px 0" }}>
                <Container maxWidth="lg">
                    <Typography variant="h6" component="h4" gutterBottom>
                        Contact Us
                    </Typography>
                    <Typography>
                        Email: minhvu8a@gmail.com | Phone: (+84) 0333427350
                    </Typography>
                    <Typography>
                        Address: Thinh Liet, Hoang Mai, Hanoi, Vietnam
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
