import React, { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/distance';
import geocodeAddress from '../utils/geocode';
import './UserSearchForm.css';

const UserSearchForm = ({ setMikves, mikves }) => {
    const [cityStreet, setCityStreet] = useState('');
    const [name, setName] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [cleanliness, setCleanliness] = useState(false);
    const [balanit, setBalanit] = useState('');
    const [mamad, setMamad] = useState('');
    const [location, error] = useLocation();

    const handleSearch = async (e) => {
        e.preventDefault();

        // Construct search query based on user input
        const searchCityStreet = cityStreet.trim().toLowerCase();
        const searchName = name.trim().toLowerCase();

        const filteredMikves = mikves.filter(mikve => {
            // Check if the name matches
            const nameMatches = mikve.name.toLowerCase().includes(searchName);

            return (!accessibility || mikve.accessibility === accessibility) &&
                (!cleanliness || mikve.cleanliness) &&
                (!balanit || mikve.balanit === balanit) &&
                (!mamad || mikve.mamad === mamad) &&
                (searchName === '' || nameMatches);
        });

        let sortedMikves = [];
        try {
            if (searchName) {
                sortedMikves = filteredMikves;
            } else if (searchCityStreet) {
                const locationResult = await geocodeAddress(searchCityStreet);
                if (locationResult) {
                    sortedMikves = filteredMikves.map(mikve => ({
                        ...mikve,
                        distance: calculateDistance(locationResult, mikve.position)
                    })).sort((a, b) => a.distance - b.distance);
                } else {
                    console.warn("Could not parse the location.");
                }
            } else if (location) {
                sortedMikves = filteredMikves.map(mikve => ({
                    ...mikve,
                    distance: calculateDistance(location, mikve.position)
                })).sort((a, b) => a.distance - b.distance);
            } else {
                console.warn("Could not get user location. Sorting by default location.");
                const defaultLocation = { lat: 31.7683, lng: 35.2137 }; // Jerusalem coordinates
                sortedMikves = filteredMikves.map(mikve => ({
                    ...mikve,
                    distance: calculateDistance(defaultLocation, mikve.position)
                })).sort((a, b) => a.distance - b.distance);
            }
        } catch (error) {
            console.error("Error during sorting:", error);
            sortedMikves = filteredMikves; // Fallback to unsorted if an error occurs
        }

        if (sortedMikves.length === 0) {
            console.warn("No matching mikvehs found.");
        } else {
            console.log("Sorted mikvehs:", sortedMikves);
        }
        setMikves(sortedMikves);
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="עיר או רחוב"
                    value={cityStreet}
                    onChange={(e) => setCityStreet(e.target.value)}
                    className="search-bar"
                />
                <input
                    type="text"
                    placeholder="שם המקווה"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="search-bar"
                />
                <button type="submit" className="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M10 2a8 8 0 106.32 12.9l4.39 4.38a1 1 0 001.42-1.42l-4.38-4.39A8 8 0 0010 2zm0 2a6 6 0 11-4.24 10.24A6 6 0 0110 4z" />
                    </svg>
                </button>
            </div>
            <div className="filters">
                <div className="select-box">
                    <label className="select-header">נגישות</label>
                    <select value={accessibility} onChange={(e) => setAccessibility(e.target.value)} className="select-input">
                        <option value="">בחר</option>
                        <option value="none">אין נגישות</option>
                        <option value="partial">נגישות חלקית</option>
                        <option value="full">נגישות מלאה</option>
                    </select>
                </div>
                <div className="select-box">
                    <label className="select-header">רמת נקיון גבוהה</label>
                    <input
                        type="checkbox"
                        checked={cleanliness}
                        onChange={(e) => setCleanliness(e.target.checked)}
                        className="select-input"
                    />
                </div>
                <div className="select-box">
                    <label className="select-header">ממד</label>
                    <select value={mamad} onChange={(e) => setMamad(e.target.value)} className="select-input">
                        <option value="">בחר</option>
                        <option value="none">ללא מיגון</option>
                        <option value="partial">מיגון חלקי</option>
                        <option value="full">מיגון מלא</option>
                    </select>
                </div>
                <div className="select-box">
                    <label className="select-header">בלנית</label>
                    <select value={balanit} onChange={(e) => setBalanit(e.target.value)} className="select-input">
                        <option value="">בחר</option>
                        <option value="allowed">מותר לרחוץ לבד</option>
                        <option value="not-allowed">אסור לרחוץ לבד</option>
                    </select>
                </div>
            </div>
        </form>
    );
};

export default UserSearchForm;