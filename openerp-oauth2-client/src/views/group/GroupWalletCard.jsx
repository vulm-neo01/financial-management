// src/components/GroupWalletCard.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import './css/GroupWalletCard.css'; // Import CSS file for custom styling
import { request } from 'api'; // Import the request function
import StarIcon from '@mui/icons-material/Star';
import { formatDate } from 'utils/formatDate';
import { useHistory } from 'react-router-dom';

const GroupWalletCard = ({ groupWallet, userId }) => {
    const [members, setMembers] = useState(null);
    const history = useHistory();
    useEffect(() => {
        request("get", `/group/members/all/${groupWallet.groupWalletId}`, (res) => {
            setMembers(res.data);
        }).then();
    }, [groupWallet.groupWalletId]);

    const isOwner = groupWallet.owner.userId === userId;
    const memberCount = members ? members.length : 0;
    const formattedDate = groupWallet.createdAt ? new Date(groupWallet.createdAt).toLocaleDateString() : 'N/A';

    const handleClickGroupWallet = () => {
        history.push(`/group-wallets/${groupWallet.groupWalletId}`);
    }

    return (
        <div onClick={handleClickGroupWallet} key={groupWallet.groupWalletId} className="overview-card">
            <div className="overview-logo-name">
                <img src={groupWallet.logo.url} alt={groupWallet.groupName} className="overview-logo" />
                <Box display="flex" alignItems="center">
                    <Typography variant="body1"><strong>{groupWallet.groupName}</strong></Typography>
                    {isOwner && <StarIcon className="owner-indicator" />}
                </Box>
            </div>
            <Typography variant="body2">Tổng số tiền hiện tại: {groupWallet.amount.toLocaleString()} đ</Typography>
            <Typography variant="body2">Tổng số thành viên: {memberCount}</Typography>
            <Typography variant="body2">Bắt đầu từ: {groupWallet.createdAt ? formatDate(groupWallet.createdAt) : 'N/A'}</Typography>
        </div>
    );
};

GroupWalletCard.propTypes = {
    groupWallet: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
};

export default GroupWalletCard;