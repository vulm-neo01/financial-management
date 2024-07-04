import React, { useState } from 'react';
import { Modal, Box, Typography, FormControl, Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

function GroupBudgetSelection({ open, onClose, onSelectCategory, budgetCategories }) {
    const handleCategorySelect = (groupBudgetId) => {
        console.log(groupBudgetId);
        onSelectCategory(groupBudgetId);
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
                    Select Group Budget
                </Typography>
                <List>
                    {budgetCategories && budgetCategories.map(groupBudget => (
                        <ListItem button key={groupBudget.groupBudgetId} onClick={() => handleCategorySelect(groupBudget.groupBudgetId)}>
                            <ListItemAvatar>
                                <Avatar src={groupBudget.logo.url} alt={groupBudget.name} />
                            </ListItemAvatar>
                            <ListItemText primary={groupBudget.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
}

export default GroupBudgetSelection;
