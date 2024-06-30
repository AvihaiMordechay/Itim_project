import "./AdminUploadSamplingXL.css";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { MdOutlineFileUpload } from "react-icons/md";

const AdminUploadSamplingXL = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [mikveUploadPopup, setMikveUploadPopup] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
        setMikveUploadPopup(true);
    };

    const handleCancelUploadPopup = () => {
        setFile(null);
        setFileName('');
        setMikveUploadPopup(false);
        const inputElement = document.getElementById('input-xl-file');
        inputElement.value = ''; // Reset the input value
    };

    const handleFileUpload = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            console.log(jsonData);
            handleCancelUploadPopup();
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="admin-upload-xl">
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                id="input-xl-file"
            />
            <button
                type="button"
                className="mikve-upload-button"
                onClick={() => document.getElementById('input-xl-file').click()}
            >
                עדכן קובץ נתוני תבאורה
                <MdOutlineFileUpload />
            </button>
            {mikveUploadPopup && (
                <div className="mikve-upload-xl-popup">
                    <div className="mikve-upload-xl-popup-content">
                        <h2>אישור העלה</h2>
                        <p>האם אתה בטוח שברצונך לעלות את הקובץ:</p>
                        <div className="upload-file-name">
                            <span className="file-name">{fileName}</span>
                        </div>
                        <div className="upload-buttons">
                            <button type="button" className="confirm-upload-xl-button" onClick={handleFileUpload}>אישור</button>
                            <button type="button" className="cancel-upload-xl-button" onClick={handleCancelUploadPopup}>בטל</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminUploadSamplingXL };
