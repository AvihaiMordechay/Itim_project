import React, { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/distance';
import geocodeAddress from '../utils/geocode';
import './UserSearchForm.css';

const UserSearchForm = ({ setFilteredMikves, allMikves }) => {
    const [cityStreet, setCityStreet] = useState('');
    const [name, setName] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [waterSampling, setWaterSampling] = useState(false);
    const [levad, setLevad] = useState('');
    const [shelter, setShelter] = useState('');
    const [userLocation, error] = useLocation();

    const handleSearch = async (e) => {
        e.preventDefault();
    
        const searchCityStreet = cityStreet.trim().toLowerCase();
        const searchName = name.trim().toLowerCase();
    
        let searchLocation;
        if (searchCityStreet) {
            searchLocation = await geocodeAddress(searchCityStreet);
            
        } else if (userLocation) {
            searchLocation = userLocation;
        } else {
            searchLocation = { lat: 31.7683, lng: 35.2137 }; // Jerusalem coordinates
        }
    
        const sortedMikves = allMikves
            .filter(mikve => mikve.position && mikve.position.latitude && mikve.position.longitude)
            .map(mikve => ({
                ...mikve,
                distance: calculateDistance(searchLocation, { lat: mikve.position.latitude, lng: mikve.position.longitude })
            }))
            .sort((a, b) => a.distance - b.distance);
    
        const filteredMikves = sortedMikves.filter(mikve => {
            const nameMatches = mikve.name.toLowerCase().includes(searchName);
            const accessibilityMatches = 
                accessibility === '' ||
                (accessibility === '0') ||
                (accessibility === '1' && Number(mikve.general_accessibility) >= 1) ||
                (accessibility === '2' && Number(mikve.general_accessibility) === 2);
            const levadMatches = 
                levad === '' ||
                (levad === 'true' && mikve.levad === true) ||
                (levad === 'false' && mikve.levad === false);
            const shelterMatches = 
                shelter === '' ||
                (shelter === '0') ||
                (shelter === '1' && Number(mikve.general_shelter) >= 1) ||
                (shelter === '2' && Number(mikve.general_shelter) === 2);
            const waterSamplingMatches = 
                !waterSampling || mikve.water_sampling === '2';
    
            return nameMatches && accessibilityMatches && levadMatches && shelterMatches && waterSamplingMatches;
        });
    
        setFilteredMikves(filteredMikves);
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
                        <option value="0">אין נגישות</option>
                        <option value="1">נגישות חלקית</option>
                        <option value="2">נגישות מלאה</option>
                    </select>
                </div>
                <div className="select-box">
                    <label className="select-header">בדיקת מים</label>
                    <input
                        type="checkbox"
                        checked={waterSampling}
                        onChange={(e) => setWaterSampling(e.target.checked)}
                        className="select-input"
                    />
                </div>
                <div className="select-box">
                    <label className="select-header">מיגון</label>
                    <select value={shelter} onChange={(e) => setShelter(e.target.value)} className="select-input">
                        <option value="">בחר</option>
                        <option value="0">ללא מיגון</option>
                        <option value="1">מיגון חלקי</option>
                        <option value="2">מיגון מלא</option>
                    </select>
                </div>
                <div className="select-box">
                    <label className="select-header">טבילה לבד</label>
                    <select value={levad} onChange={(e) => setLevad(e.target.value)} className="select-input">
                        <option value="">בחר</option>
                        <option value="true">מותר לרחוץ לבד</option>
                        <option value="false">אסור לרחוץ לבד</option>
                    </select>
                </div>
            </div>
        </form>
    );
};

export default UserSearchForm;