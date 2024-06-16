import React, { useEffect, useState } from "react";
import "./AdminMikvesList.css";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminMikvesList = () => {
    const [mikves, setMikves] = useState([]);
    const [selectedMikveId, setSelectedMikveId] = useState(null);

    useEffect(() => {
        const fetchMikves = async () => {
            try {
                const mikvesCollection = collection(db, "Mikves");
                const mikvesSnapshot = await getDocs(mikvesCollection);
                const mikvesList = mikvesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMikves(mikvesList);
            } catch (error) {
                console.error("Error fetching mikves: ", error);
            }
        };

        fetchMikves();
    }, []);

    const handleRowClick = (id) => {
        setSelectedMikveId(id === selectedMikveId ? null : id);
    };

    const handleEdit = (id) => {
        // Add your edit logic here
        console.log(`Editing mikveh with id: ${id}`);
    };

    return (
        <div className="admin-mikves-list">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>נגישות</th>
                        <th>כתובת</th>
                        <th>עיר</th>
                        <th>שם המקווה</th>
                        <th>טלפון</th>
                        <th>קו רוחב</th>
                        <th>קו אורך</th>
                        <th>מיגון</th>
                        <th>השגחה</th>
                        <th>תאריך בדיקת השגחה </th>
                        <th>דגימת מים</th>
                        <th>תאריך בדיקת מים</th>
                    </tr>
                </thead>
                <tbody>
                    {mikves.map((mikve) => (
                        <tr key={mikve.id} onClick={() => handleRowClick(mikve.id)}>
                            <td>{mikve.id}</td>
                            <td>{mikve.accessibility}</td>
                            <td>{mikve.address}</td>
                            <td>{mikve.city}</td>
                            <td>{mikve.name}</td>
                            <td>{mikve.phone}</td>
                            <td>{mikve.latitude}</td>
                            <td>{mikve.longitude}</td>
                            <td>{mikve.shelter}</td>
                            <td>{mikve.supervision}</td>
                            <td>{mikve.supervisionDate}</td>
                            <td>{mikve.water_sampling}</td>
                            <td>{mikve.when_sampling}</td>
                            <td>
                                {selectedMikveId === mikve.id && (
                                    <button onClick={() => handleEdit(mikve.id)}>ערוך</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { AdminMikvesList };
