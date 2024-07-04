import './Map.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const Map = ({ mikves, userLocation, searchLocation, children }) => {
    console.log('Map rendered');
    console.log('Children:', children);

    const [selectedMikve, setSelectedMikve] = useState(null);
    const mapRef = useRef(null);

    const forcedZoom = 14;

    const onLoad = useCallback(function callback(map) {
        console.log('Map loaded');
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const newCenter = searchLocation || userLocation || { lat: 31.7683, lng: 35.2137 };
            console.log('Panning to:', newCenter);
            mapRef.current.panTo(newCenter);
            mapRef.current.setZoom(forcedZoom);
        }
    }, [userLocation, searchLocation, mikves]);

    const handleMarkerClick = (mikve) => {
        console.log('Marker clicked:', mikve);
        setSelectedMikve(mikve);
    };

    const handleInfoWindowClose = () => {
        setSelectedMikve(null);
    };

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={searchLocation || userLocation || { lat: 31.7683, lng: 35.2137 }}
                zoom={forcedZoom}
                onLoad={onLoad}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {React.Children.map(children, child => {
                    console.log('Rendering child:', child);
                    return React.cloneElement(child, { onClick: () => handleMarkerClick(child.props.mikve) });
                })}
                {selectedMikve && (
                    <InfoWindow
                        position={{ lat: selectedMikve.position.latitude, lng: selectedMikve.position.longitude }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <div>
                            <h2>{selectedMikve.name}</h2>
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