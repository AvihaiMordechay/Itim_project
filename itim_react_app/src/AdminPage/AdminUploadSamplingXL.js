import "./AdminUploadSamplingXL.css"
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { MdOutlineFileUpload } from "react-icons/md";

const AdminUploadSamplingXL = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
        document.getElementById('input-xl-file').key = Date.now();
    };

    const handleClearFile = () => {
        setFile(null);
        setFileName('');
    };

    const handleFileUpload = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            handleClearFile();
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="admin-upload-xl">
            <label>עדכן נתוני תבאורה</label>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                id="input-xl-file"
            />
            <button
                type="button"
                className="upload-btn"
                onClick={() => document.getElementById('input-xl-file').click()}
            >
                <MdOutlineFileUpload />
            </button>
            <button onClick={handleFileUpload}>העלה</button>
            {fileName && (
                <div >
                    <span className="file-name">{fileName}</span>
                    <button className="clear-file-btn" onClick={handleClearFile}>X</button>
                </div>
            )}
        </div >
    );
};

export { AdminUploadSamplingXL };
