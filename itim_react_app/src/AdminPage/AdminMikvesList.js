import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AdminEditMikve } from "./AdminEditMikve";
import "./AdminMikvesList.css"

const AdminMikvesList = () => {
    const [mikves, setMikves] = useState([]);
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [isEditMikvePopupOpen, setIsEditMikvePopupOpen] = useState(false);

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

    const handleEdit = (id) => {
        const clickedMikve = mikves.find(mikve => mikve.id === id);
        setSelectedMikve(clickedMikve);
        setIsEditMikvePopupOpen(true); // Open edit popup
    };

    const handleCloseEdit = () => {
        setSelectedMikve(null);
        setIsEditMikvePopupOpen(false); // Close edit popup
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
                        <th>תאריך בדיקת השגחה</th>
                        <th>דגימת מים</th>
                        <th>תאריך בדיקת מים</th>
                        <th>עריכה</th>
                    </tr>
                </thead>
                <tbody>
                    {mikves.map((mikve) => (
                        <React.Fragment key={mikve.id}>
                            <tr>
                                <td>{mikve.id}</td>
                                <td>{mikve.accessibility}</td>
                                <td>{mikve.address}</td>
                                <td>{mikve.city}</td>
                                <td>{mikve.name}</td>
                                <td>{mikve.phone}</td>
                                <td>{mikve.position?.latitude}</td>
                                <td>{mikve.position?.longitude}</td>
                                <td>{mikve.shelter}</td>
                                <td>{mikve.supervision}</td>
                                <td>{mikve.supervisionDate}</td>
                                <td>{mikve.water_sampling}</td>
                                <td>{mikve.when_sampling}</td>
                                <td>
                                    <button onClick={() => handleEdit(mikve.id)}>עריכה</button>
                                </td> {/* Button to trigger edit */}
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {isEditMikvePopupOpen && (
                <AdminEditMikve mikve={selectedMikve} onClose={() => handleCloseEdit()} />
            )}
        </div>
    );
};

export { AdminMikvesList };
