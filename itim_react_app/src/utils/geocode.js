import axios from 'axios';

export const geocodeAddress = async (address) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
            address,
            key: process.env.REACT_APP_GOOGLE_MAPS_API,
        },
    });

    if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
    } else {
        throw new Error('Geocoding failed');
    }
};