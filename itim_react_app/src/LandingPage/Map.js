// Map.js
import './Map.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;

const defaultCenter = {
    lat: 31.7683,
    lng: 35.2137, // Jerusalem coordinates
};

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const Map = ({ mikves, userLocation, searchLocation }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const [selectedMikve, setSelectedMikve] = useState(null);
    const mapRef = useRef(null);

    const onLoad = useCallback(function callback(map) {
        console.log('Map loaded');
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const newCenter = searchLocation || userLocation || defaultCenter;
            console.log('Panning to:', newCenter);
            mapRef.current.panTo(newCenter);
            mapRef.current.setZoom(14);
        }
    }, [userLocation, searchLocation, mikves]);

    const handleMarkerClick = (mikve) => {
        console.log('Marker clicked:', mikve);
        setSelectedMikve(mikve);
    };

    const handleCloseInfoWindow = () => {
        setSelectedMikve(null);
    };

    if (loadError) {
        return <div className="map-error">Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div className="map-loading">Loading maps</div>;
    }
    return (
        <div className="map-container">
            <GoogleMap
                key={mapKey}
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onLoad}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {mikves.map((mikve) => (
                    <Marker
                        key={mikve.id}
                        position={{ lat: mikve.position.latitude, lng: mikve.position.longitude }}
                        onClick={() => handleMarkerClick(mikve)}
                    />
                ))}
                {(searchLocation || userLocation) && (
                    <Marker
                        position={searchLocation || userLocation}
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }}
                    />
                )}
                {selectedMikve && (
                    <InfoWindow
                        position={{ lat: selectedMikve.position.latitude, lng: selectedMikve.position.longitude }}
                        onCloseClick={handleCloseInfoWindow}
                    >
                        <div>
                            <h3>מקווה</h3>
                            <p>{selectedMikve.name}</p>
                            <p>{selectedMikve.address}</p>
                            <p>{selectedMikve.city}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export { Map };