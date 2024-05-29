import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Button, Box } from '@mui/material';

function AddWallet() {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Các phần khác của component

    return (
        <div>
            {/* Nút tạo ví mới */}
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Tạo ví mới
            </Button>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
                    <h2 id="modal-modal-title">Tạo ví mới</h2>
                    <p id="modal-modal-description">Nội dung của màn hình pop-up ở đây.</p>
                    <Button onClick={handleCloseModal}>Đóng</Button>
                </Box>
            </Modal>
        </div>
    );
}

export default AddWallet;