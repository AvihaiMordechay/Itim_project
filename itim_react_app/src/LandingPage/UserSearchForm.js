import React, { useState } from 'react';
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLocation } from '../hooks/useLocation'; 
import { calculateDistance } from '../utils/distance'; 
import { geocodeAddress } from '../utils/geocode'; 

const UserSearchForm = ({ setMikves }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [accessibility, setAccessibility] = useState([]);
    const [cleanliness, setCleanliness] = useState('');
    const [hasBalanit, setHasBalanit] = useState(false);
    const [hasMamad, setHasMamad] = useState(false);
    const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
    const [location, error] = useLocation();

    const handleSearch = async (e) => {
        e.preventDefault();

        // Fetch mikveh data from Firestore
        const mikvesCollection = collection(db, "Mikves");
        const mikvesSnapshot = await getDocs(mikvesCollection);
        const mikvesList = mikvesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter mikveh list based on user criteria
        const filteredMikves = mikvesList.filter(mikve => {
            return (!accessibility.length || accessibility.includes(mikve.accessibility)) &&
                   (!cleanliness || mikve.cleanliness === cleanliness) &&
                   (!hasBalanit || mikve.hasBalanit) &&
                   (!hasMamad || mikve.hasMamad);
        });

        let sortedMikves = [];
        try {
            if (searchQuery) {
                // Geocode the address to get its latitude and longitude
                const geocodedLocation = await geocodeAddress(searchQuery);
                console.log("Geocoded location:", geocodedLocation);

                // Sort mikvehs based on distance from the geocoded location
                sortedMikves = filteredMikves.sort((a, b) => 
                    calculateDistance(geocodedLocation, a.position) - calculateDistance(geocodedLocation, b.position)
                );
            } else if (location) {
                console.log("User's location:", location);

                // Sort mikvehs based on distance from the user's location
                sortedMikves = filteredMikves.sort((a, b) => 
                    calculateDistance(location, a.position) - calculateDistance(location, b.position)
                );
            } else {
                console.warn("No location provided; displaying unsorted list.");
                sortedMikves = filteredMikves; // Fallback to unsorted if no location is available
            }
        } catch (error) {
            console.error("Error during geocoding or sorting:", error);
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
                    placeholder="כתובת / עיר / אזור"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <button type="submit" className="search-button">Search</button>
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
                                Option 1
                            </label>
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    value="option2"
                                    checked={accessibility.includes('option2')}
                                    onChange={() => handleAccessibilityChange('option2')}
                                />
                                Option 2
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

export { UserSearchForm };