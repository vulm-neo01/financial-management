import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import HistoryIcon from '@mui/icons-material/History';

const BottomButtons = () => {
    return (
        <div style={styles.container}>
            <button style={styles.buttonBlue}>
                <AddCircleIcon style={styles.icon} />
            </button>
            <button style={styles.buttonGreen}>
                <SyncAltIcon style={styles.icon} />
            </button>
            <button style={styles.buttonRed}>
                <HistoryIcon style={styles.icon} />
            </button>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        // bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBlue: {
        backgroundColor: 'blue',
        border: 'none',
        cursor: 'pointer',
        padding: 20,
        borderRadius: '50%',
        marginRight: 20,
    },
    buttonGreen: {
        backgroundColor: 'green',
        border: 'none',
        cursor: 'pointer',
        padding: 20,
        borderRadius: '50%',
        marginRight: 20,
    },
    buttonRed: {
        backgroundColor: 'red',
        border: 'none',
        cursor: 'pointer',
        padding: 20,
        borderRadius: '50%',
        marginRight: 20,
    },
    icon: {
        fontSize: 36,
        color: 'white',
    },
};

export default BottomButtons;
