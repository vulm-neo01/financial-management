import React, {useEffect, useState} from "react";
import {request} from "../api";
import {StandardTable} from "erp-hust/lib/StandardTable";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ListLoanAndDebtScreen() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        request("get", "/wallet/user/aaaaaaaaaakkkkkkkkkeeeeeeeeeeeeeaaaaaaaaaa", (res) => {
            console.log(res.data);
            setUsers(res.data);
        }).then();
    }, [])

    // const user_info = user

    const columns = [
        {
            title: "Wallet",
            field: "walletId",
        },
        {
            title: "Username",
            // render: (row) => row.user.user.id,
            // field: "user?.user?.id",    
            render: (rowData) => {
                const nestedUser = rowData.user?.user;
                return nestedUser ? nestedUser.id : null; // Return null or handle missing nestedUser appropriately
            },
        },
        {
            title: "Wallet Type",
            field: "type",
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Amount",
            field: "amount",
        },
        {
            title: "Currency",
            field: "currency.code",
        },
        // {
        //     title: "User",
        //     field: "id",
        // },
        // {
        //     title: "Creation time",
        //     field: "createdOn",
        // },
        {
            title: "Edit",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        demoFunction(rowData)
                    }}
                    variant="contained"
                    color="success"
                >
                    <EditIcon/>
                </IconButton>
            ),
        },
        {
            title: "Delete",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        demoFunction(rowData)
                    }}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon/>
                </IconButton>
            ),
        },
    ];

    const demoFunction = (user) => {
        alert("You clicked on User: " + user.id)
    }

    return (
        <div>
            <StandardTable
                title="User List"
                columns={columns}
                data={users}
                // hideCommandBar
                options={{
                    selection: false,
                    pageSize: 20,
                    search: true,
                    sorting: true,
                }}
            />
        </div>

    );
}

export default ListLoanAndDebtScreen;