import React, { useState, useEffect } from 'react';
import { request } from 'api';

function ColorSelection({ onSelect, type, colorId }) {
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        request("get", `/color/${type}`, (res) => {
            setColors(res.data);
        }).then();
    }, []);

    const handleColorSelect = (colorId) => {
        setSelectedColor(colorId);
        onSelect(colorId);
    };
    const handleColorToggle = (colorId) => {
        if (selectedColor === colorId) {
            setSelectedColor(null);
            onSelect(null);
        } else {
            setSelectedColor(colorId);
            onSelect(colorId);
        }
    };
    return (
        <div style={{ display: 'flex', overflowX: 'auto', maxWidth: '100%' }}>
            {colors.map((color) => (
                <div key={color.colorId} style={{ marginRight: '10px' }}>
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: color.hexCode,
                            cursor: 'pointer',
                            border: selectedColor === color.colorId ? '3px solid black' : '2px solid transparent'
                        }}
                        onClick={() => handleColorToggle(color.colorId)}
                    />
                </div>
            ))}
        </div>
    );
}

export default ColorSelection;