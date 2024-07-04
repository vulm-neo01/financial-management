import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    width: '60%', // Adjust width as needed
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ImageZoomModal = ({ imageUrl, onClose }) => {
    const [open, setOpen] = useState(true);

    return (
        <>
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <img src={imageUrl} alt="Exchange Image" style={{ width: '40%'}} /> {/* Set image width to 100% */}
            </Box>
        </Modal>
        </>
    );
};

export default ImageZoomModal;