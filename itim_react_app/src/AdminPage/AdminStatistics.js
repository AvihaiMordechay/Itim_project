import { useState } from "react";

const AdminStatistics = ({ allMikves }) => {
    const [showModal, setShowModal] = useState(false);

    const handleVisitsDistribution = () => {
        // Implement the functionality for visits distribution
    };

    const handleShelterDistribution = () => {
        // Implement the functionality for shelter distribution
    };

    const handleLevadDistribution = () => {
        // Implement the functionality for levad distribution
    };

    const handleWaterSamplingDistribution = () => {
        // Implement the functionality for water sampling distribution
    };

    const handleAccessibilityDistribution = () => {
        // Implement the functionality for accessibility distribution
    };

    return (
        <div className="admin-statistics-content">
            <button type="submit" className="open-statistics-botton" onClick={() => setShowModal(true)}>הצג סטטיסטיקות</button>
            {showModal && (
                <div className="statistics-modal">
                    <h3>התפלגויות</h3>
                    <button type="submit" className="distribution-visits-button" onClick={handleVisitsDistribution}>מספר כניסות</button>
                    <button type="submit" className="distribution-shelter-button" onClick={handleShelterDistribution}>מיגון</button>
                    <button type="submit" className="distribution-levad-button" onClick={handleLevadDistribution}>השגחה</button>
                    <button type="submit" className="distribution-water-sampling-button" onClick={handleWaterSamplingDistribution}>תברואה</button>
                    <button type="submit" className="distribution-accessibility-button" onClick={handleAccessibilityDistribution}>נגישות</button>
                    <button type="submit" className="close-statistics-button" onClick={() => setShowModal(false)}>סגור</button>
                </div>
            )}
        </div>
    );
}

export { AdminStatistics };
