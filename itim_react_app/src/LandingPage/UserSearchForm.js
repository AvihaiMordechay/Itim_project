import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/distance';
import geocodeAddress from '../utils/geocode';
import './UserSearchForm.css';

const UserSearchForm = ({ setFilteredMikves, allMikves }) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('address'); // 'address' or 'name'
    const [accessibility, setAccessibility] = useState('');
    const [waterSampling, setWaterSampling] = useState('');
    const [levad, setLevad] = useState('');
    const [shelter, setShelter] = useState('');
    const [userLocation, error] = useLocation();

    // הגדרת מספר התוצאות המקסימלי
    const MAX_RESULTS = 15;

    // פונקציה לסינון המקוואות
    const filterMikves = (mikves, searchLocation) => {
        const sortedMikves = mikves
            .filter(mikve => mikve.position && mikve.position.latitude && mikve.position.longitude)
            .map(mikve => ({
                ...mikve,
                distance: calculateDistance(searchLocation, { lat: mikve.position.latitude, lng: mikve.position.longitude })
            }))
            .sort((a, b) => a.distance - b.distance);
    
        const filteredMikves = sortedMikves.filter(mikve => {
            const nameMatches = searchType === 'name' ? mikve.name.toLowerCase().includes(searchInput.trim().toLowerCase()) : true;
            const addressMatches = searchType === 'address' ? 
                (mikve.address && mikve.address.toLowerCase().includes(searchInput.trim().toLowerCase())) || 
                (mikve.city && mikve.city.toLowerCase().includes(searchInput.trim().toLowerCase())) : 
                true;
            const accessibilityMatches = 
                accessibility === '' ||
                (accessibility === '0') ||
                (accessibility === '1' && mikve.accessibility === 'נגישות חלקית') ||
                (accessibility === '2' && mikve.accessibility === 'נגישות מלאה');
            const levadMatches = 
                levad === '' ||
                (levad === 'true' && mikve.levad === 'כן') ||
                (levad === 'false' && mikve.levad === 'לא');
            const shelterMatches = 
                shelter === '' ||
                (shelter === '0' && mikve.shelter === 'ללא מיגון') ||
                (shelter === '1' && mikve.shelter === 'מיגון חלקי') ||
                (shelter === '2' && mikve.shelter === 'מיגון מלא');
            const waterSamplingMatches = 
                waterSampling === '' || mikve.water_sampling === waterSampling;
    
            return (nameMatches || addressMatches) && accessibilityMatches && levadMatches && shelterMatches && waterSamplingMatches;
        });

        return filteredMikves.slice(0, MAX_RESULTS);
    }

    const handleSearch = async (e) => {
        e.preventDefault();
    
        const searchTerm = searchInput.trim().toLowerCase();
    
        let searchLocation;
        if (searchType === 'address') {
            searchLocation = await geocodeAddress(searchTerm);
            if (!searchLocation) {
                searchLocation = userLocation || { lat: 31.7683, lng: 35.2137 }; // Jerusalem coordinates
            }
        } else {
            searchLocation = userLocation || { lat: 31.7683, lng: 35.2137 }; // Jerusalem coordinates
        }
    
        const limitedFilteredMikves = filterMikves(allMikves, searchLocation);
        setFilteredMikves(limitedFilteredMikves);
    };

    const handleClear = () => {
        setSearchInput('');
        setSearchType('address');
        setAccessibility('');
        setWaterSampling('');
        setLevad('');
        setShelter('');
        if (userLocation) {
            const initialFilteredMikves = filterMikves(allMikves, userLocation);
            setFilteredMikves(initialFilteredMikves);
        }
    };

    // useEffect שמגביל את התוצאות שמוצגות בעת טעינת האתר
    useEffect(() => {
        if (userLocation) {
            const initialFilteredMikves = filterMikves(allMikves, userLocation);
            setFilteredMikves(initialFilteredMikves);
        }
    }, [userLocation, allMikves]);

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder={searchType === 'name' ? "שם המקווה" : "עיר או רחוב"}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="search-bar"
                />
                <div className="select-box">
                    <label className="select-header">סוג חיפוש</label>
                    <select 
                        value={searchType} 
                        onChange={(e) => setSearchType(e.target.value)} 
                        className="select-input"
                    >
                        <option value="address">חיפוש לפי כתובת</option>
                        <option value="name">חיפוש לפי שם</option>
                    </select>
                </div>
                <button type="submit" className="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M10 2a8 8 0 106.32 12.9l4.39 4.38a1 1 0 001.42-1.42l-4.38-4.39A8 8 0 0010 2zm0 2a6 6 0 11-4.24 10.24A6 6 0 0110 4z" />
                    </svg>
                </button>
                <button type="button" className="clear-button" onClick={handleClear}>
                    נקה
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
                    <select 
                        value={waterSampling} 
                        onChange={(e) => setWaterSampling(e.target.value)} 
                        className="select-input"
                    >
                        <option value="">בחר</option>
                        <option value="0">ללא בדיקה</option>
                        <option value="1">בדיקה לא תקינה</option>
                        <option value="2">בדיקה תקינה</option>
                    </select>
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
