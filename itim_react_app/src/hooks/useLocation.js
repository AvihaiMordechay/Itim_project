import { useState, useEffect } from 'react';

export const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    setError(error);
                }
            );
        } else {
            setError(new Error('Geolocation not supported'));
        }
    }, []);

    return [location, error];
};