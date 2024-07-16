// UserMikvesList.js
import React, { useState } from 'react';
import MikveDetailsPopup from './MikveDetailsPopup';
import './UserMikvesList.css';

const UserMikvesList = ({ mikves, loadMore, hasMore }) => {
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    const handleShowDetails = (mikve) => {
        setSelectedMikve(mikve);
        setShowDetailsPopup(true);
    };

    const handleCloseDetailsPopup = () => {
        setShowDetailsPopup(false);
        setSelectedMikve(null);
    };

    return (
        <div className="mikves-list-container">
            <div className="list">
                {mikves.map(mikve => (
                    <div key={mikve.id} className="mikve-item">
                        <p><strong>{mikve.name || "מקווה"}</strong></p>
                        {mikve.address && (<p>{mikve.address}</p>)}
                        <p>{mikve.city}</p>
                        <button onClick={() => handleShowDetails(mikve)}>מידע נוסף</button>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button onClick={loadMore} className="load-more-button">טען עוד</button>
            )}

            {showDetailsPopup && selectedMikve && (
                <MikveDetailsPopup mikve={selectedMikve} onClose={handleCloseDetailsPopup} />
            )}
        </div>
    );
};

export default UserMikvesList;