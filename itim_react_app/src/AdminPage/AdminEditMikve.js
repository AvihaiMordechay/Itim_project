import "./AdminEditMikve.css";
import React, { useState } from "react";
import { db } from "../Firebase"
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { TbEdit } from "react-icons/tb";
import { IoIosSave } from "react-icons/io";



const AdminEditMikve = ({ mikve, onClose, onSave, onDelete }) => {
    const [mikveData, setMikveData] = useState(mikve);
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState(mikve);
    const [isLevadChecked, setIsLevadChecked] = useState(mikve.levad);
    const [newId, setNewId] = useState("");
    const [mikveDeletePopup, setMikveDeletePopup] = useState(false);

    const isValidPhoneNumber = (phone) => {
        const regexMobile = /^05\d([-]{0,1})\d{3}([-]{0,1})\d{4}$/;
        const regexPhone = /^0\d([-]{0,1})\d{7}$/;

        return regexMobile.test(phone) || regexPhone.test(phone);
    };

    const handleSave = async () => {
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
                alert("אנא הכנס טלפון חוקי");
                // Handle invalid phone number case (can show an alert or any other UI indication)
                return;
            }
            try {
                // Create a copy of mikveData without the id field
                const { id, ...mikveDataWithoutId } = mikveData;
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

        } else if (field == "general_shelter") {
            setMikveData((prevData) => ({
                ...prevData,
                [field]: tempData[field],
                ["shelter"]: tempData.shelter,
            }));
        } else if (field == "general_accessibility") {
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
            if (newValue === "0") {

            }
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
            if (checked == false) {
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
                ids: [...prevData.ids, newId.trim()],
            }));
            setNewId("");

        }
    };


    const handleDeleteId = (index) => {
        // Create a copy of the ids array without the item at the spec  ified index
        const updatedIds = tempData.ids.filter((_, i) => i !== index);

        // Update the state with the new array of ids
        setTempData((prevData) => ({
            ...prevData,
            ids: updatedIds
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
                <h2>עריכת מקווה</h2>
                <form className="edit-mikve-form">
                    {[
                        { id: "name", label: "שם המקווה", type: "text" },
                        { id: "city", label: "עיר", type: "text" },
                        { id: "address", label: "כתובת", type: "text" },
                        { id: "phone", label: "טלפון", type: "tel" },
                    ].map((field) => (
                        <div className="form-group" key={field.id}>
                            <label htmlFor={`edit-mikve-${field.id}`}>
                                {`${field.label}:`}
                                <span className="required">*</span>
                            </label>

                            <input
                                type={field.type}
                                id={`edit-mikve-${field.id}`}
                                name={field.id}
                                value={editField === field.id ? tempData[field.id] : mikveData[field.id]}
                                onChange={handleInputChange}
                                disabled={editField !== field.id}
                                required
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
                            רמת נגישות:
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
                            <option value="">--בחר רמת נגישות--</option>
                            <option value="0">אין נגישות</option>
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
                            תיאור נגישות:
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
                            <button id="add-mikve-id" type="button" onClick={handleAddId}>
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
                            tempData.ids.map((id, index) => (
                                <div key={index} className="added-id">
                                    <span>{id}</span>
                                    <button onClick={() => handleDeleteId(index)} type="button">
                                        X
                                    </button>
                                </div>
                            ))
                        ) : (
                            tempData.ids.map((id, index) => (
                                <div key={index} className="added-id">
                                    <span>{id}</span>
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
