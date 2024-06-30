import "./AdminUploadSamplingXL.css";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { MdOutlineFileUpload } from "react-icons/md";
import { db } from '../Firebase'; // Import your Firebase configuration
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";

const AdminUploadSamplingXL = ({ allMikves, setAllMikves }) => {
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
        console.log(allMikves);
    };

    const handleFileUpload = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            initSanitationData(jsonData);
            updateMikvesSanitation();
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
                        'קוליפורמים': parseInt(row['__EMPTY_9']),
                        'פסאודומונס': parseInt(row['__EMPTY_10']),
                        'סטפילוקוקוס': parseInt(row['__EMPTY_11']),
                        'עכירות': parseInt(row['__EMPTY_12']),
                        'הגבה': parseFloat(row['__EMPTY_13']),
                        'כלור חופשי': parseFloat(row['__EMPTY_14']),
                        'ברום חופשי': parseFloat(row['__EMPTY_15'])
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
                            'קוליפורמים': parseInt(row['__EMPTY_9']),
                            'פסאודומונס': parseInt(row['__EMPTY_10']),
                            'סטפילוקוקוס': parseInt(row['__EMPTY_11']),
                            'עכירות': parseInt(row['__EMPTY_12']),
                            'הגבה': parseFloat(row['__EMPTY_13']),
                            'כלור חופשי': parseFloat(row['__EMPTY_14']),
                            'ברום חופשי': parseFloat(row['__EMPTY_15'])
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

        batch.commit()
            .then(() => {
                console.log('Firebase updated successfully');
            })
            .catch((error) => {
                console.error('Error updating Firebase: ', error);
            });
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
