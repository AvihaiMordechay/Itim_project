import "./AdminEditMikve.css";
import React, { useState } from "react";

const AdminEditMikve = ({ mikve, onClose }) => {
    const [mikveData, setMikveData] = useState(mikve);
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState(mikve);
    const [isLevadChecked, setIsLevadChecked] = useState(mikve.levad);
    const [newId, setNewId] = useState("");


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
            mikveData.shelter &&
            mikveData.accessibility
        ) {
            if (!isValidPhoneNumber(mikveData.phone)) {
                console.log("Invalid phone number.");
                // Handle invalid phone number case (can show an alert or any other UI indication)
                return;
            }

            try {
                console.log("Updated mikve:", mikveData);
                onClose();
            } catch (error) {
                console.error("Error updating mikve: ", error);
            }
        } else {
            alert(".אנא מלא את כל שדות החובה");
        }
    };


    const handleFieldEdit = (field) => {
        setTempData(mikveData);
        setEditField(field);
    };

    const handleFieldSave = (field) => {
        setMikveData((prevData) => ({
            ...prevData,
            [field]: tempData[field],
        }));
        if (field === "levad") {
            setIsLevadChecked(tempData[field]);
        }
        setEditField(null);

    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setTempData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

        if (name === "levad") {
            setIsLevadChecked(checked);
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
        // Create a copy of the ids array without the item at the specified index
        const updatedIds = tempData.ids.filter((_, i) => i !== index);

        // Update the state with the new array of ids
        setTempData((prevData) => ({
            ...prevData,
            ids: updatedIds
        }));
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
                        { id: "shelter", label: "מיגון", type: "text" },
                        { id: "accessibility", label: "נגישות", type: "text" }
                    ].map((field) => (
                        <div className="form-group" key={field.id}>
                            {editField === field.id ? (
                                <button type="button" onClick={() => handleFieldSave(field.id)}>שמור</button>
                            ) : (
                                <button type="button" onClick={() => handleFieldEdit(field.id)}>ערוך</button>
                            )}
                            <input
                                type={field.type}
                                id={`edit-mikve-${field.id}`}
                                name={field.id}
                                value={editField === field.id ? tempData[field.id] : mikveData[field.id]}
                                onChange={handleInputChange}
                                disabled={editField !== field.id}
                                required
                            />
                            <label htmlFor={`edit-mikve-${field.id}`}>
                                <span className="required">*</span>
                                {`:${field.label}`}
                            </label>
                        </div>
                    ))}

                    <div className="form-group levad-group">
                        {editField === "levad" ? (
                            <button type="button" onClick={() => handleFieldSave("levad")}>שמור</button>
                        ) : (
                            <button type="button" onClick={() => handleFieldEdit("levad")}>ערוך</button>
                        )}
                        <input
                            type="checkbox"
                            id="edit-mikve-levad"
                            name="levad"
                            checked={tempData.levad}
                            onChange={handleInputChange}
                            disabled={editField !== "levad"}
                        />
                        <label htmlFor="edit-mikve-levad" className="levad-label">
                            :השגחה
                        </label>
                    </div>

                    {isLevadChecked && (
                        <div className="form-group">
                            <input
                                type="date"
                                id="edit-mikve-levad-date"
                                name="when_levad"
                                value={editField === "levad" ? tempData.when_levad : mikveData.when_levad}
                                onChange={handleInputChange}
                                disabled={editField !== "levad"}
                            />
                            <label htmlFor="edit-mikve-levad-date">
                                :תאריך בדיקת השגחה
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        {editField === "ids" ? (
                            <button type="button" onClick={() => handleFieldSave("ids")}>שמור</button>
                        ) : (
                            <button type="button" onClick={() => handleFieldEdit("ids")}>ערוך</button>
                        )}

                        {editField === "ids" && (
                            <button id="add-mikve-id" type="button" onClick={handleAddId}>
                                הוסף
                            </button>
                        )}

                        <input
                            type="text"
                            id="edit-mikve-id"
                            name="ids"
                            value={newId}
                            disabled={editField !== "ids"}
                            placeholder="הוסף לבור מקווה ID"
                            onChange={(e) => setNewId(e.target.value)}
                        />
                    </div>

                    <div className="adds-id">
                        {editField === "ids" && (
                            tempData.ids.map((id, index) => (
                                <div key={index} className="added-id">
                                    <span>{id}</span>
                                    <button onClick={() => handleDeleteId(index)} type="button">
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                    </div>


                    <div className="form-group">
                        {editField === "notes" ? (
                            <button type="button" onClick={() => handleFieldSave("notes")}>שמור</button>
                        ) : (
                            <button type="button" onClick={() => handleFieldEdit("notes")}>ערוך</button>
                        )}
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
                        <label htmlFor="edit-mikve-notes">:הערות</label>
                    </div>

                    <div className="edit-mikve-buttons">
                        <button type="button" className="save-button" onClick={handleSave}>
                            שמור
                        </button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            ביטול
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { AdminEditMikve };
