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

const mapStyles = [
    {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#f0f0f0" }] // Light base color
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a1c5db" }] // Soft blue for water
    },
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#e8f0e8" }] // Very light green for landscape
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }] // White for roads
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#fde9d9" }] // Light peach for arterial roads
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#fcd2a6" }] // Darker peach for highways
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#d0e8d0" }] // Light green for points of interest
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#e5d5eb" }] // Light purple for transit
    },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9c9c9" }] // Light grey for administrative boundaries
    },
    {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#444444" }] // Dark grey for administrative labels
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#565656" }] // Darker grey for POI labels
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4a6b8b" }] // Dark blue for water labels
    }
];

const Map = ({ mikves, userLocation, searchLocation, searchType }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const mapCenter = defaultCenter;
    const mapZoom = 10;
    const mapKey = 0;
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const mapRef = useRef(null);

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const newCenter = searchLocation || userLocation || defaultCenter;
            mapRef.current.panTo(newCenter);
            mapRef.current.setZoom(14);
        }
    }, [userLocation, searchLocation, mikves, searchType]);


    useEffect(() => {
        if (isLoaded && mapRef.current) {
            window.google.maps.event.trigger(mapRef.current, 'resize');
        }
    }, [isLoaded]);

    const handleMarkerClick = (mikve) => {
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
        return (
            <div className="map-loading">
                <div className="loading-spinner"></div>
            </div>
        );
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
                    styles: mapStyles,
                }}
            >
                {mikves.map((mikve) => (
                    mikve.position ? (
                        <Marker
                            key={mikve.id}
                            position={{ lat: mikve.position.latitude, lng: mikve.position.longitude }}
                            onClick={() => handleMarkerClick(mikve)}
                        />
                    ) : null
                ))}
                {(searchLocation || userLocation) && searchType !== "name" && (
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
                <MikveDetailsPopup mikve={selectedMikve} onClose={handleCloseDetailsPopup} />
            )}
        </div>
    );
};

export { Map };