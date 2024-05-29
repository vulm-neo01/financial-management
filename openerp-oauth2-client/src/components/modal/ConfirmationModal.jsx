import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ConfirmationModal({ open, onClose, onConfirm, question, alert }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="confirmation-modal-title"
            aria-describedby="confirmation-modal-description"
            >
            <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
                <Typography id="confirmation-modal-title" variant="h5" component="h2" gutterBottom>
                {question}
                </Typography>
                <Typography id="confirmation-modal-description" variant="body1" gutterBottom>
                Bạn có chắc chắn muốn {question} này không?
                </Typography>
                <Typography id="confirmation-modal-description" variant="body1" gutterBottom>
                {alert}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '1.5rem' }}>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Confirm
                </Button>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cancel
                </Button>
                </Box>
            </Box>
        </Modal>
    );
}


export default ConfirmationModal;