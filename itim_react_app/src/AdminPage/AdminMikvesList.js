import "./AdminMikvesList.css"
import React from "react";
import { MdModeEdit } from "react-icons/md";
const AdminMikvesList = ({ presentationMikves, handleEditMikve, visibleCount, setVisibleCount, numOfRows }) => {
    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + numOfRows);
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