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
                        <th>רמת תבאורה</th>
                        <th>תאריך בדיקת תבאורה</th>
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
                                <td>
                                    {mikve.water_sampling === "0" && "לא נבדק"}
                                    {mikve.water_sampling === "1" && "נבדק ותקין"}
                                    {mikve.water_sampling === "2" && "נבדק ולא תקין"}
                                </td>
                                <td>{mikve.when_sampling.length > 0 && mikve.when_sampling}</td>
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
                <div>
                    <label className="total-presentation-mikves">סה״כ: {visibleCount} </label>
                    <button
                        className="admin-mikve-show-more-button"
                        onClick={handleShowMore}
                    >
                        הצג עוד
                    </button>
                </div>

            )}
            {visibleCount >= presentationMikves.length && (
                <label className="total-presentation-mikves">סה״כ: {presentationMikves.length} </label>
            )}
        </div>
    );
};

export { AdminMikvesList };