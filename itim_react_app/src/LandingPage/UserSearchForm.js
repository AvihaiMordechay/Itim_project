// UserSearchForm.js
import React, { useState, useEffect, useRef } from 'react';
import { FaQuestionCircle } from 'react-icons/fa'; // Import question icon from react-icons
import { IoMdClose } from 'react-icons/io'; // Import close icon from react-icons
import { calculateDistance } from '../utils/distance';
import './UserSearchForm.css';

/**
 * UserSearchForm Component
 * 
 * This component provides a search interface for users to find mikves based on various criteria.
 * It includes a main search bar, search type selector, and advanced search options.
 * 
 * @param {function} setFilteredMikves - Function to update the filtered mikves list
 * @param {array} allMikves - Array of all mikves in the system
 * @param {object} userLocation - User's current location
 * @param {function} onSearch - Function to handle search submission
 * @param {function} onClear - Function to clear the search
 */

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
    const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);
    const [showWaterSamplingInfo, setShowWaterSamplingInfo] = useState(false);
    const [showShelterInfo, setShowShelterInfo] = useState(false);
    const [showLevadInfo, setShowLevadInfo] = useState(false);
    const [activeInfoPopup, setActiveInfoPopup] = useState(null);

    // Refs for DOM elements
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const popupRef = useRef(null);

    /**
     * Handles the click on info icons, toggling the visibility of info popups
     * @param {string} popupName - Name of the popup to toggle
     */
    const handleInfoClick = (popupName) => {
        setActiveInfoPopup(activeInfoPopup === popupName ? null : popupName);
    };

    // Effect for setting up Google Maps Autocomplete
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

    // Effect for showing/hiding autocomplete instruction
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


    /**
     * Handles the selection of a place from Google Maps Autocomplete
     * shows limited info about the mikveh on the map 
     */

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

    /**
     * Handles changes to the search input field
     * @param {Event} e - Input change event
     */
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

    /**
     * Handles changes to the search type (address or name)
     * @param {Event} e - Select change event
     */
    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchInput('');
        setShowInstruction(false);
        setPlaceSelected(false);
    };

    /**
     * Handles the search form submission
     * @param {Event} e - Form submit event
     */
    const handleSearch = async (e) => {
        e.preventDefault();
        setShowInstruction(false);


    const searchTerm = searchInput.trim().toLowerCase();
    let searchLocation = userLocation;

    // Always filter mikvehs based on the current filters, regardless of search term
    const filteredMikves = filterMikves(allMikves, searchTerm, searchType);

    if (filteredMikves.length === 0) {
        setPopupMessage('לא הצלחנו למצוא מקוואות המתאימות לחיפוש שלך. אנא נסי שנית.');
        setShowPopup(true);
        return;
    }

    if (searchType === 'address' && searchTerm) {
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
            
        } else if (searchType === 'name' && searchTerm) {
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
        }

        handleFilteredMikves(filteredMikves, searchLocation);
    onSearch(searchTerm, searchLocation, searchType);
    };

    /**
     * Filters mikves based on search criteria
     * @param {array} mikves - Array of mikves to filter
     * @param {string} searchTerm - Search term entered by the user
     * @param {string} searchType - Type of search (address or name)
     * @returns {array} Filtered array of mikves
     */

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

    /**
     * Handles the filtered mikves, sorts them by distance, and updates state
     * @param {array} filteredMikves - Array of filtered mikves
     * @param {object} location - Location to calculate distances from
     */

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

    /**
     * Closes the error popup
     */

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                    {showInstruction && searchType === 'address' && !placeSelected && (
                <div ref={popupRef} className="autocomplete-popup">
                    אנא בחרי כתובת מהרשימה המוצעת
                </div>
            )}
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={searchType === 'name' ? "שם המקווה" : "עיר או רחוב"}
                            value={searchInput}
                            onChange={handleInputChange}
                            className={`search-bar ${searchType === 'name' ? 'search-by-name' : ''}`}
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
                <label className="select-header">
                    נגישות פיזית
                    <FaQuestionCircle 
                        className="info-icon" 
                        onClick={() => handleInfoClick('accessibility')}
                    />
                </label>
                <select value={accessibility} onChange={(e) => setAccessibility(e.target.value)} className="select-input">
                    <option value="">בחר</option>
                    <option value="0">לא נגיש</option>
                    <option value="1">נגישות חלקית</option>
                    <option value="2">נגישות מלאה</option>
                </select>
                {activeInfoPopup === 'accessibility' && (
                    <div className="info-popup">
                        <p>בהתאם למידע שנמסר לנו על ידי הרשויות המקומיות והמועצות הדתיות.</p>
                        <button onClick={() => setActiveInfoPopup(null)}>
                            <IoMdClose />
                        </button>
                    </div>
                )}
            </div>
            <div className="select-box">
                <label className="select-header">
                    תברואה 
                    <FaQuestionCircle 
                        className="info-icon" 
                        onClick={() => handleInfoClick('waterSampling')}
                    />
                </label>
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
                {activeInfoPopup === 'waterSampling' && (
                    <div className="info-popup">
                        <p>בהתאם לנהלי משרד הבריאות, בכל מקווה צריכה להתבצע בדיקת זיהומים במים פעם בחודש. המידע המופיע כאן הוא בהתאם לבדיקה האחרונה שנעשתה.</p>
                        <button onClick={() => setActiveInfoPopup(null)}>
                            <IoMdClose />
                        </button>
                    </div>
                )}
            </div>
        </div>
        <div className="two-filters">
            <div className="select-box">
                <label className="select-header">
                    מיגון
                    <FaQuestionCircle 
                        className="info-icon" 
                        onClick={() => handleInfoClick('shelter')}
                    />
                </label>
                <select value={shelter} onChange={(e) => setShelter(e.target.value)} className="select-input">
                    <option value="">בחר</option>
                    <option value="0">ללא מיגון</option>
                    <option value="1">מיגון חלקי</option>
                    <option value="2">מיגון מלא</option>
                </select>
                {activeInfoPopup === 'shelter' && (
                    <div className="info-popup">
                        <p>בהתאם למידע שנמסר לנו על ידי המשרד לשירותי דת.</p>
                        <button onClick={() => setActiveInfoPopup(null)}>
                            <IoMdClose />
                        </button>
                    </div>
                )}
            </div>
            <div className="select-box">
                <label className="select-header">
                    טבילה לבד
                    <FaQuestionCircle 
                        className="info-icon" 
                        onClick={() => handleInfoClick('levad')}
                    />
                </label>
                <select value={levad} onChange={(e) => setLevad(e.target.value)} className="select-input">
                    <option value="">בחר</option>
                    <option value="true">ניתן לטבול לבד</option>
                    <option value="false">לא ניתן לטבול לבד</option>
                </select>
                {activeInfoPopup === 'levad' && (
                    <div className="info-popup">
                        <p>בהתאם לפסיקת בג"ץ ולחוזר מנכ"ל כל אישה שמעוניינת בכך רשאית לטבול לבד ללא נוכחות בלנית. בשנים האחרונות בדקנו האם המקוואות מקיימים פסיקה זו ובאמת מאפשרים זאת.</p>
                        <button onClick={() => setActiveInfoPopup(null)}>
                            <IoMdClose />
                        </button>
                    </div>
                )}
            </div>
        </div>
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