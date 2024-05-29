import { LinearProgress } from "@mui/material";
import { Layout } from "layout";
import { drawerWidth } from "layout/sidebar/SideBar";
import { Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useNotificationState } from "state/NotificationState";
import NotFound from "views/errors/NotFound";
import PrivateRoute from "./PrivateRoute";
import TeacherRouter from "./TeacherRouter";
import DemoScreen from "views/DemoScreen";
import ListWalletScreen from "views/detail-screen/wallet/VisibleWalletScreen";
import AllExchangeScreen from "views/AllExchangeScreen";
import ListBudgetScreen from "views/ListBudgetScreen";
import ListSavingScreen from "views/ListSavingScreen";
import ListLoanAndDebtScreen from "views/ListLoanAndDebtScreen";
import GroupWalletScreen from "views/group/GroupWalletScreen";
import WalletDetailScreen from "views/detail-screen/wallet/WalletDetailScreen";
import WalletManagementScreen from "views/WalletManagementScreen";
import ExchangeDetailScreen from "views/detail-screen/exchange/ExchangeDetailScreen";
import { request } from "api";

const styles = {
  loadingProgress: {
    position: "fixed",
    top: 0,
    left: -drawerWidth,
    width: "calc(100% + 300px)",
    zIndex: 1202,
    "& div": {
      top: "0.5px",
    },
  },
};

function MainAppRouter(props) {
  const location = useLocation();
  const notificationState = useNotificationState();

  useEffect(() => {
    notificationState.open.set(false);
    request("get", `/user-info/userId`, (res) => {
      console.log(res.data);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('currency', res.data.currency.code);
  }).then();
  }, [location.pathname]);

  return (
    <Layout>
      <Suspense fallback={<LinearProgress sx={styles.loadingProgress} />}>
        <Switch>
          <Route component={() => <></>} exact path="/" />
          <PrivateRoute component={DemoScreen} exact path="/demo" />
          <PrivateRoute component={WalletManagementScreen} exact path="/wallets" />
          <PrivateRoute component={WalletDetailScreen} exact path="/wallets/:walletId" />
          <PrivateRoute component={AllExchangeScreen} exact path="/exchanges" />
          <PrivateRoute component={ExchangeDetailScreen} exact path="/exchanges/:exchangeId" />
          <PrivateRoute component={ListBudgetScreen} exact path="/budgets" />
          <PrivateRoute component={ListSavingScreen} exact path="/savings" />
          <PrivateRoute component={ListLoanAndDebtScreen} exact path="/all-loan-debt" />
          <PrivateRoute component={GroupWalletScreen} exact path="/group-wallets" />
          <PrivateRoute component={TeacherRouter} path="/teacher" />

          {/* <Route component={error} path="*" /> */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRouter;
