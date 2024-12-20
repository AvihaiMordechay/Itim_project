// UserSearchForm.js
import React, { useState, useEffect, useRef } from 'react';
import { calculateDistance } from '../utils/distance';
import './UserSearchForm.css';

const UserSearchForm = ({ setFilteredMikves, allMikves, userLocation, onSearch, onClear }) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('address');
    const [accessibility, setAccessibility] = useState('');
    const [waterSampling, setWaterSampling] = useState('');
    const [levad, setLevad] = useState('');
    const [shelter, setShelter] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showInstruction, setShowInstruction] = useState(false);
    const [placeSelected, setPlaceSelected] = useState(false);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    const popupRef = useRef(null);

    const positionAutocompletePopup = () => {
        const inputElement = inputRef.current;
        const popup = popupRef.current;
        if (inputElement && popup) {
            const rect = inputElement.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            popup.style.top = `${rect.top + scrollTop - popup.offsetHeight - 5}px`;
            popup.style.left = `${rect.left + scrollLeft}px`;
            popup.style.width = `${rect.width * 0.9}px`;
        }
    };

    useEffect(() => {
        if (searchType === 'address' && window.google && window.google.maps && window.google.maps.places) {
            if (!autocompleteRef.current) {
                autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ['geocode'],
                    componentRestrictions: { country: 'il' },
                    fields: ['address_components', 'geometry', 'name', 'formatted_address'],
                    strictBounds: false,
                });
                autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
            }
            inputRef.current.setAttribute('autocomplete', 'new-password');


        } else if (searchType === 'name') {
            if (autocompleteRef.current) {
                try {
                    if (window.google && window.google.maps && window.google.maps.event) {
                        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                    }
                    if (autocompleteRef.current.unbindAll) {
                        autocompleteRef.current.unbindAll();
                    }
                    if (inputRef.current && window.google && window.google.maps && window.google.maps.event) {
                        window.google.maps.event.clearInstanceListeners(inputRef.current);
                    }
                } catch (error) {
                    console.error('Error cleaning up Google Maps instance:', error);
                }
                autocompleteRef.current = null;
            }
            inputRef.current.setAttribute('autocomplete', 'off');
        }

        return () => {
            if (autocompleteRef.current) {
                try {
                    if (window.google && window.google.maps && window.google.maps.event) {
                        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                    }
                    if (autocompleteRef.current.unbindAll) {
                        autocompleteRef.current.unbindAll();
                    }
                    if (inputRef.current && window.google && window.google.maps && window.google.maps.event) {
                        window.google.maps.event.clearInstanceListeners(inputRef.current);
                    }
                } catch (error) {
                    console.error('Error cleaning up Google Maps instance:', error);
                }
                autocompleteRef.current = null;
            }
        };
    }, [searchType]);

    useEffect(() => {
        if (searchType === 'address') {
            if (searchInput === '' || placeSelected) {
                setShowInstruction(false);
            } else {
                setShowInstruction(true);
            }
        } else {
            setShowInstruction(false);
        }
    }, [searchInput, placeSelected, searchType]);

    const handlePlaceSelect = () => {
        if (autocompleteRef.current && searchType === 'address') {
            const addressObject = autocompleteRef.current.getPlace();
            if (addressObject && addressObject.formatted_address) {
                setSearchInput(addressObject.formatted_address);
                setShowInstruction(false);
                setPlaceSelected(true);
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (searchType === 'address') {
            setPlaceSelected(false);
            setShowInstruction(value.length > 0);
        } else {
            setShowInstruction(false);
        }
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchInput('');
        setShowInstruction(false);
        setPlaceSelected(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowInstruction(false);


        const searchTerm = searchInput.trim().toLowerCase();
        let searchLocation = userLocation;
        if (!searchTerm) {
            onClear();
        } else if (searchType === 'address') {
            try {
                if (autocompleteRef.current && autocompleteRef.current.getPlace()) {
                    const addressObject = autocompleteRef.current.getPlace();
                    if (addressObject && addressObject.geometry) {
                        searchLocation = {
                            lat: addressObject.geometry.location.lat(),
                            lng: addressObject.geometry.location.lng()
                        };
                    }
                } else {
                    const geocoder = new window.google.maps.Geocoder();
                    const result = await new Promise((resolve, reject) => {
                        geocoder.geocode({ address: searchTerm }, (results, status) => {
                            if (status === 'OK') {
                                resolve(results[0]);
                            } else {
                                reject(status);
                            }
                        });
                    });

                    searchLocation = {
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng()
                    };
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                setPopupMessage('לא הצלחנו למצוא את הכתובת. אנא נסי להכניס כתובת יותר מפורטת.');
                setShowPopup(true);
                return;
            }

            const filteredMikves = filterMikves(allMikves, searchTerm, searchType);
            handleFilteredMikves(filteredMikves, searchLocation);
            onSearch(searchTerm, searchLocation, searchType);
        } else if (searchType === 'name') {
            const filteredMikves = filterMikves(allMikves, searchTerm, searchType);
            if (filteredMikves.length > 0) {
                const mikveToShow = filteredMikves.find(mikve => mikve.position !== null);
                if (mikveToShow.position) {
                    searchLocation = {
                        lat: mikveToShow.position.latitude,
                        lng: mikveToShow.position.longitude
                    };
                }
                setFilteredMikves(filteredMikves);
            } else {
                if (filteredMikves.length === 0) {
                    setPopupMessage('לא הצלחנו למצוא מקוואות המתאימות לחיפוש שלך. אנא נסי שנית.');
                    setShowPopup(true);
                    return;
                }
            }
            onSearch(searchTerm, searchLocation, searchType);
        }
    };

    const filterMikves = (mikves, searchTerm, searchType) => {
        return mikves.filter(mikve => {
            const nameMatch = searchType === 'name' ? mikve.name.toLowerCase().includes(searchTerm) : true;
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

            return nameMatch && accessibilityMatches && waterSamplingMatches && levadMatches && shelterMatches;
        });
    };

    const handleFilteredMikves = (filteredMikves, location) => {
        if (filteredMikves.length === 0) {
            setPopupMessage('לא הצלחנו למצוא מקוואות המתאימות לחיפוש שלך. אנא נסי שנית.');
            setShowPopup(true);
            return;
        }
        const validLocation = location && typeof location.lat === 'number' && typeof location.lng === 'number'
            ? location
            : { lat: 31.7683, lng: 35.2137 };

        const mikvesWithDistances = filteredMikves.map(mikve => ({
            ...mikve,
            distance: calculateDistance(validLocation, {
                lat: mikve.position?.latitude || 0,
                lng: mikve.position?.longitude || 0
            })
        }));

        const sortedMikves = mikvesWithDistances.sort((a, b) => a.distance - b.distance);

        setFilteredMikves(sortedMikves);
    };


    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={searchType === 'name' ? "שם המקווה" : "עיר או רחוב"}
                            value={searchInput}
                            onChange={handleInputChange}
                            className="search-bar"
                        />
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M10 2a8 8 0 106.32 12.9l4.39 4.38a1 1 0 001.42-1.42l-4.38-4.39A8 8 0 0010 2zm0 2a6 6 0 11-4.24 10.24A6 6 0 0110 4z" />
                            </svg>
                        </button>
                    </div>
                    <div className="select-box">
                        <label className="select-header">סוג חיפוש</label>
                        <select
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            className="select-input"
                        >
                            <option value="address">חיפוש לפי כתובת</option>
                            <option value="name">חיפוש לפי שם</option>
                        </select>
                    </div>
                </div>
                <div className="advanced-search">
                    <h3 className="advanced-search-header">חיפוש מתקדם</h3>
                    <div className="filters">
                        <div className="two-filters">
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
                                    <option value="0">לא נבדק</option>
                                    <option value="1">נבדק ותקין</option>
                                    <option value="2">נבדק ולא תקין</option>
                                </select>
                            </div>
                        </div>
                        <div className="two-filters">
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
                    </div>
                </div>
            </form>
            {showInstruction && searchType === 'address' && !placeSelected && (
                <div ref={popupRef} className="autocomplete-popup">
                    אנא בחרי כתובת מהרשימה המוצעת
                </div>
            )}
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