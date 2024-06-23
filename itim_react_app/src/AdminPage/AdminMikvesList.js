import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AdminEditMikve } from "./AdminEditMikve";
import "./AdminMikvesList.css"

const AdminMikvesList = () => {
    const [mikves, setMikves] = useState([]);
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [isEditMikvePopupOpen, setIsEditMikvePopupOpen] = useState(false);

    const fetchMikves = async () => {
        const querySnapshot = await getDocs(collection(db, "Mikves"));
        const mikvesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setMikves(mikvesData);
    };

    useEffect(() => {
        fetchMikves();
    }, []);

    const handleEditMikve = (mikve) => {
        setSelectedMikve(mikve);
        setIsEditMikvePopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsEditMikvePopupOpen(false);
        setSelectedMikve(null);
    };

    const handleSaveMikve = (updatedMikve) => {
        setMikves((prevMikves) =>
            prevMikves.map((mikve) => (mikve.id === updatedMikve.id ? updatedMikve : mikve))
        );
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
                                    <button onClick={() => handleEditMikve(mikve)}>עריכה</button>
                                </td> {/* Button to trigger edit */}
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {isEditMikvePopupOpen && (
                <AdminEditMikve
                    mikve={selectedMikve}
                    onClose={handleClosePopup}
                    onSave={handleSaveMikve}
                />
            )}
        </div>
    );
};

export { AdminMikvesList };
