import './UserMikvesList.css';
import React from 'react';

const UserMikvesList = ({ mikves }) => {
    return (
        <div className="mikves-list-container">
            <h3 className="list-header">מקוואות שמצאנו עבורך</h3>
            <div className="list">
                {mikves.map(mikve => (
                    <div key={mikve.id} className="mikve-item">
                        <p><strong>{mikve.name}</strong></p>
                        <p>{mikve.address}</p>
                        <p>{mikve.city}</p>
                        <button onClick={() => console.log(`Show details for ${mikve.name}`)}>מידע נוסף</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserMikvesList;