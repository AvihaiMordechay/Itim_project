// LandingPage.js
import './LandingPage.css';
import { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import UserMikvesList from './UserMikvesList';
import { Map } from './Map';  // Updated import
import { UserHeader } from './UserHeader';
import UserSearchForm from './UserSearchForm';
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { calculateDistance } from '../utils/distance';

const libraries = ['places'];


const LandingPage = () => {
    let NUM_OF_MIKVES = 15;
    const [allMikves, setAllMikves] = useState([]);
    const [filteredMikves, setFilteredMikves] = useState([]);
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
            sortAndFilterMikves(mikves, location);
            setIsLoading(false);
        };

        initializeData();
    }, []);

    const sortAndFilterMikves = (mikves, location) => {
        const mikvesWithDistances = mikves.map(mikve => ({
            ...mikve,
            distance: calculateDistance(location, {
                lat: mikve.position?.latitude || 0,
                lng: mikve.position?.longitude || 0
            })
        }));
        const sortedMikves = mikvesWithDistances.sort((a, b) => a.distance - b.distance);
        setFilteredMikves(sortedMikves.slice(0, displayCount));
    };

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + NUM_OF_MIKVES);
        setFilteredMikves(allMikves.slice(0, displayCount + NUM_OF_MIKVES));
    };

    const handleSearch = (searchTerm, location) => {
        setSearchLocation(location);
        sortAndFilterMikves(allMikves, location);
    };

    if (loadError) return <div>Error loading Google Maps API</div>;
    if (!isLoaded || isLoading) return <div>Loading...</div>;

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
                                mikves={filteredMikves}
                                userLocation={userLocation}
                                searchLocation={searchLocation}
                            />
                        </div>
                        <div className="list-wrapper">
                            <UserMikvesList mikves={filteredMikves} loadMore={loadMore} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { LandingPage };
