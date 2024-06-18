import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

//const GOOGLE_MAPS_API_KEY // replace with your actual API key

const defaultCenter = {
    lat: 31.7683,
    lng: 35.2137, // Jerusalem coordinates
};

const Map = () => {
    const [location, setLocation] = useState(null);
    const [isLocationError, setIsLocationError] = useState(false);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(10);
    const [mapKey, setMapKey] = useState(0); // unique key to force re-render
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
                    {location && <Marker position={location} />}
                </GoogleMap>
            </LoadScript>
            {isLocationError && (
                <div className="location-error-message">
                    Unable to fetch location. Showing default location (Jerusalem).
                </div>
            )}
            <button className="reset-map-button" onClick={handleResetMap}>
                Reset Map
            </button>
        </div>
    );
};

export { Map };
