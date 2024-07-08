import React, { useState, useEffect } from 'react';
import { request } from 'api';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
    walletSelectContainer: {
        width: '220px',
        marginBottom: '2px',
    },
    walletSelect: {
        width: '100%',
        // padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px',
        color: '#333',
        backgroundColor: '#fff',
        '&:focus': {
            backgroundColor: '#fff',
        },
    },
    walletOption: {
        fontSize: '14px',
        color: '#333',
        backgroundColor: '#fff',
    },
}));

function WalletAcceptSendingSelection({ onSelect, initialWalletId }) {
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState('');
    const userId = localStorage.getItem('userId');
    const theme = useTheme();
    const classes = useStyles();

    useEffect(() => {
        request('get', `/wallet/user/${userId}`, (res) => {
            const filterWallets = res.data.filter(wallet => wallet.type !== 'credit');
            setWallets(filterWallets);
            // console.log(initialWalletId)
            if (initialWalletId) {
                setSelectedWallet(initialWalletId);
            }
        }).then();
    }, [initialWalletId]);

    const handleWalletSelect = (event) => {
        setSelectedWallet(event.target.value);
        onSelect(event.target.value, wallets.find(wallet => wallet.walletId === event.target.value).amount);
    };

    return (
        <div className={classes.walletSelectContainer}>
            <Select
                value={selectedWallet}
                onChange={handleWalletSelect}
                className={classes.walletSelect}
            >
                <MenuItem value="">Choose a wallet</MenuItem>
                {wallets.map((wallet) => (
                    <MenuItem key={wallet.walletId} value={wallet.walletId} className={classes.walletOption}>
                        {wallet.name}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
}

export default WalletAcceptSendingSelection;
