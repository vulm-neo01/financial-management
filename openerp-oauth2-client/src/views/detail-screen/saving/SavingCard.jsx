import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import '../../css/SavingCard.css';

const SavingCard = ({ handleClick, saving }) => {
    const progress = (saving.currentAmount / saving.targetAmount) * 100;
    const borderColor = saving.color ? saving.color.colorId : '#fff';

    return (
        <div onClick={() => handleClick(saving.savingId)} key={saving.savingId} className="saving-card" style={{ backgroundColor: borderColor }}>
            <div className="saving-logo-name">
                <img src={saving.logo.url} alt={saving.name} className="saving-logo" />
                <Typography variant="h6">{saving.name}</Typography>
            </div>
            <div className="saving-progress">
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="saving-info">
                    <span>Origin: {saving.originAmount.toLocaleString()} đ</span>
                    <span>Current: {saving.currentAmount.toLocaleString()} đ</span>
                    <span>Target: {saving.targetAmount.toLocaleString()} đ</span>
                </div>
            </div>
        </div>
    );
};

SavingCard.propTypes = {
    saving: PropTypes.object.isRequired,
};

export default SavingCard;