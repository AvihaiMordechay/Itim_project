// Map.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import MikveDetailsPopup from './MikveDetailsPopup';
import './Map.css';

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

    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(10);
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
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

    const handleShowDetails = (mikve) => {
        setSelectedMikve(mikve);
        setShowDetailsPopup(true);
    };

    const handleCloseDetailsPopup = () => {
        setShowDetailsPopup(false);
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
                   <div className="marker-info-window">
                     <h3>מקווה</h3>
                     <p><strong>{selectedMikve.name}</strong></p>
                     <p>{selectedMikve.address}</p>
                     <p>{selectedMikve.city}</p>
                     <button onClick={() => handleShowDetails(selectedMikve)}>מידע נוסף</button>
                   </div>
                 </InfoWindow>
                )}
            </GoogleMap>
            
            {showDetailsPopup && selectedMikve && (
    <           MikveDetailsPopup mikve={selectedMikve} onClose={handleCloseDetailsPopup} />
            )}
        </div>
    );
};

export { Map };