// UserMikvesList.js
import React, { useState } from 'react';
import MikveDetailsPopup from './MikveDetailsPopup';
import './UserMikvesList.css';

/**
 * UserMikvesList Component
 * 
 * This component displays a list of mikves and provides functionality to view more details about each mikve.
 * It also includes a "Load More" button to fetch additional mikves when available.
 *
 * @param {Object[]} mikves - An array of mikve objects to be displayed
 * @param {function} loadMore - Function to load more mikves when the "Load More" button is clicked
 * @param {boolean} hasMore - Indicates whether there are more mikves to load
 */
const UserMikvesList = ({ mikves, loadMore, hasMore }) => {
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    /**
     * Handles the action of showing details for a specific mikve
     * @param {Object} mikve - The mikve object to show details for
     */
    const handleShowDetails = (mikve) => {
        setSelectedMikve(mikve);
        setShowDetailsPopup(true);
    };

    /**
     * Handles the action of closing the details popup
     */
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
                <button onClick={loadMore} className="load-more-button">מקוואות נוספים</button>
            )}

            {showDetailsPopup && selectedMikve && (
                <MikveDetailsPopup mikve={selectedMikve} onClose={handleCloseDetailsPopup} />
            )}
        </div>
    );
};

export default UserMikvesList;