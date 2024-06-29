import "./AdminUploadSamplingXL.css";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { MdOutlineFileUpload } from "react-icons/md";

const AdminUploadSamplingXL = ({ allMikves }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [mikveUploadPopup, setMikveUploadPopup] = useState(false);
    const [sanitationData, setSanitationData] = useState([]);

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
            // TODO: CHECK IF THE jsonData is sanitation data!!!
            initSanitationData(jsonData);
            handleCancelUploadPopup();
        };
        reader.readAsArrayBuffer(file);
    };

    const initSanitationData = (jsonData) => {
        const result = [];
        let updatedDate;
        let mikveID = "";
        let values;
        let mikveData;

        jsonData.forEach(row => {
            if (row['__EMPTY_5'] && row['__EMPTY_5'].includes('NP') && typeof row['__EMPTY_7'] === 'number') {
                if (row['__EMPTY_5'] !== mikveID) {
                    mikveID = row['__EMPTY_5'];
                    updatedDate = XLSX.SSF.format('yyyy-mm-dd', row['__EMPTY_7']);
                    values = {
                        'קוליפורמים': row['__EMPTY_9'],
                        'פסאודומונס': row['__EMPTY_10'],
                        'סטפילוקוקוס': row['__EMPTY_11'],
                        'עכירות': row['__EMPTY_12'],
                        'הגבה': row['__EMPTY_13'],
                        'כלור חופשי': row['__EMPTY_14'],
                        'ברום חופשי': row['__EMPTY_15']
                    };
                    //TODO: CAST THE VALUES TO INT; 
                    if (checkValues(values) === true) { // TODO: CHECK IF NEED TO CHECK ״לא נבדק״ AND NOT JUST TRUE/FALSE
                        mikveData = {
                            'isClean': true,
                            'date': updatedDate
                        };
                    } else {
                        mikveData = {
                            'isClean': false
                        };
                    }
                    result.push({ mikveID, mikveData });
                } else {
                    const date = XLSX.SSF.format('yyyy-mm-dd', row['__EMPTY_7']);
                    if (date > updatedDate) {
                        updatedDate = date;
                        values = {
                            'קוליפורמים': row['__EMPTY_9'],
                            'פסאודומונס': row['__EMPTY_10'],
                            'סטפילוקוקוס': row['__EMPTY_11'],
                            'עכירות': row['__EMPTY_12'],
                            'הגבה': row['__EMPTY_13'],
                            'כלור חופשי': row['__EMPTY_14'],
                            'ברום חופשי': row['__EMPTY_15']
                        };
                        //TODO: CAST THE VALUES TO INT; 
                        if (checkValues(values) === true) { // TODO: CHECK IF NEED TO CHECK ״לא נבדק״ AND NOT JUST TRUE/FALSE
                            mikveData = {
                                'isClean': true,
                                'date': updatedDate
                            };
                        } else {
                            mikveData = {
                                'isClean': false
                            };
                        }
                        const index = result.findIndex(item => item.mikveID === mikveID);
                        if (index !== -1) {
                            result[index].mikveData = mikveData;
                        }
                    }
                }
            }
        });
        setSanitationData(result);
    };

    const checkValues = (values) => {
        if (
            values['קוליפורמים'] > 10 ||
            values['פסאודומונס'] > 1 ||
            values['סטפילוקוקוס'] > 2 ||
            values['עכירות'] > 1 ||
            values['הגבה'] < 7 || values['הגבה'] > 8 ||
            values['כלור חופשי'] < 1.5 || values['כלור חופשי'] > 3 ||
            values['ברום חופשי'] < 3 || values['ברום חופשי'] > 6
        ) {
            return false;
        } else {
            return true;
        }
    };

    return (
        <div className="admin-upload-xl">
            <label>עדכן קובץ נתוני תבאורה</label>
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
                <MdOutlineFileUpload />
            </button>
            {mikveUploadPopup && (
                <div className="mikve-upload-xl-popup">
                    <div className="mikve-upload-xl-popup-content">
                        <h2>אישור העלה</h2>
                        <p>האם אתה בטוח שברצונך לעלות את הקובץ:</p>
                        <div>
                            <span className="file-name">{fileName}</span>
                        </div>
                        <button type="button" className="confirm-upload-xl-button" onClick={handleFileUpload}>אישור</button>
                        <button type="button" className="cancel-upload-xl-button" onClick={handleCancelUploadPopup}>בטל</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminUploadSamplingXL };
