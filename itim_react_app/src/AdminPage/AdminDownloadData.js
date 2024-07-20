import React from 'react';
import * as XLSX from 'xlsx';

const AdminDownloadData = ({ allMikves }) => {

    // Converts the `allMikves` data into an Excel file using the `xlsx` library.
    // Maps the mikveh data into a structured format, creates a worksheet and workbook,
    // and initiates a download of the file named 'MikvesData.xlsx'.
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
            <button className="download-data-button" onClick={handleDownload}>
                הורד קובץ נתוני מקוואות
            </button>
        </div>
    );
};

export { AdminDownloadData };
