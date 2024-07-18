// AdminHeader.js
import React from 'react';
import './AdminHeader.css';
import { AdminAddMikve } from "./AdminAddMikve";
import { AdminDownloadData } from "./AdminDownloadData";
import { AdminUploadSamplingXL } from "./AdminUploadSamplingXL";
import { AdminStatistics } from './AdminStatistics';
import useAuth from '../Authentication/AdminAuth';


const AdminHeader = ({ allMikves, setAllMikves, handleUploadSuccess }) => {
    const { logout } = useAuth();

    return (
        <div className="admin-header">
            <h1>ניהול מקוואות</h1>
            <div className="admin-operations">
                <h3>פעולות:</h3>
                <div className="operations-button">
                    <AdminAddMikve />
                </div>
                <div className="operations-button">
                    <AdminDownloadData allMikves={allMikves} />
                </div>
                <div className="operations-button">
                    <AdminUploadSamplingXL
                        allMikves={allMikves}
                        setAllMikves={setAllMikves}
                        onUploadSuccess={handleUploadSuccess}
                    />
                </div>
                <div className="operations-button">
                    <AdminStatistics allMikves={allMikves} />
                </div>
            </div>
            <button className="logout-button" onClick={logout}>התנתק</button>
        </div>
    );
};

export { AdminHeader };