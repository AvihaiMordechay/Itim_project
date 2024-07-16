import "./AdminEditMikve.css";
import React, { useState } from "react";
import { db } from "../Firebase"
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { TbEdit } from "react-icons/tb";
import { IoIosSave } from "react-icons/io";
import { getCoordinates } from "../GetCoordinates";



const AdminEditMikve = ({ mikve, onClose, onSave, onDelete }) => {
    const [mikveData, setMikveData] = useState(mikve);
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState(mikve);
    const [isLevadChecked, setIsLevadChecked] = useState(mikve.levad);
    const [newId, setNewId] = useState("");
    const [mikveDeletePopup, setMikveDeletePopup] = useState(false);

    function isValidPhoneNumber(phoneNumber) {
        const pattern = /^(?:\+972|0)?([2345789]|5[012345678]|7\d)-?\d{7}$|^(?:\+972|0)?(5[012345678]|7\d)-?\d{8}$/;
        return pattern.test(phoneNumber);
    }

    const handleSave = async () => {
        // Check if all required fields are filled
        if (
            mikveData.city &&
            mikveData.general_shelter &&
            mikveData.general_accessibility
        ) {
            if (mikveData.phone && !isValidPhoneNumber(mikveData.phone)) {
                alert("אנא הכנס טלפון חוקי");
                // Handle invalid phone number case (can show an alert or any other UI indication)
                return;
            }

            let coordinates;
            if (mikveData.address) {
                // Call getCoordinates to fetch latitude and longitude
                coordinates = await getCoordinates(`${mikveData.address}, ${mikveData.city}`);
            } else {
                coordinates = await getCoordinates(`${mikveData.city}`);
            }

            if (coordinates) {
                mikveData.position = {
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                };
            } else {
                mikveData.position = {};
            }

            try {
                // Create a copy of mikveData without the id field
                const { id, ...mikveDataWithoutId } = mikveData;

                // Ensure position is not undefined
                if (!mikveDataWithoutId.position) {
                    delete mikveDataWithoutId.position;
                }

                const mikveRef = doc(db, "Mikves", mikve.id);
                await updateDoc(mikveRef, mikveDataWithoutId);
                onSave(mikveData);
                onClose();
            } catch (error) {
                console.error("Error updating mikve: ", error);
            }
        } else {
            alert(".אנא מלא את כל שדות החובה");
        }
    };



    const handleFieldEdit = (field) => {
        setEditField(field);
    };

    const handleFieldSave = (field) => {
        if (field === "levad") {
            setIsLevadChecked(tempData[field]);
            setMikveData((prevData) => ({
                ...prevData,
                [field]: tempData[field],
                ["when_levad"]: tempData.when_levad,
            }));

        } else if (field === "general_shelter") {
            setMikveData((prevData) => ({
                ...prevData,
                [field]: tempData[field],
                ["shelter"]: tempData.shelter,
            }));
        } else if (field === "general_accessibility") {
            setMikveData((prevData) => ({
                ...prevData,
                [field]: tempData[field],
                ["accessibility"]: tempData.accessibility,
            }));
        } else {
            setMikveData((prevData) => ({
                ...prevData,
                [field]: tempData[field],
            }));
        }
        setEditField(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        if (name === "generalShelter") {
            // Handle special case for generalShelter
            setTempData((prevData) => ({
                ...prevData,
                general_shelter: newValue,
            }));
        } else if (name === "generalAccessibility") {
            // Handle special case for generalAccessibility
            setTempData((prevData) => ({
                ...prevData,
                general_accessibility: newValue,
            }));
        } else {
            // For other fields, update normally
            setTempData((prevData) => ({
                ...prevData,
                [name]: newValue,
            }));
        }

        if (name === "levad") {
            setIsLevadChecked(checked);
            if (checked === false) {
                setTempData((prevData) => ({
                    ...prevData,
                    when_levad: "",
                }));
            }
        }
    };

    const handleAddId = () => {
        if (newId.trim() !== "") {
            setTempData((prevData) => ({
                ...prevData,
                ids: { ...prevData.ids, [newId.trim()]: "0" },
            }));
            setNewId("");

        }
    };


    const handleDeleteId = (id) => {
        const { [id]: _, ...updatedIds } = tempData.ids;
        setTempData((prevData) => ({
            ...prevData,
            ids: updatedIds,
        }));
    };

    const handleDeleteMikve = async () => {
        try {
            await deleteDoc(doc(db, "Mikves", mikve.id));
            onDelete(mikve.id);
            onClose();
        } catch (error) {
            console.error("Error deleting mikve: ", error);
        }
    };


    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="edit-mikve-popup">
            <div className="edit-mikve-content">
                <div className="edit-mikve-header">
                    <h2>עריכת מקווה</h2>
                    <button className="close-icon" onClick={onClose} >X</button>
                </div>
                <form className="edit-mikve-form">
                    <div className="form-group" key="name">
                        <label htmlFor="edit-mikve-name">
                            שם מקווה:
                        </label>

                        <input
                            type="text"
                            id="edit-mikve-name"
                            name="name"
                            value={editField === "name" ? tempData["name"] : mikveData["name"]}
                            onChange={handleInputChange}
                            disabled={editField !== "name"}
                        />
                        {editField === "name" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("name")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("name")}>
                                <TbEdit />
                            </button>
                        )}
                    </div>
                    <div className="form-group" key="city">
                        <label htmlFor="edit-mikve-city">
                            עיר:
                            <span className="required">*</span>
                        </label>

                        <input
                            type="text"
                            id="edit-mikve-city"
                            name="city"
                            value={editField === "city" ? tempData["city"] : mikveData["city"]}
                            onChange={handleInputChange}
                            disabled={editField !== "city"}
                            required
                        />
                        {editField === "city" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("city")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("city")}>
                                <TbEdit />
                            </button>
                        )}
                    </div>
                    {[
                        { id: "city", label: "עיר", type: "text", required: true },
                        { id: "address", label: "כתובת", type: "text", required: false },
                        { id: "phone", label: "טלפון", type: "tel", required: false },
                    ].map((field) => (
                        <div className="form-group" key={field.id}>
                            <label htmlFor={`edit-mikve-${field.id}`}>
                                {`${field.label}:`}
                                {field.required && <span className="required">*</span>}
                            </label>

                            <input
                                type={field.type}
                                id={`edit-mikve-${field.id}`}
                                name={field.id}
                                value={editField === field.id ? tempData[field.id] : mikveData[field.id]}
                                onChange={handleInputChange}
                                disabled={editField !== field.id}
                                required={field.required}
                            />
                            {editField === field.id ? (
                                <button className="edit-button" type="button" onClick={() => handleFieldSave(field.id)}>
                                    <IoIosSave />
                                </button>
                            ) : (
                                <button className="edit-button" type="button" onClick={() => handleFieldEdit(field.id)}>
                                    <TbEdit />
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="form-group">
                        <label htmlFor="edit-select-box-shelter">
                            רמת מיגון:
                            <span className="required">*</span>
                        </label>
                        <select
                            id="edit-select-box-shelter"
                            name="general_shelter"
                            value={editField === "general_shelter" ? tempData.general_shelter : mikveData.general_shelter}
                            onChange={handleInputChange}
                            disabled={editField !== "general_shelter"}
                            required>
                            <option value="">--בחר רמת מיגון--</option>
                            <option value="0">אין מיגון</option>
                            <option value="1">מיגון חלקי </option>
                            <option value="2">מיגון מלא</option>
                        </select>

                        {editField === "general_shelter" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("general_shelter")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("general_shelter")}>
                                <TbEdit />
                            </button>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor={`edit-mikve-accessibility`}>
                            תיאור מיגון:
                        </label>
                        <input
                            type="text"
                            id="edit-mikve-shelter"
                            name="shelter"
                            value={editField === "general_shelter" ? tempData.shelter : mikveData.shelter}
                            onChange={handleInputChange}
                            disabled={editField !== "general_shelter"}

                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="edit-select-box-accessibility">
                            רמת נגישות פיזית:
                            <span className="required">*</span>
                        </label>
                        <select
                            id="edit-select-box-accessibility"
                            name="general_accessibility"
                            value={editField === "general_accessibility" ? tempData.general_accessibility : mikveData.general_accessibility}
                            onChange={handleInputChange}
                            disabled={editField !== "general_accessibility"}
                            required
                        >
                            <option value="">-- בחר רמת נגישות פיזית--</option>
                            <option value="0">לא נגיש</option>
                            <option value="1">נגישות חלקית</option>
                            <option value="2">נגישות מלאה</option>
                        </select>
                        {editField === "general_accessibility" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("general_accessibility")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("general_accessibility")}>
                                <TbEdit />
                            </button>
                        )}

                    </div>
                    <div className="form-group">
                        <label htmlFor={`edit-mikve-accessibility`}>
                            תיאור נגישות פיזית:
                        </label>
                        <input
                            type="text"
                            id="edit-mikve-accessibility"
                            name="accessibility"
                            value={editField === "general_accessibility" ? tempData.accessibility : mikveData.accessibility}
                            onChange={handleInputChange}
                            disabled={editField !== "general_accessibility"}
                        />
                    </div>


                    <div className="form-group levad-group">
                        <label htmlFor="edit-mikve-levad" className="levad-label">
                            השגחה:
                        </label>
                        <input
                            type="checkbox"
                            id="edit-mikve-levad"
                            name="levad"
                            checked={editField === "levad" ? tempData.levad : mikveData.levad}
                            onChange={handleInputChange}
                            disabled={editField !== "levad"}
                        />
                        {editField === "levad" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("levad")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("levad")}>
                                <TbEdit />
                            </button>
                        )}
                    </div>

                    {isLevadChecked && (
                        <div className="form-group">
                            <label htmlFor="edit-mikve-levad-date">
                                תאריך בדיקת השגחה:
                            </label>
                            <input
                                type="date"
                                id="edit-mikve-levad-date"
                                name="when_levad"
                                value={editField === "levad" ? tempData.when_levad : mikveData.when_levad}
                                onChange={handleInputChange}
                                disabled={editField !== "levad"}
                            />

                        </div>
                    )}

                    <div className="form-group">

                        <input
                            type="text"
                            id="edit-mikve-id"
                            name="ids"
                            value={newId}
                            disabled={editField !== "ids"}
                            placeholder="הוסף לבור מקווה ID"
                            onChange={(e) => setNewId(e.target.value)}
                        />
                        {editField === "ids" && (
                            <button className="edit-button" id="add-mikve-id" type="button" onClick={handleAddId}>
                                הוסף
                            </button>
                        )}
                        {editField === "ids" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("ids")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("ids")}>
                                <TbEdit />
                            </button>
                        )}



                    </div>

                    <div className="adds-id">
                        {editField === "ids" ? (
                            Object.entries(tempData.ids).map(([key, value]) => (
                                <div key={key} className="added-id">
                                    <span>{key}</span>
                                    <button onClick={() => handleDeleteId(key)} type="button">
                                        X
                                    </button>
                                </div>
                            ))
                        ) : (
                            Object.entries(tempData.ids).map(([key, value]) => (
                                <div key={key} className="added-id">
                                    <span>{key}</span>
                                </div>
                            ))
                        )}
                    </div>


                    <div className="form-group">
                        <label htmlFor="edit-mikve-notes">הערות:</label>
                        <textarea
                            id="edit-mikve-notes"
                            name="notes"
                            rows="4"
                            cols="50"
                            placeholder="הוסף הערה"
                            value={editField === "notes" ? tempData.notes : mikveData.notes}
                            onChange={handleInputChange}
                            disabled={editField !== "notes"}
                        />
                        {editField === "notes" ? (
                            <button className="edit-button" type="button" onClick={() => handleFieldSave("notes")}>
                                <IoIosSave />
                            </button>
                        ) : (
                            <button className="edit-button" type="button" onClick={() => handleFieldEdit("notes")}>
                                <TbEdit />
                            </button>
                        )}

                    </div>

                    <div className="edit-mikve-buttons">
                        <div className="left-buttons">

                            <button type="button" className="save-button" onClick={handleSave}>
                                שמור
                            </button>
                            <button type="button" className="cancel-button" onClick={handleCancel}>
                                בטל שינויים
                            </button>
                        </div>
                        <div className="right-buttons">
                            <button type="button" className="delete-button" onClick={() => setMikveDeletePopup(true)}>מחק מקווה</button>
                        </div>

                        {mikveDeletePopup && (
                            <div className="delete-mikve-popup">
                                <div className="delete-mikve-content">
                                    <h2>אישור מחיקה</h2>
                                    <p>האם אתה בטוח שברצונך למחוק?</p>
                                    <button type="button" className="save-button" onClick={handleDeleteMikve}>אישור</button>
                                    <button type="button" className="cancel-button" onClick={() => setMikveDeletePopup(false)}>בטל</button>
                                </div>
                            </div>

                        )}



                    </div>
                </form>
            </div>
        </div>
    );
};

export { AdminEditMikve };
