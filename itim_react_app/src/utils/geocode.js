import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/distance';
import { geocodeAddress } from '../utils/geocode';
import { getCoordinates } from '../GetCoordinates'; // Importing getCoordinates function from project directory

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;

const UserSearchForm = ({ setMikves, mikves }) => {
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [name, setName] = useState('');
    const [accessibility, setAccessibility] = useState([]);
    const [cleanliness, setCleanliness] = useState('');
    const [hasBalanit, setHasBalanit] = useState(false);
    const [hasMamad, setHasMamad] = useState(false);
    const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const { location, error: locationError } = useLocation();

    useEffect(() => {
        if (location) {
            setUserLocation(location);
        }
        if (locationError) {
            setError(locationError);
        }
    }, [location, locationError]);

    const handleSearch = async (e) => {
        e.preventDefault();

        const searchCity = city.trim().toLowerCase();
        const searchStreet = street.trim().toLowerCase();

        const filteredMikves = mikves.filter(mikve => {
            const mikveAddress = mikve.address;

            const cityMatches = mikve.city.toLowerCase().includes(searchCity);
            const streetMatches = searchCity && mikveAddress.toLowerCase().includes(searchStreet);
            const nameMatches = mikve.name.toLowerCase().includes(name.toLowerCase());

            return (!accessibility.length || accessibility.includes(mikve.accessibility)) &&
                (!cleanliness || mikve.cleanliness === cleanliness) &&
                (!hasBalanit || mikve.hasBalanit) &&
                (!hasMamad || mikve.hasMamad) &&
                (name === '' || nameMatches) &&
                (city === '' || cityMatches) &&
                (street === '' || streetMatches);
        });

        let sortedMikves = [];
        try {
            if (searchCity && searchStreet && userLocation) {
                // Geocode user entered street to get its coordinates
                const userStreetCoordinates = await getCoordinates(`${street}, ${searchCity}`);

                if (userStreetCoordinates) {
                    const userStreetLocation = {
                        lat: userStreetCoordinates.lat,
                        lng: userStreetCoordinates.lng
                    };

                    // Calculate distances from user entered street location to each mikve in the city
                    const mikveDistances = filteredMikves.map(mikve => ({
                        ...mikve,
                        distance: calculateDistance(userStreetLocation, mikve.position)
                    }));

                    // Sort mikvehs based on distance from the user entered street location
                    sortedMikves = mikveDistances.sort((a, b) => a.distance - b.distance);
                } else {
                    console.warn("Unable to geocode user entered street.");
                    sortedMikves = filteredMikves; // Fallback to unsorted if geocoding fails
                }
            } else {
                console.warn("Missing required inputs for sorting by distance.");
                sortedMikves = filteredMikves; // Fallback to unsorted if missing inputs
            }
        } catch (error) {
            console.error("Error during sorting:", error);
            sortedMikves = filteredMikves; // Fallback to unsorted if an error occurs
        }

        console.log("Sorted mikvehs:", sortedMikves);
        setMikves(sortedMikves);
    };

    const toggleAccessibility = () => {
        setIsAccessibilityOpen(!isAccessibilityOpen);
    };

    const handleAccessibilityChange = (option) => {
        setAccessibility((prevAccessibility) => {
            if (prevAccessibility.includes(option)) {
                return prevAccessibility.filter((item) => item !== option);
            } else {
                return [...prevAccessibility, option];
            }
        });
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="עיר"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-bar"
                />
                <input
                    type="text"
                    placeholder="רחוב"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="search-bar"
                />
                <input
                    type="text"
                    placeholder="שם המקווה"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="search-bar"
                />
                <button type="submit" className="search-button">חיפוש</button>
            </div>
            <div className="filters">
                <div className="select-box accessibility-select">
                    <div className="select-header" onClick={toggleAccessibility}>
                        נגישות
                    </div>
                    {isAccessibilityOpen && (
                        <div className="select-options">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    value="option1"
                                    checked={accessibility.includes('option1')}
                                    onChange={() => handleAccessibilityChange('option1')}
                                />
                                אופציה 1
                            </label>
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    value="option2"
                                    checked={accessibility.includes('option2')}
                                    onChange={() => handleAccessibilityChange('option2')}
                                />
                                אופציה 2
                            </label>
                        </div>
                    )}
                </div>
                <select
                    value={cleanliness}
                    onChange={(e) => setCleanliness(e.target.value)}
                    className="select-box"
                >
                    <option value="">רמת ניקיון</option>
                </select>
                <label className="checkbox-container">
                    בלענית
                    <input
                        type="checkbox"
                        checked={hasBalanit}
                        onChange={(e) => setHasBalanit(e.target.checked)}
                    />
                </label>
                <label className="checkbox-container">
                    ממ"ד
                    <input
                        type="checkbox"
                        checked={hasMamad}
                        onChange={(e) => setHasMamad(e.target.checked)}
                    />
                </label>
            </div>
        </form>
    );
};

export default UserSearchForm;
