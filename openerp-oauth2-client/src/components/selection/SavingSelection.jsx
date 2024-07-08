import React, { useState, useEffect } from 'react';
import { request } from 'api';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
    savingSelectContainer: {
        width: '220px',
        marginBottom: '2px',
    },
    savingSelect: {
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
    savingOption: {
        fontSize: '14px',
        color: '#333',
        backgroundColor: '#fff',
    },
}));

function SavingSelection({ onSelect, initialSavingId }) {
    const [savings, setSavings] = useState([]);
    const [selectedSaving, setSelectedSaving] = useState('');
    const userId = localStorage.getItem('userId');
    const theme = useTheme();
    const classes = useStyles();

    useEffect(() => {
        request('get', `/savings/user/${userId}`, (res) => {
            setSavings(res.data.filter(s => s.isActive === true));
            if (initialSavingId) {
                setSelectedSaving(initialSavingId);
                const selectedSaving = res.data.find(s => s.savingId === initialSavingId);
                onSelect(initialSavingId, selectedSaving ? selectedSaving.startDate : null);
            }
        }).then();
    }, [initialSavingId]);

    const handleSavingSelect = (event) => {
        const selectedSavingId = event.target.value;
        setSelectedSaving(selectedSavingId);
        const selectedSaving = savings.find(s => s.savingId === selectedSavingId);
        onSelect(selectedSavingId, selectedSaving ? selectedSaving.startDate : null);
    };

    return (
        <div className={classes.savingSelectContainer}>
            <Select
                value={selectedSaving}
                onChange={handleSavingSelect}
                className={classes.savingSelect}
            >
                <MenuItem value="">Choose a saving</MenuItem>
                {savings.map((saving) => (
                    <MenuItem key={saving.savingId} value={saving.savingId} className={classes.savingOption}>
                        {saving.name}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
}

export default SavingSelection;