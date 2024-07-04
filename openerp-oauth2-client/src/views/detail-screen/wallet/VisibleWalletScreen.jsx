import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {request} from "../../../api";
import {StandardTable} from "erp-hust/lib/StandardTable";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {currency, symbol} from '../../../utils/currency'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ConfirmationModal from "components/modal/ConfirmationModal";
import UpdateWalletModal from "components/modal/UpdateWalletModal";

function VisibleWalletScreen({onUpdateWalletData, wallets}) {

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalChangeStatusOpen, setIsModalChangeStatusOpen] = useState(false);
    const [changeStatusForm, setChangeStatusForm] = useState(
        {
            userId: localStorage.getItem('userId'),
            status: false
        }
    );
    const [walletId, setWalletId] = useState(null);
    const [updateWallet, setUpdateWallet] = React.useState(false);

    const handleOpenUpdateWalletDialog = (rowData) => {
        setUpdateWallet(true);
        setWalletId(rowData.walletId);
    };

    const handleCloseUpdateWalletDialog = () => {
        setUpdateWallet(false);
        setWalletId(null);
    };

    const history = useHistory ();

    const handleClickOpenModalChangeStatus = (rowData) => {
        setIsModalChangeStatusOpen(true);
        setWalletId(rowData.walletId);
    };

    const handleClickOpenModalDelete = (rowData) => {
        setIsModalDeleteOpen(true);
        setWalletId(rowData.walletId);
    };

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
        //     const includedInTotalAmount = res.data.filter(item => item.includeInTotalAmount === true);
        //     console.log(includedInTotalAmount);
        //     setWallets(includedInTotalAmount);

        // }).then();
    }, [])

    // Sử dụng phương thức reduce để tính tổng số tiền của các wallet
    const totalAmount = wallets.reduce((accumulator, currentValue) => {
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
                        <SaveAltIcon/>
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
    const handleClickWallet = (wallet) => {
        const walletId = wallet.walletId;
        history.push(`/wallets/${walletId}`);
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h3>Total Amount: <span style={{color: 'red', fontWeight: 'bold', fontSize: '20px'}}>
                        {totalAmount.toLocaleString()} {currency}
                    </span>
                </h3>
            </div>
            <StandardTable
                title="Wallet List"
                columns={columns}
                data={wallets}
                // hideCommandBar
                options={{
                    selection: false,
                    pageSize: 5,
                    search: true,
                    sorting: true,
                }}
            />
            {updateWallet ? 
                <UpdateWalletModal onUpdateWallet={handleUpdateWalletData} open={updateWallet} onClose={handleCloseUpdateWalletDialog} walletId={walletId}/>
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

export default VisibleWalletScreen;