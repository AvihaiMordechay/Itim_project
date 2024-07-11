// LandingPage.js
import React, { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import UserMikvesList from './UserMikvesList';
import { Map } from './Map';
import { UserHeader } from './UserHeader';
import UserSearchForm from './UserSearchForm';
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { calculateDistance } from '../utils/distance';
import './LandingPage.css';

const libraries = ['places'];

const LandingPage = () => {
    let NUM_OF_MIKVES = 15;
    const [allMikves, setAllMikves] = useState([]);
    const [filteredMikves, setFilteredMikves] = useState([]);
    const [displayedMikves, setDisplayedMikves] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchLocation, setSearchLocation] = useState(null);
    const [displayCount, setDisplayCount] = useState(NUM_OF_MIKVES);
    const [isLoading, setIsLoading] = useState(true);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
        libraries,
    });

    useEffect(() => {
        const fetchMikves = async () => {
            try {
                const mikvesCollection = collection(db, "Mikves");
                const mikvesSnapshot = await getDocs(mikvesCollection);
                const mikvesList = mikvesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllMikves(mikvesList);
                return mikvesList;
            } catch (error) {
                console.error("Error fetching mikves:", error);
                return [];
            }
        };

        const getUserLocation = () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            resolve({ lat: latitude, lng: longitude });
                        },
                        (error) => {
                            console.error('Error getting location:', error);
                            resolve({ lat: 31.7683, lng: 35.2137 }); // Default to Jerusalem
                        }
                    );
                } else {
                    console.error('Geolocation is not supported by this browser.');
                    resolve({ lat: 31.7683, lng: 35.2137 }); // Default to Jerusalem
                }
            });
        };

        const initializeData = async () => {
            setIsLoading(true);
            const mikves = await fetchMikves();
            const location = await getUserLocation();
            setUserLocation(location);
            const sortedMikves = sortMikvesByDistance(mikves, location);
            setFilteredMikves(sortedMikves);
            setDisplayedMikves(sortedMikves.slice(0, NUM_OF_MIKVES));
            setIsLoading(false);
        };

        initializeData();
    }, []);

    const sortMikvesByDistance = (mikves, location) => {
        return mikves.map(mikve => ({
            ...mikve,
            distance: calculateDistance(location, {
                lat: mikve.position?.latitude || 0,
                lng: mikve.position?.longitude || 0
            })
        })).sort((a, b) => a.distance - b.distance);
    };

    useEffect(() => {
        setDisplayedMikves(filteredMikves.slice(0, displayCount));
    }, [filteredMikves, displayCount]);

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + NUM_OF_MIKVES);
    };

    const handleSearch = (searchTerm, location, searchType) => {
        console.log('handleSearch called with:', { searchTerm, location, searchType });
        
        const referenceLocation = location || userLocation || { lat: 31.7683, lng: 35.2137 };
        
        let filteredMikves;
        if (searchType === 'name') {
            filteredMikves = allMikves.filter(mikve => 
                mikve.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchLocation(null);
        } else {
            filteredMikves = allMikves;
            setSearchLocation(referenceLocation);
        }

        const sortedMikves = sortMikvesByDistance(filteredMikves, referenceLocation);
        setFilteredMikves(sortedMikves);
        setDisplayCount(NUM_OF_MIKVES); // Reset display count on new search
    };

    if (loadError) return <div>Error loading Google Maps API</div>;
    if (!isLoaded) return null;

    return (
        <div className="landing-page">
            <UserHeader />
            <div className="user-main-content">
                <UserSearchForm
                    setFilteredMikves={setFilteredMikves}
                    allMikves={allMikves}
                    userLocation={userLocation}
                    displayCount={displayCount}
                    onSearch={handleSearch}
                />
                <div className="map-and-list-container">
                    <h2 className="results-header">מקוואות שמצאנו עבורך</h2>
                    <div className="map-and-list">
                        <div className="map-wrapper">
                            <Map
                                mikves={displayedMikves}
                                userLocation={userLocation}
                                searchLocation={searchLocation}
                            />
                        </div>
                        <div className="list-wrapper">
                            <UserMikvesList 
                                mikves={displayedMikves} 
                                loadMore={loadMore} 
                                hasMore={displayedMikves.length < filteredMikves.length}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { LandingPage };