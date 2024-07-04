// utils/distance.js

export const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lng - coord1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };