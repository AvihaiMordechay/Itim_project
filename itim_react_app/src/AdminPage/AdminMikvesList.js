import "./AdminMikvesList.css"
import React, { useState } from "react";

const AdminMikvesList = ({ presentationMikves, handleEditMikve }) => {
    const numOfRows = 20;
    const [visibleCount, setVisibleCount] = useState(numOfRows);
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
                        <th>רמת מיגון</th>
                        <th>רמת נגישות</th>
                        <th>השגחה</th>
                        <th>מצב תבאורה</th>
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
                                <td>{mikve.general_shelter}</td>
                                <td>{mikve.general_accessibility}</td>
                                <td>{mikve.levad}</td>
                                <td>{mikve.water_sampling}</td>
                                <td>{mikve.notes}</td>
                                <td>
                                    <button onClick={() => handleEditMikve(mikve)}>עריכה</button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {visibleCount < presentationMikves.length && (
                <button onClick={handleShowMore}>הצג עוד</button>
            )}
        </div>
    );
};

export { AdminMikvesList };
