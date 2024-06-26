import React, { useEffect, useState } from 'react';
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import UserSearchForm from "./UserSearchForm"; // Importing the UserSearchForm component
import { calculateDistance } from '../utils/distance'; 
import { geocodeAddress } from '../utils/geocode'; 

const UserMikvesList = () => {
    const [mikves, setMikves] = useState([]);
    const [filteredMikves, setFilteredMikves] = useState([]);

    useEffect(() => {
        const fetchMikves = async () => {
            try {
                const mikvesCollection = collection(db, "Mikves");
                const mikvesSnapshot = await getDocs(mikvesCollection);
                const mikvesList = mikvesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMikves(mikvesList);
                setFilteredMikves(mikvesList); // Initialize filteredMikves with all mikves
            } catch (error) {
                console.error("Error fetching mikves:", error);
            }
        };

        fetchMikves();
    }, []);

    const handleFilteredMikves = (filteredMikves) => {
        setFilteredMikves(filteredMikves);
    };

    return (
        <div>
            <UserSearchForm setMikves={handleFilteredMikves} mikves={mikves} /> {/* Passing mikves as prop */}
            <div className="list">
                <h3>מקוואות קרובים אלייך</h3>
                {filteredMikves.map(mikve => (
                    <div key={mikve.id} className="mikve-item">
                        <p><strong>{mikve.name}</strong></p>
                        <p>{mikve.address}</p>
                        <p>{mikve.city}</p> {/* Added city field */}
                        <button onClick={() => console.log(`Show details for ${mikve.name}`)}>מידע נוסף</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserMikvesList;
