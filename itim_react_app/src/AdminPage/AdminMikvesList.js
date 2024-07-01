import "./AdminMikvesList.css"
import React from "react";
import { MdModeEdit } from "react-icons/md";
const AdminMikvesList = ({ presentationMikves, handleEditMikve, visibleCount, setVisibleCount, numOfRows }) => {
    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + numOfRows);
    };

    // Function to change 0/1/2 values to its respected strings
    const getWaterSamplingStatus = (value) => {
        switch (value) {
            case "0":
                return "לא נבדק";
            case "1":
                return "נבדק ותקין";
            case "2":
                return "נבדק ולא תקין";
            default:
                return "-";
        }
    };

    // Function to format a date to DD.MM.YYYY
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            // If date is invalid, return the original string
            return dateStr;
        }
        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="admin-mikves-list">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>שם המקווה</th>
                        <th>עיר</th>
                        <th>כתובת</th>
                        <th>טלפון</th>
                        <th>תברואה</th>
                        <th>תאריך בדיקת תברואה</th>
                        <th>הערות</th>
                        <th>עריכה</th>
                    </tr>
                </thead>
                <tbody>
                    {presentationMikves.slice(0, visibleCount).map((mikve) => (
                        <React.Fragment key={mikve.id}>
                            <tr>
                                <td>{mikve.id}</td>
                                <td>{mikve.name}</td>
                                <td>{mikve.city}</td>
                                <td>{mikve.address}</td>
                                <td>{mikve.phone}</td>
                                <td>{getWaterSamplingStatus(mikve.water_sampling)}</td>
                                <td>{formatDate(mikve.when_sampling)}</td>
                                <td>{mikve.notes}</td>
                                <td>
                                    <button className="admin-mikve-edit-button"
                                        onClick={() => handleEditMikve(mikve)}><MdModeEdit /></button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {visibleCount < presentationMikves.length && (
                <button
                    className="admin-mikve-show-more-button"
                    onClick={handleShowMore}
                >
                    הצג עוד
                </button>
            )}
        </div>
    );
};

export { AdminMikvesList };