import React from 'react';
import * as XLSX from 'xlsx';
import { FaFileDownload } from "react-icons/fa";

const AdminDownloadData = ({ allMikves }) => {
    const handleDownload = () => {
        const dataToExport = allMikves.map(mikve => ({
            ids: mikve.id,
            name: mikve.name,
            city: mikve.city,
            address: mikve.address,
            phone: mikve.phone,
            general_shelter: mikve.general_shelter,
            shelter: mikve.shelter,
            general_accessibility: mikve.general_accessibility,
            accessibility: mikve.accessibility,
            levad: mikve.levad,
            when_levad: mikve.when_levad,
            notes: mikve.notes,
            latitude: mikve.position?.latitude,
            longitude: mikve.position?.longitude,
            water_sampling: mikve.water_sampling,
            when_sampling: mikve.when_sampling
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'MikvesData');
        XLSX.writeFile(workbook, 'MikvesData.xlsx');
    };

    return (
        <div>
            <label>הורד קובץ נתוני מקוואות</label>
            <button onClick={handleDownload}>
                <FaFileDownload />
            </button>
        </div>
    );
};

export { AdminDownloadData };
