import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AdminEditMikve } from "./AdminEditMikve";
import { AdminMikveSearch } from "./AdminMikveSearch.js"
import { AdminMikvesList } from "./AdminMikvesList";
import { AdminAddMikve } from "./AdminAddMikve"

const AdminContent = () => {
    const [allMikves, setAllMikves] = useState([]);
    const [presentationMikves, setPresentationMikves] = useState([]);
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [isEditMikvePopupOpen, setIsEditMikvePopupOpen] = useState(false);

    const fetchMikves = async () => {
        const querySnapshot = await getDocs(collection(db, "Mikves"));
        const mikvesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setAllMikves(mikvesData);
        setPresentationMikves(allMikves);
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
        setAllMikves((prevMikves) =>
            prevMikves.map((mikve) => (mikve.id === updatedMikve.id ? updatedMikve : mikve))
        );
    };

    const handleDeleteMikve = (deletedMikveId) => {
        setAllMikves((prevMikves) => prevMikves.filter((mikve) => mikve.id !== deletedMikveId));
    };


    return (
        <div className="admin-main-content">
            <AdminAddMikve />
            <AdminMikvesList
                presentationMikves={allMikves}
                handleEditMikve={handleEditMikve}
            />
            {isEditMikvePopupOpen && (
                <AdminEditMikve
                    mikve={selectedMikve}
                    onClose={handleClosePopup}
                    onSave={handleSaveMikve}
                    onDelete={handleDeleteMikve}
                />
            )}
        </div >
    );
};

export { AdminContent };
