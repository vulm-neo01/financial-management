import React, { useState } from 'react';
import { Modal, Box, Typography, FormControl, Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

function SavingCategorySelection({ open, onClose, onSelectCategory, savingCategories }) {
    const handleCategorySelect = (categoryId) => {
        onSelectCategory(categoryId);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h4" id="modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Select Saving Category
                </Typography>
                <List>
                    {savingCategories && savingCategories.map(category => (
                        <ListItem button key={category.savingCategoryId} onClick={() => handleCategorySelect(category.savingCategoryId)}>
                            <ListItemText primary={category.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
}

export default SavingCategorySelection;
