// MikveDetailsPopup.js
import React from 'react';
import './MikveDetailsPopup.css';


const MikveDetailsPopup = ({ mikve, onClose }) => {
    const generalShelterMap = {
        "0": "ללא מיגון",
        "1": "מיגון חלקי",
        "2": "מיגון מלא"
    }
    const generalAccessibilityMap = {
        "0": "לא נגיש",
        "1": "נגישות חלקית",
        "2": "נגישות מלאה"
    }
    const getStaticMapUrl = (mikve) => {
        const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
        if (mikve.position && mikve.position.latitude && mikve.position.longitude) {
            return `https://maps.googleapis.com/maps/api/staticmap?center=${mikve.position.latitude},${mikve.position.longitude}&zoom=15&size=400x200&markers=color:red%7C${mikve.position.latitude},${mikve.position.longitude}&key=${API_KEY}`;
        } else {
            return `https://maps.googleapis.com/maps/api/staticmap?center=31.0461,34.8516&zoom=6&size=400x200&key=${API_KEY}`;
        }
    };


    const openInGoogleMaps = () => {
        if (mikve && mikve.position) {
            const url = `https://www.google.com/maps/search/?api=1&query=${mikve.position.latitude},${mikve.position.longitude}`;
            window.open(url, '_blank');
        }

    };


    const getAddress = (address, city) => {
        if (address && city) {
            return `${address}, ${city}`;
        } else if (address) {
            return address;
        } else if (city) {
            return city;
        } else {
            return 'לא קיים מידע בנושא';
        }
    };
    const getWaterSampling = (waterSampling) => {
        if (waterSampling === "0") {
            return 'לא נבדק'
        } else if (waterSampling === "1") {
            return 'נבדק ותקין'
        } else if (waterSampling === "2") {
            return 'נבדק ולא תקין'
        } else {
            return 'לא קיים מידע בנושא';
        }
    }

    return (
        <div className="mikve-popup">
            <div className="mikve-popup-content">
                <button className="close-popup" onClick={onClose}>X</button>
                <h2>{mikve.name || "מקווה"}</h2>
                <p><strong>כתובת:</strong> {getAddress(mikve.address, mikve.city)}</p>
                <p><strong>טלפון:</strong> {mikve.phone || 'לא קיים מידע בנושא'}</p>
                <p><strong>נגישות:</strong> {mikve.accessibility || generalAccessibilityMap[mikve.general_accessibility]}</p>
                <p><strong>מיגון:</strong> {mikve.shelter || generalShelterMap[mikve.general_shelter]}</p>
                <p><strong>השגחה:</strong> {mikve.levad !== undefined ? (mikve.levad ? 'מותר לרחוץ לבד' : 'אסור לרחוץ לבד') : 'לא קיים מידע בנושא'}</p>
                <p><strong>בדיקת מים:</strong> {getWaterSampling(mikve.water_sampling)}</p>

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