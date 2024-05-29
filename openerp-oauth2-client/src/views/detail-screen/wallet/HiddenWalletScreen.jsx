import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {request} from "../../../api";
import {StandardTable} from "erp-hust/lib/StandardTable";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {currency, symbol} from '../../../utils/currency'
import UploadIcon from '@mui/icons-material/Upload';
import ConfirmationModal from "components/modal/ConfirmationModal";
import UpdateWalletModal from "components/modal/UpdateWalletModal";

function HiddenWalletScreen({hiddenWallets, onUpdateWalletData }) {

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalChangeStatusOpen, setIsModalChangeStatusOpen] = useState(false);
    const [changeStatusForm, setChangeStatusForm] = useState(
        {
            userId: localStorage.getItem('userId'),
            status: true
        }
    );
    const [updateWallet, setUpdateWallet] = React.useState(false);
    const [walletId, setWalletId] = useState(null);

    const handleOpenUpdateWalletDialog = (rowData) => {
        setUpdateWallet(true);
        setWalletId(rowData.walletId);
    };

    const handleCloseUpdateWalletDialog = () => {
        setUpdateWallet(false);
        setWalletId(null);
    };

    const handleClickOpenModalChangeStatus = (rowData) => {
        setIsModalChangeStatusOpen(true);
        setWalletId(rowData.walletId);
    };

    const handleClickOpenModalDelete = (rowData) => {
        setIsModalDeleteOpen(true);
        setWalletId(rowData.walletId);
    };
    

    const history = useHistory ();

    const handleUpdateWalletData = (updatedWallets) => {
        // Gọi hàm callback được truyền từ component cha và truyền dữ liệu mới của danh sách ví
        onUpdateWalletData(updatedWallets);
    };
    const handleClickChangeStatusConfirm = (walletId) => {
        console.log(changeStatusForm);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("post", `/wallet/change-status/${walletId}`, (res) => {
            console.log(res.data);
            // Sau khi change status xong, reset dữ liệu và đóng modal
            setIsModalChangeStatusOpen(false);
            handleUpdateWalletData(res.data);
        }, (error) => {
            console.error("Error change wallet status:", error);
            // Xử lý lỗi nếu cần thiết
        }, changeStatusForm);
        setIsModalChangeStatusOpen(false);
    };

    const handleDeleteWallet = (walletId) => {
        console.log(changeStatusForm);
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("delete", `/wallet/${walletId}`, (res) => {
            console.log(res.data);
            setIsModalDeleteOpen(false);
            handleUpdateWalletData(res.data);
        }, (error) => {
            console.error("Error when delete wallet:", error);
            // Xử lý lỗi nếu cần thiết
        }, changeStatusForm);
        setIsModalDeleteOpen(false);
    };

    useEffect(() => {
        // request("get", `/wallet/user/${localStorage.getItem('userId')}`, (res) => {
        //     const notIncludedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === false);
        //     console.log(notIncludedInTotalAmount);
        //     setHiddenWallets(notIncludedInTotalAmount);

        // }).then();
    }, [])

    // Sử dụng phương thức reduce để tính tổng số tiền của các wallet
    const totalAmount = hiddenWallets.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
    }, 0);
    const typeLabels = {
        "cash": "Tiền mặt",
        "e-wallet": "Ví tiền điện tử",
        "bank-account": "Tài khoản ngân hàng",
        "credit": "Credit Card",
        "other": "Khác",
    };
    const columns = [
        {
            title: "",
            render: (rowData) => (
                <img src={rowData.logo.url} alt="Logo" style={{ width: 50, height: 50 }} />
            )
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Wallet Type",
            field: "type",
            render: rowData => typeLabels[rowData.type]
        },
        {
            title: "Amount",
            field: "amount",
            render: (rowData) => {
                const formattedAmount = rowData.amount.toLocaleString();
                return `${formattedAmount} ${symbol}`;
            }
        },
        {
            title: "Detail",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleClickWallet(rowData)
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
            title: "Chức năng khác",
            sorting: false,
            render: (rowData) => (
                <div>
                    <IconButton
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpenModalChangeStatus(rowData)}
                    >
                        <UploadIcon/>
                    </IconButton>
                    {/* <ConfirmationModal
                        open={isModalChangeStatusOpen}
                        onClose={() => setIsModalChangeStatusOpen(false)}
                        onConfirm={() => {handleClickChangeStatusConfirm(rowData)}}
                        question="Lưu Trữ Wallet"
                    /> */}
                    <IconButton
                        onClick={() => handleOpenUpdateWalletDialog(rowData)}
                        variant="contained"
                        color="success"
                    >
                        <EditIcon/>
                    </IconButton>
                    {/* <UpdateWalletModal open={updateWallet} onClose={handleCloseUpdateWalletDialog} walletId={rowData.walletId}/> */}
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

    const demoFunction = (user) => {
        alert("You clicked on User: " + user.id)
    }
    const handleClickWallet = (wallet) => {
        const walletId = wallet.walletId;
        history.push(`/wallets/${walletId}`);
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h2>Total Hidden Amount: <span style={{color: 'red', fontWeight: 'bold', fontSize: '24px'}}>
                        {totalAmount.toLocaleString()} {currency}
                    </span>
                </h2>
            </div>
            <StandardTable
                title="Hidden Wallet List"
                columns={columns}
                data={hiddenWallets}
                // hideCommandBar
                options={{
                    selection: false,
                    pageSize: 10,
                    search: true,
                    sorting: true,
                }}
            />
                        {updateWallet ? 
                <UpdateWalletModal onUpdateWallet={handleUpdateWalletData}  open={updateWallet} onClose={handleCloseUpdateWalletDialog} walletId={walletId}/>
                : null
            }
            {
                isModalChangeStatusOpen ?
                <ConfirmationModal
                    open={isModalChangeStatusOpen}
                    onClose={() => {{setIsModalChangeStatusOpen(false); setWalletId(null)}}}
                    onConfirm={() => {handleClickChangeStatusConfirm(walletId)}}
                    question="Lưu Trữ Wallet"
                />
                : null
            }
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={() => {{setIsModalDeleteOpen(false); setWalletId(null)}}}
                    onConfirm={() => {handleDeleteWallet(walletId)}}
                    question="Xóa Wallet"
                /> 
                : null
            }
        </div>
        

    );
}

export default HiddenWalletScreen;