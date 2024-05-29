import React, { useState, useEffect } from 'react';
import { request } from 'api';

function LogoSelection({ onSelect, type, logoId }) {
    const [logos, setLogos] = useState([]);
    const [selectedLogo, setSelectedLogo] = useState(null);

    useEffect(() => {
        request("get", `/logo/${type}`, (res) => {
            // console.log(res.data);
            setLogos(res.data);
        }).then();
    }, []);

    const handleLogoSelect = (logoId) => {
        setSelectedLogo(logoId);
        onSelect(logoId);
    };

    const handleLogoToggle = (logoId) => {
        if (selectedLogo === logoId) {
            setSelectedLogo(null);
            onSelect(null);
        } else {
            setSelectedLogo(logoId);
            onSelect(logoId);
        }
    };
    return (
        <div style={{ display: 'flex', overflowX: 'auto', maxWidth: '100%' }}>
            {logos.map((logo) => (
                <div key={logo.logoId} style={{ marginRight: '10px' }}>
                    <img
                        src={logo.url}
                        alt={logo.name}
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '20%',
                            cursor: 'pointer',
                            border: selectedLogo === logo.logoId ? '3px solid #4caf50' : '2px solid transparent'
                        }}
                        onClick={() => handleLogoToggle(logo.logoId)}
                    />
                </div>
            ))}
        </div>
    );
}

export default LogoSelection;
