import "./AdminAddMikve.css";
import React, { useState } from "react";
import { getCoordinates } from "../GetCoordinates";
import { db } from "../Firebase";
import { collection, addDoc } from 'firebase/firestore';

const AdminAddMikve = () => {
    const [isAddMikvePopupOpen, setIsAddMikvePopupOpen] = useState(false);
    const [isLevadChecked, setIsLevadChecked] = useState(false);
    const [generalAccessibilityOption, setAccessibilitySelectedOption] = useState('');
    const [generalShelterOption, setShelterSelectedOption] = useState('');

    const [mikveData, setMikveData] = useState({
        name: "",
        city: "",
        address: "",
        phone: "",
        shelter: "",
        general_shelter: "",
        accessibility: "",
        general_accessibility: "",
        levad: false,
        when_levad: "",
        notes: "",
        ids: [],
        newId: ""
    });

    const handleLevadChange = () => {
        setIsLevadChecked(!isLevadChecked);
        setMikveData((prevData) => ({
            ...prevData,
            levad: !isLevadChecked,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "ids") {
            // Handle IDs separately to append to the array only if value is not empty
            if (value.trim() !== "") {
                setMikveData((prevData) => ({
                    ...prevData,
                    ids: [...prevData.ids, value.trim()], // Append new ID to the array
                    newId: ""  // Clear the newId field after adding
                }));
            }
            // Clear the input field after adding or if value is empty
            setMikveData((prevData) => ({
                ...prevData,
                newId: ""
            }));
        } else if (name === "general_accessibility") {
            setAccessibilitySelectedOption(value); // Update the selected option
            setMikveData((prevData) => ({
                ...prevData,
                general_accessibility: value,
            }));
        }
        else if (name === "general_shelter") {
            setShelterSelectedOption(value); // Update the selected option
            setMikveData((prevData) => ({
                ...prevData,
                general_shelter: value,
            }));
        } else {
            // For other fields, update as before
            setMikveData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }

    };

    const handleDeleteId = (index) => {
        // Create a copy of the ids array without the item at the specified index
        const updatedIds = mikveData.ids.filter((_, i) => i !== index);

        // Update the state with the new array of ids
        setMikveData((prevData) => ({
            ...prevData,
            ids: updatedIds
        }));
    };

    const isValidPhoneNumber = (phone) => {
        const regexMobile = /^05\d([-]{0,1})\d{3}([-]{0,1})\d{4}$/;
        const regexPhone = /^0\d([-]{0,1})\d{7}$/;
        return regexMobile.test(phone) || regexPhone.test(phone);
    };

    const handleClosePopup = () => {
        // Clear form or close popup
        setIsAddMikvePopupOpen(false);
        setMikveData({
            name: "",
            city: "",
            address: "",
            phone: "",
            shelter: "",
            general_shelter: "",
            accessibility: "",
            general_accessibility: "",
            levad: false,
            when_levad: "",
            notes: "",
            ids: [],
            newId: "",
        });
        setIsLevadChecked(false); // Reset supervision checkbox state
        setAccessibilitySelectedOption("");
        setShelterSelectedOption("");
    }

    const handleAddMikve = async () => {
        // Check if all required fields are filled
        if (
            mikveData.name &&
            mikveData.city &&
            mikveData.address &&
            mikveData.phone &&
            mikveData.general_shelter &&
            mikveData.general_accessibility
        ) {
            if (!isValidPhoneNumber(mikveData.phone)) {
                alert("אנא הכנס מספר טלפון חוקי.");
                return;
            }
            // Call getCoordinates to fetch latitude and longitude
            const coordinates = await getCoordinates(
                `${mikveData.address}, ${mikveData.city}`
            );

            // Prepare data to upload to Firestore or perform other actions
            const mikveToAdd = {
                ids: mikveData.ids,
                name: mikveData.name,
                city: mikveData.city,
                address: mikveData.address,
                phone: mikveData.phone,
                shelter: mikveData.shelter,
                general_shelter: mikveData.general_shelter,
                accessibility: mikveData.accessibility,
                general_accessibility: mikveData.general_accessibility,
                levad: mikveData.levad,
                when_levad: mikveData.when_levad,
                notes: mikveData.notes,
                position: coordinates
                    ? { latitude: coordinates.lat, longitude: coordinates.lng }
                    : null,
                water_sampling: "",
                when_sampling: "",
            };

            try {
                await addDoc(collection(db, 'Mikves'), mikveToAdd);
                handleClosePopup();
                window.location.reload(); // reload the screen.
            } catch (e) {
                console.error('Error adding document: ', e);
                handleClosePopup();
            }
            //Close and clear the popup.
        } else {
            alert("אנא מלא את כל השדות.");
        }
    };

    return (
        <div className="add-mikve-container">
            <button
                className="add-mikve-button"
                onClick={() => setIsAddMikvePopupOpen(true)}
            >
                הוסף מקווה
            </button>

            {isAddMikvePopupOpen && (
                <div className="add-mikve-popup">
                    <div className="add-mikve-content">
                        <h2>הוספת מקווה:</h2>
                        <form className="add-mikve-form">
                            <div className="form-group">
                                <label htmlFor="mikve-name">
                                    שם המקווה:
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="mikve-name"
                                    name="name"
                                    value={mikveData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mikve-city">
                                    עיר:
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="mikve-city"
                                    name="city"
                                    value={mikveData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mikve-address">
                                    כתובת:
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="mikve-address"
                                    name="address"
                                    value={mikveData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mikve-phone">
                                    טלפון:
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="mikve-phone"
                                    name="phone"
                                    value={mikveData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mikve-general-shelter">
                                    רמת מיגון:
                                    <span className="required">*</span>
                                </label>
                                <select
                                    id="mikve-general-shelter"
                                    name="general_shelter"
                                    value={generalShelterOption}
                                    onChange={handleInputChange}
                                    required>
                                    <option value="">--בחר רמת מיגון--</option>
                                    <option value="0">אין מיגון</option>
                                    <option value="1">מיגון חלקי</option>
                                    <option value="2">מיגון מלא</option>
                                </select>

                            </div>

                            <div className="form-group">
                                <label htmlFor="mikve-shelter">
                                    תיאור המיגון:
                                </label>
                                <input
                                    type="text"
                                    id="mikve-shelter"
                                    name="shelter"
                                    value={mikveData.shelter}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="select-box-accessibility">
                                    רמת נגישות:
                                    <span className="required">*</span>
                                </label>
                                <select
                                    id="select-box-accessibility"
                                    name="general_accessibility"
                                    value={generalAccessibilityOption}
                                    onChange={handleInputChange}
                                    required>
                                    <option value="">--בחר רמת נגישות--</option>
                                    <option value="0">אין נגישות</option>
                                    <option value="1">נגישות חלקית </option>
                                    <option value="2">נגישות מלאה</option>
                                </select>

                            </div>
                            <div className="form-group">
                                <label htmlFor="mikve-accessibility">
                                    תיאור נגישות:
                                </label>
                                <input
                                    type="text"
                                    id="mikve-accessibility"
                                    name="accessibility"
                                    value={mikveData.accessibility}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group supervision-group">
                                <label htmlFor="mikve-supervision" className="supervision-label">
                                    השגחה:
                                </label>
                                <input
                                    type="checkbox"
                                    id="mikve-supervision"
                                    name="levad"
                                    checked={isLevadChecked}
                                    onChange={handleLevadChange}
                                />
                            </div>

                            {isLevadChecked && (
                                <div className="form-group">
                                    <label htmlFor="mikve-supervision-date">
                                        מתי השגחה:
                                    </label>
                                    <input
                                        type="date"
                                        id="mikve-supervision-date"
                                        name="when_levad"
                                        value={mikveData.when_levad}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="mikve-ids">הוסף ID לבור מים:</label>
                                <input
                                    type="text"
                                    id="mikve-ids-input"
                                    name="newId"
                                    value={mikveData.newId}
                                    onChange={handleInputChange}
                                />
                                <button
                                    className="add-id"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleInputChange({ target: { name: "ids", value: mikveData.newId } });
                                    }}
                                >
                                    הוסף
                                </button>
                                <div className="form-group"></div>
                            </div>

                            <div className="added-ids">
                                {mikveData.ids.map((id, index) => (
                                    <div key={index} className="added-id">
                                        <button
                                            onClick={() => handleDeleteId(index)}
                                            type="button"
                                        >
                                            X
                                        </button>
                                        <span>{id}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <label htmlFor="mikve-notes">הערות:</label>
                                <textarea
                                    id="mikve-notes"
                                    name="notes"
                                    rows="4"
                                    cols="50"
                                    placeholder="הוסף הערה"
                                    value={mikveData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                        <div className="buttons-container">
                            <button
                                className="confirm-add-mikve-button"
                                onClick={handleAddMikve}
                            >
                                הוסף מקווה
                            </button>
                            <button
                                className="exit-button-add-mikve"
                                onClick={handleClosePopup}
                            >
                                צא ללא שינויים
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminAddMikve };
