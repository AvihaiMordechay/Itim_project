import './UserMikvesList.css';
import React, { useState } from 'react';

const UserMikvesList = ({ mikves }) => {
    const [selectedMikve, setSelectedMikve] = useState(null);

    const handleShowDetails = (mikve) => {
        setSelectedMikve(mikve);
    };

    const handleClosePopup = () => {
        setSelectedMikve(null);
    };

    const openInGoogleMaps = () => {
        if (selectedMikve && selectedMikve.position) {
            const url = `https://www.google.com/maps/search/?api=1&query=${selectedMikve.position.latitude},${selectedMikve.position.longitude}`;
            window.open(url, '_blank');
        }
    };

    const getStaticMapUrl = (mikve) => {
        const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${mikve.position.latitude},${mikve.position.longitude}&zoom=15&size=400x200&markers=color:red%7C${mikve.position.latitude},${mikve.position.longitude}&key=${API_KEY}`;
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
                        <button onClick={() => handleShowDetails(mikve)}>מידע נוסף</button>
                    </div>
                ))}
            </div>

            {selectedMikve && (
                <div className="mikve-popup">
                    <div className="mikve-popup-content">
                        <button className="close-popup" onClick={handleClosePopup}>X</button>
                        <h2>{selectedMikve.name}</h2>
                        <p><strong>כתובת:</strong> {selectedMikve.address}, {selectedMikve.city}</p>
                        <p><strong>טלפון:</strong> {selectedMikve.phone}</p>
                        <p><strong>נגישות:</strong> {selectedMikve.general_accessibility}</p>
                        <p><strong>מיגון:</strong> {selectedMikve.general_shelter}</p>
                        <p><strong>טבילה לבד:</strong> {selectedMikve.levad ? 'מותר' : 'אסור'}</p>
                        <p><strong>בדיקת מים:</strong> {selectedMikve.water_sampling}</p>
                        <p><strong>הערות:</strong> {selectedMikve.notes}</p>
                        
                        <div className="mikve-map">
                            <img 
                                src={getStaticMapUrl(selectedMikve)} 
                                alt="Mikveh location" 
                                onClick={openInGoogleMaps}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMikvesList;