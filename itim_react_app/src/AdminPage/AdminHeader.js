// AdminHeader.js
import React from 'react';
import './AdminHeader.css';
import { AdminAddMikve } from "./AdminAddMikve";
import { AdminDownloadStatistics } from "./AdminDownloadStatistics";
import { AdminDownloadData } from "./AdminDownloadData";
import { AdminUploadSamplingXL } from "./AdminUploadSamplingXL";

const AdminHeader = ({ allMikves, setAllMikves, handleUploadSuccess }) => {
    return (
        <div className="admin-header">
            <h1>ניהול מקוואות</h1>
            <div className="admin-operations">
                <h3>פעולות:</h3>
                <AdminAddMikve />
                <AdminDownloadStatistics allMikves={allMikves} />
                <AdminDownloadData allMikves={allMikves} />
                <AdminUploadSamplingXL
                    allMikves={allMikves}
                    setAllMikves={setAllMikves}
                    onUploadSuccess={handleUploadSuccess}
                />
            </div>
        </div>
    );
};

export { AdminHeader };