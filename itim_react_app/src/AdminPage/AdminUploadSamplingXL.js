import "./AdminUploadSamplingXL.css";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { MdOutlineFileUpload } from "react-icons/md";
import { db } from '../Firebase'; // Import your Firebase configuration
import { collection, doc, writeBatch } from "firebase/firestore";

const AdminUploadSamplingXL = ({ allMikves, setAllMikves, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [mikveUploadPopup, setMikveUploadPopup] = useState(false);
    const [sanitationData, setSanitationData] = useState([]);
    const [errorUploadMessage, setErrorUploadMessage] = useState('');

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
            if (checkXlFile(jsonData)) {
                initSanitationData(jsonData);
            } else {
                setErrorUploadMessage('הקובץ שהוכנס לא בפורמט התקין');
                setTimeout(() => {
                    setErrorUploadMessage('');
                }, 1800);
            }
            handleCancelUploadPopup();
        };
        reader.readAsArrayBuffer(file);
    };

    const checkXlFile = (jsonData) => {
        for (const row of jsonData) {
            if (row['__EMPTY_5'] && typeof row['__EMPTY_5'] === 'string' && row['__EMPTY_5'].includes('NP')) {
                if (
                    row['__EMPTY_7'] != null &&  // תאריך
                    row['__EMPTY_9'] != null &&  // קוליפורמים
                    row['__EMPTY_10'] != null && // פסאודומונס
                    row['__EMPTY_11'] != null && // סטפילוקוקוס
                    row['__EMPTY_12'] != null && // עכירות
                    row['__EMPTY_13'] != null && // הגבה
                    row['__EMPTY_14'] != null) {
                    return true;
                }
            }
        }
        return false;
    };


    const initSanitationData = (jsonData) => {
        const result = [];
        let updatedDate;
        let mikveID = "";
        let values;
        let mikveData;

        jsonData.forEach(row => {
            if (row['__EMPTY_5'] &&
                typeof row['__EMPTY_5'] === 'string'
                && row['__EMPTY_5'].includes('NP')
                && typeof row['__EMPTY_7'] === 'number') {
                // if the id not checked.
                if (row['__EMPTY_5'] !== mikveID) {
                    mikveID = row['__EMPTY_5'];
                    updatedDate = XLSX.SSF.format('yyyy-mm-dd', row['__EMPTY_7']);
                    values = {
                        'קוליפורמים': row['__EMPTY_9'],
                        'פסאודומונס': row['__EMPTY_10'],
                        'סטפילוקוקוס': row['__EMPTY_11'],
                        'עכירות': row['__EMPTY_12'],
                        'הגבה': row['__EMPTY_13'],
                        'כלור חופשי': row['__EMPTY_14']
                    };

                    if (isNaN(new Date(updatedDate))) {
                        mikveData = {
                            'isClean': checkValues(values),
                        }
                    } else {
                        mikveData = {
                            'isClean': checkValues(values),
                            'date': updatedDate
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
                            'כלור חופשי': row['__EMPTY_14']
                        };
                        if (isNaN(new Date(updatedDate))) {
                            mikveData = {
                                'isClean': checkValues(values),
                            }
                        } else {
                            mikveData = {
                                'isClean': checkValues(values),
                                'date': updatedDate
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

    useEffect(() => {
        if (sanitationData.length > 0) {
            updateMikvesSanitation();
        }
    }, [sanitationData]);


    const checkValues = (values) => {
        const details = {
            "coliforms": values['קוליפורמים'],
            "pseudomonas": values['פסאודומונס'],
            "staphylococcus": values['סטפילוקוקוס'],
            "opacity": values['עכירות'],
            "reaction": values['הגבה'],
            "freeChlorine": values['כלור חופשי'],
        }
        for (let key in details) {
            let value = details[key];
            if (typeof value === 'string' && (value.includes('<') || value.includes('>'))) {
                value = parseFloat(value.replace(/>|<|\s+/g, ''));
            }
            if (isNaN(value)) {
                if (value === "לא נדרש" || value === "לא נבדק") {
                    if (key === details.coliforms) {
                        details[key] = 1;
                    } else if (key === details.pseudomonas) {
                        details[key] = 1;
                    } else if (key === details.staphylococcus) {
                        details[key] = 1;
                    } else if (key === details.opacity) {
                        details[key] = 1;
                    } else if (key === details.reaction) {
                        details[key] = 7;
                    } else if (key === details.freeChlorine) {
                        details[key] = 1.5;
                    }
                } else {
                    details[key] = 100; //ERROR.
                }
            } else {
                details[key] = value;
            }
        }
        if (
            details.coliforms > 10 ||
            details.pseudomonas > 1 ||
            details.staphylococcus > 2 ||
            details.opacity > 1 ||
            details.reaction < 7 || details.reaction > 8 ||
            details.freeChlorine < 1.5 || details.freeChlorine > 3
        ) {
            return false;
        } else {
            return true;
        }
    };

    const updateMikvesSanitation = () => {
        const MIKVE_NOT_CHECKED = "0";
        const MIKVE_CHECKED_AND_PASSED = "1";
        const MIKVE_CHECKED_AND_NOT_PASSED = "2";

        const updatedMikves = allMikves.map(mikve => {
            let mikveIsClean = MIKVE_NOT_CHECKED;
            let mikveSanitationDate = "";

            for (const id of mikve.ids) {
                const foundSanitationData = sanitationData.find(data => data.mikveID === id);

                if (foundSanitationData) {
                    if (foundSanitationData.mikveData.date) {  // Check if the date exists
                        mikveSanitationDate = foundSanitationData.mikveData.date;
                    }

                    if (foundSanitationData.mikveData.isClean) {
                        mikveIsClean = MIKVE_CHECKED_AND_PASSED;
                    } else {
                        mikveIsClean = MIKVE_CHECKED_AND_NOT_PASSED;
                        break;
                    }
                }
            }
            if (mikveIsClean === MIKVE_CHECKED_AND_NOT_PASSED) {
                return {
                    ...mikve,
                    ...(mikveSanitationDate && { when_sampling: mikveSanitationDate }),
                    water_sampling: MIKVE_CHECKED_AND_NOT_PASSED
                };
            } else if (mikveIsClean === MIKVE_CHECKED_AND_PASSED) {
                return {
                    ...mikve,
                    ...(mikveSanitationDate && { when_sampling: mikveSanitationDate }),
                    water_sampling: MIKVE_CHECKED_AND_PASSED
                };
            } else {
                // Check if water_sampling is already checked
                if (mikve.water_sampling !== MIKVE_CHECKED_AND_PASSED &&
                    mikve.water_sampling !== MIKVE_CHECKED_AND_NOT_PASSED
                ) {
                    // If not checked, set to MIKVE_NOT_CHECKED
                    return {
                        ...mikve,
                        water_sampling: MIKVE_NOT_CHECKED
                    };
                }
                // If already checked, return the original mikve object
                return mikve;
            }
        });
        setAllMikves(updatedMikves);
        updateFirebase(updatedMikves);
        onUploadSuccess(updatedMikves);
    };

    const updateFirebase = (updatedMikves) => {
        const batch = writeBatch(db);

        updatedMikves.forEach((mikve) => {
            const mikveDocRef = doc(collection(db, 'Mikves'), mikve.id);
            batch.update(mikveDocRef, {
                water_sampling: mikve.water_sampling,
                ...(mikve.when_sampling && { when_sampling: mikve.when_sampling })
            });
        });

        batch.commit();
    };

    return (
        <div className="admin-upload-xl">
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                id="input-xl-file"
                style={{ display: 'none' }} /* Hide the default file input */
            />
            <button
                type="button"
                className="mikve-upload-button"
                onClick={() => document.getElementById('input-xl-file').click()}
            >
                עדכן קובץ נתוני תבאורה
                <MdOutlineFileUpload />
            </button>
            {errorUploadMessage && (
                <div className="error-message">
                    {errorUploadMessage}
                </div>
            )}
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
