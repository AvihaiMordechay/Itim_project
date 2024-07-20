// MikveDetailsPopup.js
import React from 'react';
import './MikveDetailsPopup.css';
import { format } from 'date-fns';

/**
 * MikveDetailsPopup Component
 * 
 * This component displays a popup with detailed information about a specific mikve.
 * It includes information such as address, phone number, accessibility, shelter status,
 * supervision rules, water sampling status, and a map of the mikve's location.
 *
 * @param {Object} mikve - The mikve object containing all the details to be displayed
 * @param {function} onClose - Function to close the popup
 */
const MikveDetailsPopup = ({ mikve, onClose }) => {
    // Mapping for shelter status
    const generalShelterMap = {
        "0": "ללא מיגון",
        "1": "מיגון חלקי",
        "2": "מיגון מלא"
    }

    // Mapping for accessibility status
    const generalAccessibilityMap = {
        "0": "לא נגיש",
        "1": "נגישות חלקית",
        "2": "נגישות מלאה"
    }

    /**
     * Generates a URL for a static Google Map image of the mikve's location
     * @param {Object} mikve - The mikve object
     * @returns {string} The URL for the static map image
     */
    const getStaticMapUrl = (mikve) => {
        const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
        if (mikve.position && mikve.position.latitude && mikve.position.longitude) {
            return `https://maps.googleapis.com/maps/api/staticmap?center=${mikve.position.latitude},${mikve.position.longitude}&zoom=15&size=400x200&markers=color:red%7C${mikve.position.latitude},${mikve.position.longitude}&key=${API_KEY}`;
        } else {
            return `https://maps.googleapis.com/maps/api/staticmap?center=31.0461,34.8516&zoom=6&size=400x200&key=${API_KEY}`;
        }
    };

    /**
     * Opens Google Maps in a new tab with the mikve's location
     */
    const openInGoogleMaps = () => {
        if (mikve && mikve.position) {
            const url = `https://www.google.com/maps/search/?api=1&query=${mikve.position.latitude},${mikve.position.longitude}`;
            window.open(url, '_blank');
        }

    };

    /**
     * Formats the address string based on available information
     * @param {string} address - The street address of the mikve
     * @param {string} city - The city where the mikve is located
     * @returns {string} Formatted address string
     */
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

    /**
     * Translates the water sampling status code to a human-readable string
     * @param {string} waterSampling - The water sampling status code
     * @returns {string} Human-readable water sampling status
     */
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
                <p><strong>טבילה לבד:</strong> {mikve.levad !== undefined ? (mikve.levad ? 'ניתן לטבול לבד' : 'לא ניתן לטבול לבד') : 'לא קיים מידע בנושא'}</p>
                <p><strong>בדיקת מים:</strong> {getWaterSampling(mikve.water_sampling)}</p>
                {mikve.water_sampling !== "0" && (<p><strong>תאריך דגימת מים</strong> {mikve.when_sampling !== undefined ? (format(new Date(mikve.when_sampling), 'dd-MM-yyyy')) : 'לא קיים תאריך'}</p>)}

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