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
import { set } from 'date-fns';

const libraries = ['places'];

const LandingPage = () => {
    let NUM_OF_MIKVES = 15;
    const [allMikves, setAllMikves] = useState([]);
    const [filteredMikves, setFilteredMikves] = useState([]);
    const [initMikves, setinitMikves] = useState([]);
    const [displayedMikves, setDisplayedMikves] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchType, setSearchType] = useState("null");
    const [searchLocation, setSearchLocation] = useState(null);
    const [displayCount, setDisplayCount] = useState(NUM_OF_MIKVES);

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
            const mikves = await fetchMikves();
            const location = await getUserLocation();
            setUserLocation(location);
            const sortedMikves = sortMikvesByDistance(mikves, location);
            setinitMikves(sortedMikves);
            setFilteredMikves(sortedMikves);
            setDisplayedMikves(sortedMikves.slice(0, NUM_OF_MIKVES));
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
    const onClear = () => {
        setFilteredMikves(initMikves);
        setDisplayedMikves(filteredMikves.slice(0, NUM_OF_MIKVES));
        setSearchLocation(null);
        setDisplayCount(NUM_OF_MIKVES); // Reset display count on new search

    }

    useEffect(() => {
        setDisplayedMikves(filteredMikves.slice(0, displayCount));
    }, [filteredMikves, displayCount]);

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + NUM_OF_MIKVES);
    };

    const handleSearch = (searchTerm, location, searchType) => {
        if (searchType === 'address') {
            setSearchType("address")
            const referenceLocation = location || userLocation || { lat: 31.7683, lng: 35.2137 };
            setSearchLocation(referenceLocation);
        } else if (searchType === 'name') {
            setSearchType("name");
            setSearchLocation(location || userLocation || { lat: 31.7683, lng: 35.2137 });
        }
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
                    onSearch={handleSearch}
                    onClear={onClear}
                />
                <div className="map-and-list-container">
                    <h2 className="results-header">מקוואות שמצאנו עבורך</h2>
                    <div className="map-and-list">
                        {isLoaded && (
                            <div className="map-wrapper">
                                <Map
                                    mikves={displayedMikves}
                                    userLocation={userLocation}
                                    searchLocation={searchLocation}
                                    searchType={searchType}
                                />
                            </div>
                        )}
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