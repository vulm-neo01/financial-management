import React, {useEffect, useState} from "react";
import { request } from "api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography, Modal, Box, Button } from "@mui/material";
import './css/OverviewGroupWallet.css';
import GroupWalletCard from "./GroupWalletCard";
import AddIcon from "@mui/icons-material/Add";
import GroupWalletCreateModal from "components/modal/GroupWalletCreateModal";
import AddWallet from "views/detail-screen/wallet/AddWallet";

function GroupWalletScreen() {

    const [groupWallets, setGroupWallets] = useState([]);
    const userId = localStorage.getItem('userId');
    const [openAddModal, setOpenAddModal] = useState(false);

    useEffect(() => {
        request("get", `/group/wallets/all/${userId}`, (res) => {
            console.log(res.data);
            setGroupWallets(res.data);
        }).then();
    }, [groupWallets.length])

    const handleOpenAddGroupWalletModal = () => {
        setOpenAddModal(true);
    };

    const handleCloseAddGroupWalletModal = () => {
        setOpenAddModal(false);
    };

    const handleUpdateWalletData = (updatedWallets) => {
        setGroupWallets(updatedWallets);
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Group Wallets
            </Typography>
            <div className="overview-group-wallets">
                <div className="gr-wallet-cards">
                    <div className="add-group-wallet-button" onClick={handleOpenAddGroupWalletModal}>
                        <AddIcon />
                        <Typography variant="body1">Add Group Wallet</Typography>
                    </div>
                    {groupWallets.map(groupWallet => (
                        <GroupWalletCard key={groupWallet.groupWalletId} groupWallet={groupWallet} userId={userId} />
                    ))}
                </div>
            </div>
            <GroupWalletCreateModal onCreateWallet={handleUpdateWalletData} open={openAddModal} onClose={handleCloseAddGroupWalletModal} />
        </div>

    );
}

export default GroupWalletScreen;