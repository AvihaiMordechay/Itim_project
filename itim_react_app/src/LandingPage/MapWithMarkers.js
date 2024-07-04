import React from 'react';
import { Map } from './Map';
import { Marker } from '@react-google-maps/api';

const MapWithMarkers = ({ mikves, userLocation, searchLocation }) => {
    console.log('MapWithMarkers rendered');
    console.log('Mikves:', mikves);
    console.log('User Location:', userLocation);
    console.log('Search Location:', searchLocation);

    return (
        <Map 
            mikves={mikves} 
            userLocation={userLocation} 
            searchLocation={searchLocation}
        >
            {mikves.map((mikve) => {
                console.log('Rendering marker for mikve:', mikve);
                return (
                    <Marker
                        key={mikve.id}
                        position={{ lat: mikve.position.latitude, lng: mikve.position.longitude }}
                        title={mikve.name}
                    />
                );
            })}
            {(searchLocation || userLocation) && (
                <Marker
                    position={searchLocation || userLocation}
                    icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                />
            )}
        </Map>
    );
};

export default MapWithMarkers;