import './Map.css';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;

const defaultCenter = {
    lat: 31.7683,
    lng: 35.2137, // Jerusalem coordinates
};

const Map = ({ mikves }) => {
    const [location, setLocation] = useState(null);
    const [isLocationError, setIsLocationError] = useState(false);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(10);
    const [mapKey, setMapKey] = useState(0); // unique key to force re-render
    const [selectedMikve, setSelectedMikve] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ lat: latitude, lng: longitude });
                        setMapCenter({ lat: latitude, lng: longitude });
                        setMapZoom(15);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        setIsLocationError(true);
                        setLocation(defaultCenter);
                        setMapCenter(defaultCenter);
                        setMapZoom(10);
                    },
                    { timeout: 10000 } // Optional: Add timeout to handle cases where location fetching takes too long
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                setIsLocationError(true);
                setLocation(defaultCenter);
                setMapCenter(defaultCenter);
                setMapZoom(10);
            }
        };

        getLocation();
    }, []);

    const handleResetMap = () => {
        if (location) {
            setMapCenter(location);
            setMapZoom(15);
        } else {
            setMapCenter(defaultCenter);
            setMapZoom(10);
        }
        setMapKey((prevKey) => prevKey + 1); // increment key to force re-render
    };

    const handleMarkerClick = (mikve) => {
        setSelectedMikve(mikve);
    };

    const handleCloseInfoWindow = () => {
        setSelectedMikve(null);
    };

    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    key={mapKey} // use unique key to force re-render
                    ref={mapRef}
                    mapContainerClassName="map"
                    center={mapCenter}
                    zoom={mapZoom}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                    }}
                >
                    {mikves.map(mikve => (
                        <Marker
                            key={mikve.id}
                            position={{ lat: mikve.position.latitude, lng: mikve.position.longitude }}
                            onClick={() => handleMarkerClick(mikve)}
                        />
                    ))}
                    {location && <Marker position={location} />}
                    {selectedMikve && (
                        <InfoWindow
                            position={{ lat: selectedMikve.position.latitude, lng: selectedMikve.position.longitude }}
                            onCloseClick={handleCloseInfoWindow}
                        >
                            <div>
                                <h3>כותרת מקווה</h3>
                                <p>{selectedMikve.name}</p>
                                <p>{selectedMikve.address}</p>
                                <p>{selectedMikve.city}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            {isLocationError && (
                <div className="location-error-message">
                    Unable to fetch location. Showing default location (Jerusalem).
                </div>
            )}
            <button className="reset-map-button" onClick={handleResetMap}>
                איפוס המפה
            </button>
        </div>
    );
};

export { Map };
