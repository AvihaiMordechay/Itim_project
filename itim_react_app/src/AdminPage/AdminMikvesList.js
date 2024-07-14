import "./AdminMikvesList.css"
import React, { useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { format } from 'date-fns';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const AdminMikvesList = ({ presentationMikves, handleEditMikve, visibleCount, setVisibleCount, numOfRows }) => {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + numOfRows);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    const sortedMikves = [...presentationMikves].sort((a, b) => {
        if (sortColumn) {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="admin-mikves-list">
            <table>
                <thead>
                    <tr>
                        <th className="sortable" onClick={() => handleSort('id')}>
                            ID {getSortIcon('id')}
                        </th>
                        <th className="sortable" onClick={() => handleSort('name')}>
                            שם המקווה {getSortIcon('name')}
                        </th>
                        <th className="sortable" onClick={() => handleSort('city')}>
                            עיר {getSortIcon('city')}
                        </th>
                        <th>כתובת</th>
                        <th>טלפון</th>
                        <th className="sortable" onClick={() => handleSort('water_sampling')}>
                            רמת תבאורה {getSortIcon('water_sampling')}
                        </th>
                        <th className="sortable" onClick={() => handleSort('when_sampling')}>
                            תאריך בדיקת תבאורה {getSortIcon('when_sampling')}
                        </th>
                        <th>עריכה</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMikves.slice(0, visibleCount).map((mikve) => (
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
                                <td>{mikve.when_sampling && mikve.when_sampling.length > 0 ? format(new Date(mikve.when_sampling), 'dd-MM-yyyy') : 'לא נבדק'}</td>
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