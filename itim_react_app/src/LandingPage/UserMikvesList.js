import './UserMikvesList.css';
import React, { useState } from 'react';

const UserMikvesList = ({ mikves }) => {
    const [selectedMikve, setSelectedMikve] = useState(null);

    const handleShowDetails = (mikve) => {
        setSelectedMikve(mikve);
    };

    const handleCloseDetails = () => {
        setSelectedMikve(null);
    };

    return (
        <div className="mikves-list-container">
            <h3 className="list-header">מקוואות שמצאנו עבורך</h3>
            <div className="list">
                {mikves.map(mikve => (
                    <div key={mikve.id} className="mikve-item">
                        <p><strong>{mikve.name}</strong></p>
                        <p>{mikve.address}</p>
                        <p>{mikve.city}</p>
                        {selectedMikve && selectedMikve.id === mikve.id ? (
                            <div className="additional-info">
                                <p><strong>{`טלפון - ${selectedMikve.phone}`}</strong></p>
                                <p><strong>{`מיגון - ${selectedMikve.shelter}`}</strong></p>
                                <p><strong>{`נגישות - ${selectedMikve.accessibility}`}</strong></p>
                                <button onClick={handleCloseDetails}>סגור</button>
                            </div>
                        ) : (
                            <button onClick={() => handleShowDetails(mikve)}>מידע נוסף</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserMikvesList;
