import "./AdminAddMikve.css";
import React, { useState } from "react";
import { getCoordinates } from "../GetCoordinates";
import { db } from "../Firebase";
import { collection, addDoc } from 'firebase/firestore';

const AdminAddMikve = () => {
    const [isAddMikvePopupOpen, setIsAddMikvePopupOpen] = useState(false); // Add pop-up state
    const [isSupervisionChecked, setIsSupervisionChecked] = useState(false);
    const [mikveData, setMikveData] = useState({
        name: "",
        city: "",
        address: "",
        phone: "",
        shelter: "",
        accessibility: "",
        supervision: false,
        supervisionDate: "",
        notes: "",
        ids: [],
        newId: ""
    });

    const handleSupervisionChange = () => {
        setIsSupervisionChecked(!isSupervisionChecked);
        setMikveData((prevData) => ({
            ...prevData,
            supervision: !isSupervisionChecked,
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
            accessibility: "",
            supervision: false,
            supervisionDate: "",
            notes: "",
            ids: [],
            newId: "",
        });
        setIsSupervisionChecked(false); // Reset supervision checkbox state
    }

    const handleAddMikve = async () => {
        // Check if all required fields are filled
        if (
            mikveData.name &&
            mikveData.city &&
            mikveData.address &&
            mikveData.phone &&
            mikveData.shelter &&
            mikveData.accessibility
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
                ID: mikveData.ids,
                name: mikveData.name,
                city: mikveData.city,
                address: mikveData.address,
                phone: mikveData.phone,
                shelter: mikveData.shelter,
                accessibility: mikveData.accessibility,
                levad: mikveData.supervision,
                when_levad: mikveData.supervisionDate,
                notes: mikveData.notes,
                position: coordinates
                    ? { latitude: coordinates.lat, longitude: coordinates.lng }
                    : null,
                water_sampling: "",
                when_sampling: "",
            };

            try {
                const docRef = await addDoc(collection(db, 'Mikves'), mikveToAdd);
                console.log('Document written with ID: ', docRef.id);
            } catch (e) {
                console.error('Error adding document: ', e);
            }
            console.log("Mikve data to add: ", mikveToAdd);

            //Close and clear the popup.
            handleClosePopup();
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
                        <form className="add-mikve-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="mikve-name"
                                    name="name"
                                    value={mikveData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="mikve-name">
                                    <span className="required">*</span>
                                    :שם המקווה
                                </label>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="mikve-city"
                                    name="city"
                                    value={mikveData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="mikve-city">
                                    <span className="required">*</span>
                                    :עיר
                                </label>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="mikve-address"
                                    name="address"
                                    value={mikveData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="mikve-address">
                                    <span className="required">*</span>
                                    :כתובת
                                </label>
                            </div>

                            <div className="form-group">
                                <input
                                    type="tel"
                                    id="mikve-phone"
                                    name="phone"
                                    value={mikveData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="mikve-phone">
                                    <span className="required">*</span>
                                    :טלפון
                                </label>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="mikve-shelter"
                                    name="shelter"
                                    value={mikveData.shelter}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="mikve-shelter">
                                    <span className="required">*</span>
                                    :מיגון
                                </label>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="mikve-accessibility"
                                    name="accessibility"
                                    value={mikveData.accessibility}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="mikve-accessibility">
                                    <span className="required">*</span>
                                    :נגישות
                                </label>
                            </div>

                            <div className="form-group supervision-group">
                                <input
                                    type="checkbox"
                                    id="mikve-supervision"
                                    name="supervision"
                                    checked={isSupervisionChecked}
                                    onChange={handleSupervisionChange}
                                />
                                <label htmlFor="mikve-supervision" className="supervision-label">
                                    :השגחה
                                </label>
                            </div>

                            {isSupervisionChecked && (
                                <div className="form-group">
                                    <input
                                        type="date"
                                        id="mikve-supervision-date"
                                        name="supervisionDate"
                                        value={mikveData.supervisionDate}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="mikve-supervision-date">
                                        :מתי השגחה
                                    </label>
                                </div>
                            )}

                            <div className="form-group">
                                <button
                                    className="add-id"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleInputChange({ target: { name: "ids", value: mikveData.newId } });
                                    }}
                                >
                                    הוסף
                                </button>
                                <input
                                    type="text"
                                    id="mikve-ids-input"
                                    name="newId"
                                    value={mikveData.newId}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="mikve-ids">:לבור מים ID הוסף</label>

                                <div className="form-group"></div>
                            </div>

                            <div className="added-ids">
                                {mikveData.ids.map((id, index) => (
                                    <div key={index} className="added-id">
                                        <span>{id}</span>
                                        <button
                                            onClick={() => handleDeleteId(index)}
                                            type="button"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <textarea
                                    id="mikve-notes"
                                    name="notes"
                                    rows="4"
                                    cols="50"
                                    placeholder="הוסף הערה"
                                    value={mikveData.notes}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="mikve-notes">:הערות</label>
                            </div>
                        </form>
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
            )}
        </div>
    );
};

export { AdminAddMikve };
