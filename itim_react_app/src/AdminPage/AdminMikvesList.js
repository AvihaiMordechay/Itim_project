import "./AdminMikvesList.css"
import React from "react";

const AdminMikvesList = ({ presentationMikves, handleEditMikve }) => {
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
                    {presentationMikves.map((mikve) => (
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
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { AdminMikvesList };
