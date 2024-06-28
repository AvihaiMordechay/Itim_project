import './LandingPage.css';
import { useState, useEffect } from 'react';
import UserMikvesList from './UserMikvesList';
import { Map } from './Map';
import { UserHeader } from './UserHeader';
import UserSearchForm from './UserSearchForm';
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

const LandingPage = () => {
    const [allMikves, setAllMikves] = useState([]);
    const [filteredMikves, setFilteredMikves] = useState([]);

    useEffect(() => {
        const fetchMikves = async () => {
            try {
                const mikvesCollection = collection(db, "Mikves");
                const mikvesSnapshot = await getDocs(mikvesCollection);
                const mikvesList = mikvesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllMikves(mikvesList);
                setFilteredMikves(mikvesList);
            } catch (error) {
                console.error("Error fetching mikves:", error);
            }
        };

        fetchMikves();
    }, []);

    return (
        <div className="landing-page">
            <UserHeader />
            <div className="user-main-content">
                <UserSearchForm setFilteredMikves={setFilteredMikves} allMikves={allMikves} />
                <div className="map-and-list">
                    <Map mikves={filteredMikves} />
                    <UserMikvesList mikves={filteredMikves} />
                </div>
            </div>
        </div>
    );
};

export { LandingPage };