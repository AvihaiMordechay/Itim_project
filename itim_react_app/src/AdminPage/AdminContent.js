import './AdminContent.css';
import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AdminEditMikve } from "./AdminEditMikve";
import { AdminMikveSearch } from "./AdminMikveSearch.js"
import { AdminMikvesList } from "./AdminMikvesList";
import { AdminAddMikve } from "./AdminAddMikve"
import { AdminUploadSamplingXL } from "./AdminUploadSamplingXL"
import { AdminDownloadData } from "./AdminDownloadData.js"
const AdminContent = () => {
    const numOfRows = 20;
    const [allMikves, setAllMikves] = useState([]);
    const [presentationMikves, setPresentationMikves] = useState([]);
    const [selectedMikve, setSelectedMikve] = useState(null);
    const [isEditMikvePopupOpen, setIsEditMikvePopupOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(numOfRows);

    const fetchMikves = async () => {
        const querySnapshot = await getDocs(collection(db, "Mikves"));
        const mikvesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setAllMikves(mikvesData);
        setPresentationMikves(mikvesData);
    };

    useEffect(() => {
        fetchMikves();
    }, []);


    const handleEditMikvePopup = (updatedMikve) => {
        setSelectedMikve(updatedMikve);
        setIsEditMikvePopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsEditMikvePopupOpen(false);
        setSelectedMikve(null);
    };

    const handleEditSaveMikve = (updatedMikve) => {
        setAllMikves((prevMikves) =>
            prevMikves.map((mikve) => (mikve.id === updatedMikve.id ? updatedMikve : mikve))
        );
        setPresentationMikves((prevMikves) =>
            prevMikves.map((mikve) => (mikve.id === updatedMikve.id ? updatedMikve : mikve))
        );
    };

    const handleDeleteMikve = (deletedMikveId) => {
        setAllMikves((prevMikves) => prevMikves.filter((mikve) => mikve.id !== deletedMikveId));
        setPresentationMikves((prevMikves) => prevMikves.filter((mikve) => mikve.id !== deletedMikveId));
    };


    return (
        <div className="admin-main-content">
            <div className="admin-operations">
                <AdminAddMikve />
                <AdminDownloadData
                    allMikves={allMikves}
                />
                <AdminUploadSamplingXL />
                <AdminMikveSearch
                    allMikves={allMikves}
                    setPresentationMikves={setPresentationMikves}
                    setVisibleCount={setVisibleCount}
                    numOfRows={numOfRows}
                />
            </div>
            <AdminMikvesList
                presentationMikves={presentationMikves}
                handleEditMikve={handleEditMikvePopup}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                numOfRows={numOfRows}
            />
            {isEditMikvePopupOpen && (
                <AdminEditMikve
                    mikve={selectedMikve}
                    onClose={handleClosePopup}
                    onSave={handleEditSaveMikve}
                    onDelete={handleDeleteMikve}
                />
            )}
        </div >
    );
};

export { AdminContent };
