import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, IconButton, Box } from '@mui/material';
import { request } from 'api';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';

function LogoSelection({ onSelect, type, logoId }) {
    const [logos, setLogos] = useState([]);
    const [selectedLogo, setSelectedLogo] = useState(logoId);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        request("get", `/logo/${type}`, (res) => {
            const sortedLogos = res.data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            if (logoId) {
                setSelectedLogo(logoId);
            }
            setLogos(sortedLogos);
        });
    }, [logoId]);

    const handleLogoSelect = (logoId) => {
        setSelectedLogo(logoId);
        onSelect(logoId);
        setOpen(false);
    };

    const handleLogoClear = () => {
        setSelectedLogo(null);
        onSelect(null);
        setOpen(false);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <div style={{ display: 'flex', overflowX: 'auto', maxWidth: '100%', alignItems: 'center' }}>
                <div onClick={handleOpen} style={{ cursor: 'pointer', border: '2px solid transparent', display: 'flex', alignItems: 'center' }}>
                    <img
                        src={selectedLogo ? logos.find(logo => logo.logoId === selectedLogo)?.url : 'https://via.placeholder.com/50'}
                        alt="Selected Logo"
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '20%',
                            border: selectedLogo ? '2px solid #4caf50' : '2px solid transparent'
                        }}
                    />
                </div>
                {selectedLogo && (
                    <IconButton onClick={handleLogoClear} style={{ marginLeft: '10px' }}>
                        <ClearIcon />
                    </IconButton>
                )}
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Select a Logo
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} sm={3} md={2}>
                                <div
                                    onClick={handleLogoClear}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer',
                                        border: '2px solid transparent',
                                        borderRadius: '20%',
                                        backgroundColor: '#f0f0f0'
                                    }}
                                >
                                    <ClearIcon />
                                </div>
                            </Grid>
                            {logos.map((logo) => (
                                <Grid item key={logo.logoId} xs={4} sm={3} md={2}>
                                    <img
                                        src={logo.url}
                                        alt={logo.name}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            borderRadius: '20%',
                                            cursor: 'pointer',
                                            border: selectedLogo === logo.logoId ? '3px solid #4caf50' : '2px solid transparent',
                                            transition: 'border 0.3s ease-in-out'
                                        }}
                                        onClick={() => handleLogoSelect(logo.logoId)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default LogoSelection;