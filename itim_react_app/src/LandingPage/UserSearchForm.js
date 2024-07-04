import React, { useState, useEffect, useRef } from 'react';
import { calculateDistance } from '../utils/distance';
import './UserSearchForm.css';

const UserSearchForm = ({ setFilteredMikves, allMikves, userLocation, displayCount, onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('address');
    const [accessibility, setAccessibility] = useState('');
    const [waterSampling, setWaterSampling] = useState('');
    const [levad, setLevad] = useState('');
    const [shelter, setShelter] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places && !autocompleteRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode'],
            });
            autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
        }
    }, []);

    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const addressObject = autocompleteRef.current.getPlace();
            if (addressObject && addressObject.formatted_address) {
                setSearchInput(addressObject.formatted_address);
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
    
        const searchTerm = searchInput.trim().toLowerCase();
    
        let searchLocation = userLocation;
        
        if (searchType === 'address' && searchTerm) {
            if (autocompleteRef.current) {
                const addressObject = autocompleteRef.current.getPlace();
                if (addressObject && addressObject.geometry) {
                    searchLocation = {
                        lat: addressObject.geometry.location.lat(),
                        lng: addressObject.geometry.location.lng()
                    };
                } else {
                    setPopupMessage('לא הצלחנו למצוא את הכתובת. אנא נסי להכניס כתובת יותר מפורטת.');
                    setShowPopup(true);
                    return;
                }
            } else {
                setPopupMessage('מערכת החיפוש לא זמינה כרגע. אנא נסי שוב מאוחר יותר.');
                setShowPopup(true);
                return;
            }
        }
    
        const filteredMikves = allMikves.filter(mikve => {
            const nameMatches = searchType === 'name' 
                ? mikve.name.toLowerCase().includes(searchTerm) 
                : true;
            
            const accessibilityMatches = 
                accessibility === '' ||
                (accessibility === '0' && mikve.general_accessibility === '0') ||
                (accessibility === '1' && ['1', '2'].includes(mikve.general_accessibility)) ||
                (accessibility === '2' && mikve.general_accessibility === '2');
            
            const waterSamplingMatches = waterSampling === '' || mikve.water_sampling === waterSampling;
            const levadMatches = levad === '' || mikve.levad.toString() === levad;
            const shelterMatches = 
                shelter === '' ||
                (shelter === '0' && mikve.general_shelter === '0') ||
                (shelter === '1' && ['1', '2'].includes(mikve.general_shelter)) ||
                (shelter === '2' && mikve.general_shelter === '2');

            return nameMatches && accessibilityMatches && waterSamplingMatches && levadMatches && shelterMatches;
        });

        if (filteredMikves.length === 0 && searchType === 'name') {
            setPopupMessage('לא הצלחנו למצוא מקוואות המתאימות לשם זה. אנא נסי שנית או חפשי לפי כתובת.');
            setShowPopup(true);
            return;
        }
    
        const mikvesWithDistances = filteredMikves.map(mikve => ({
            ...mikve,
            distance: calculateDistance(searchLocation, { 
                lat: mikve.position?.latitude || 0, 
                lng: mikve.position?.longitude || 0 
            })
        }));
    
        const sortedMikves = mikvesWithDistances.sort((a, b) => a.distance - b.distance);
    
        setFilteredMikves(sortedMikves.slice(0, displayCount));
        onSearch(searchTerm, searchLocation);
    };

    const closePopup = () => {
        setShowPopup(false);
    };


    return (
        <>
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-bar-container">
                    <input
                        ref={inputRef}
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

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>{popupMessage}</p>
                        <button onClick={closePopup}>סגור</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserSearchForm;