// MikveDetailsPopup.js
import React from 'react';
import './MikveDetailsPopup.css';


const MikveDetailsPopup = ({ mikve, onClose }) => {
    const getStaticMapUrl = (mikve) => {
        const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${mikve.position.latitude},${mikve.position.longitude}&zoom=15&size=400x200&markers=color:red%7C${mikve.position.latitude},${mikve.position.longitude}&key=${API_KEY}`;
    };

    const openInGoogleMaps = () => {
        if (mikve && mikve.position) {
            const url = `https://www.google.com/maps/search/?api=1&query=${mikve.position.latitude},${mikve.position.longitude}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="mikve-popup">
            <div className="mikve-popup-content">
                <button className="close-popup" onClick={onClose}>X</button>
                <h2>{mikve.name}</h2>
                <p><strong>כתובת:</strong> {mikve.address}, {mikve.city}</p>
                <p><strong>טלפון:</strong> {mikve.phone}</p>
                <p><strong>נגישות:</strong> {mikve.general_accessibility}</p>
                <p><strong>מיגון:</strong> {mikve.general_shelter}</p>
                <p><strong>טבילה לבד:</strong> {mikve.levad ? 'מותר' : 'אסור'}</p>
                <p><strong>בדיקת מים:</strong> {mikve.water_sampling}</p>
                <p><strong>הערות:</strong> {mikve.notes}</p>
                
                <div className="mikve-map">
                    <img 
                        src={getStaticMapUrl(mikve)} 
                        alt="Mikveh location" 
                        onClick={openInGoogleMaps}
                    />
                </div>
            </div>
        </div>
    );
};

export default MikveDetailsPopup;