import axios from 'axios';

// Replace with your actual Google Maps Geocoding API key
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
/**
 * Function to get coordinates (latitude and longitude) for a given address
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number}>} - A promise that resolves to an object containing latitude and longitude
 */
async function getCoordinates(address) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: API_KEY,
            },
        });

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        return null;
    }
}

export { getCoordinates };
