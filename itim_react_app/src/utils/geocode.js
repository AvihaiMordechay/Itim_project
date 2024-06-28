// utils/geocode.js
const geocodeAddress = async (address) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API}`);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            console.error('Geocode was not successful for the following reason:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Error during geocoding:', error);
        return null;
    }
};

export default geocodeAddress;