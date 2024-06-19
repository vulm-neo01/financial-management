import React, { useState, useEffect } from 'react';
import { request } from 'api';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
    walletSelectContainer: {
        width: '220px',
        marginBottom: '10px',
    },
    walletSelect: {
        width: '100%',
        // padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        color: '#333',
        backgroundColor: '#fff',
        '&:focus': {
            backgroundColor: '#fff',
        },
    },
    walletOption: {
        fontSize: '16px',
        color: '#333',
        backgroundColor: '#fff',
    },
}));

function WalletSelection({ onSelect, initialWalletId }) {
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState('');
    const userId = localStorage.getItem('userId');
    const theme = useTheme();
    const classes = useStyles();

    useEffect(() => {
        request('get', `/wallet/user/${userId}`, (res) => {
            setWallets(res.data);
            // console.log(initialWalletId)
            if (initialWalletId) {
                setSelectedWallet(initialWalletId);
            }
        }).then();
    }, [initialWalletId]);

    const handleWalletSelect = (event) => {
        setSelectedWallet(event.target.value);
        const type = wallets.find(wallet => wallet.walletId === event.target.value).type;
        if(type === 'credit'){
            onSelect(event.target.value);
        } else {
            onSelect(event.target.value, wallets.find(wallet => wallet.walletId === event.target.value).amount);
        }
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

export default WalletSelection;
