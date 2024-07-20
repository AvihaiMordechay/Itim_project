import "./AdminUploadSamplingXL.css";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../Firebase'; // Import your Firebase configuration
import { collection, doc, writeBatch } from "firebase/firestore";
import { RingLoader } from 'react-spinners';


const AdminUploadSamplingXL = ({ allMikves, setAllMikves, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [mikveUploadPopup, setMikveUploadPopup] = useState(false);
    const [sanitationData, setSanitationData] = useState([]);
    const [errorUploadMessage, setErrorUploadMessage] = useState('');
    const [showMikvesMissing, setShowMikvesMissing] = useState(false);
    const [showLoadingUploading, setShowLoadingUploading] = useState(false);
    const [missingIDs, setMissingIDs] = useState([]);
    const [uploadSuccessfuly, setUploadSuccessfuly] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Updates the file state and file name when a new file is selected.
    // Shows the upload confirmation popup.
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
        setMikveUploadPopup(true);
    };

    // Closes the loading and missing mikvehs popup by setting their visibility to false.
    const handleExitLoadingUploading = () => {
        setShowLoadingUploading(false);
        setShowMikvesMissing(false);
    }

    // Resets the file input and hides the upload confirmation popup.
    const handleCancelUploadPopup = () => {
        setFile(null);
        setFileName('');
        setMikveUploadPopup(false);
        const inputElement = document.getElementById('input-xl-file');
        inputElement.value = ''; // Reset the input value
    };

    // Reads the selected file, parses it as an XLSX workbook, and initializes sanitation data if the file format is valid.
    // Displays an error message if the file format is incorrect.
    const handleFileUpload = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            handleCancelUploadPopup();
            if (checkXlFile(jsonData)) {
                setShowLoadingUploading(true);
                setIsLoading(true);
                initSanitationData(jsonData);
                setIsLoading(false);
            } else {
                setErrorUploadMessage('הקובץ שהוכנס לא בפורמט התקין');
                setTimeout(() => {
                    setErrorUploadMessage('');
                }, 1800);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // Validates the XLSX data by ensuring required columns for sanitation data are present and non-null.
    // Returns true if the file contains valid sanitation data, otherwise false.
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

    // Initializes sanitation data from the XLSX JSON data. Processes each row to update the mikveh's sanitation status, 
    // date, and cleanliness based on the values. Updates the state with the processed data.
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
                            'isMarked': false
                        }
                    } else {
                        mikveData = {
                            'isClean': checkValues(values),
                            'date': updatedDate,
                            'isMarked': false
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
                                'isMarked': false
                            }
                        } else {
                            mikveData = {
                                'isClean': checkValues(values),
                                'date': updatedDate,
                                'isMarked': false
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


    // Validates sanitation values against predefined thresholds. Returns true if all values are within acceptable limits, 
    // otherwise returns false. Handles special cases for non-numeric or missing values.
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

    // Updates mikveh data with the latest sanitation results. Marks mikvehs as updated, checks their status, 
    // and updates Firebase if there are changes. Displays missing mikvehs if any.
    const updateMikvesSanitation = () => {
        const MIKVE_NOT_CHECKED = "0";
        const MIKVE_CHECKED_AND_PASSED = "1";
        const MIKVE_CHECKED_AND_NOT_PASSED = "2";
        const tempMissingIds = [];
        const updatedMikves = allMikves.reduce((acc, mikve) => {
            let mikveSanitationDate = "";
            let idsMap = new Map(Object.entries(mikve.ids));
            let isUpdated = false; // Flag to check if there are changes in the mikve
            for (const [id, value] of idsMap) {

                const foundSanitationData = sanitationData.find(data => data.mikveID === id);
                if (foundSanitationData) {
                    isUpdated = true; // Mark as updated if any sanitation data is found
                    foundSanitationData.mikveData.isMarked = true;

                    if (foundSanitationData.mikveData.date) {  // Check if the date exists
                        const newDate = new Date(foundSanitationData.mikveData.date);
                        if (!mikveSanitationDate || newDate > new Date(mikveSanitationDate)) {
                            mikveSanitationDate = foundSanitationData.mikveData.date;
                        }
                    }
                    if (foundSanitationData.mikveData.isClean) {
                        idsMap.set(id, MIKVE_CHECKED_AND_PASSED);
                    } else {
                        idsMap.set(id, MIKVE_CHECKED_AND_NOT_PASSED);
                    }
                }
            }

            if (!isUpdated) {
                return acc; // Skip adding to acc if no updates
            }

            // Determine the water_sampling status based on the updated ids Map
            let waterSamplingStatus = MIKVE_NOT_CHECKED;
            let hasUnchecked = true;
            for (const value of idsMap.values()) {
                if (value === MIKVE_CHECKED_AND_NOT_PASSED) {
                    waterSamplingStatus = MIKVE_CHECKED_AND_NOT_PASSED;
                    break;
                }
                if (value === MIKVE_CHECKED_AND_PASSED) {
                    hasUnchecked = false;
                }
            }

            if (waterSamplingStatus !== MIKVE_CHECKED_AND_NOT_PASSED) {
                if (hasUnchecked) {
                    waterSamplingStatus = MIKVE_NOT_CHECKED;
                } else {
                    waterSamplingStatus = MIKVE_CHECKED_AND_PASSED;
                }
            }

            acc.push({
                ...mikve,
                ids: Object.fromEntries(idsMap),
                ...(mikveSanitationDate && { when_sampling: mikveSanitationDate }),
                water_sampling: waterSamplingStatus
            });

            return acc;
        }, []);
        sanitationData.forEach(data => {
            if (!data.mikveData.isMarked) {
                tempMissingIds.push(data.mikveID);
            }
        });
        if (tempMissingIds.length > 0) {
            setMissingIDs(tempMissingIds);
            setShowMikvesMissing(true);
        }

        if (updatedMikves.length > 0) {
            setAllMikves(prevMikves => {
                const updatedMikveIds = new Set(updatedMikves.map(mikve => mikve.id));
                const newMikves = prevMikves.map(mikve =>
                    updatedMikveIds.has(mikve.id) ? updatedMikves.find(updated => updated.id === mikve.id) : mikve
                );
                onUploadSuccess(newMikves); // Pass the newMikves to onUploadSuccess
                return newMikves;
            });
            updateFirebase(updatedMikves);
        } else {
            setUploadSuccessfuly("not found");
        }
    };

    // Performs a batch update to Firebase with the new mikveh sanitation data.
    // Sets success or failure state based on the result.
    const updateFirebase = async (updatedMikves) => {
        const batch = writeBatch(db);
        try {
            updatedMikves.forEach((mikve) => {
                const mikveDocRef = doc(collection(db, 'Mikves'), mikve.id);
                batch.update(mikveDocRef, {
                    ids: mikve.ids,
                    water_sampling: mikve.water_sampling,
                    ...(mikve.when_sampling && { when_sampling: mikve.when_sampling })
                });
            });
            await batch.commit();
            setUploadSuccessfuly("true");
        } catch (error) {
            console.error("Error updating Firebase:", error);
            setUploadSuccessfuly("false");
        }
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
                עדכן קובץ נתוני תברואה
            </button>
            {errorUploadMessage && (
                <div className="xl-error-message">
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
            {showLoadingUploading && (
                <div className="loading-uploading-popup" onClick={handleExitLoadingUploading}>
                    <div className="loading-uploading-popup-content" onClick={(e) => e.stopPropagation()}>
                        <button type="submit" className="exit-loading-uploading-button" onClick={handleExitLoadingUploading}>X</button>
                        {isLoading && (
                            <div className="loading-spinner-upload-xl">
                                <RingLoader color={"#123abc"} loading={isLoading} size={150} />
                            </div>
                        )}
                        {uploadSuccessfuly === "true" && (
                            <h2 className="upload-xl-successfuly">הקובץ הועלה בהצלחה</h2>
                        )}
                        {uploadSuccessfuly === "false" && (
                            <h2 className="upload-xl-unsuccessfuly">העלאה נכשלה</h2>
                        )}
                        {uploadSuccessfuly === "not found" && (
                            <h2 className="upload-xl-not-found">לא נמצאו מקוואות לעדכון</h2>
                        )}
                        {showMikvesMissing && (
                            <div className="missing-ids-container">
                                <h3 className="missing-ids">מקוואות חדשים שאותרו בקובץ:</h3>
                                <ul className="missing-ids-list">
                                    {missingIDs.map(id => (
                                        <li key={id}>{id}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );

};

export { AdminUploadSamplingXL };
