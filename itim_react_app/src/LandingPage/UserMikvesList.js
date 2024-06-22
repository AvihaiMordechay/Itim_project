import React from 'react';

const UserMikvesList = ({ mikves }) => {
    return (
        <div className="list">
            <h3>מקוואות קרובים אלייך</h3>
            {mikves.map(mikve => (
                <div key={mikve.id} className="mikve-item">
                    <p><strong>{mikve.name}</strong></p>
                    <p>{mikve.address}</p>
                    <button onClick={() => console.log(`Show details for ${mikve.name}`)}>מידע נוסף</button>
                </div>
            ))}
        </div>
    );
};

export { UserMikvesList };