import "./AdminEditMikve.css";
import React, { useState } from "react";

const AdminEditMikve = ({ mikve, onClose }) => {
    console.log(mikve)
    const [mikveData, setMikveData] = useState(mikve);
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState(mikve);
    const [isLevadChecked, setIsLevadChecked] = useState(mikve.levad);

    const handleSave = async () => {
        try {
            console.log("Updated mikve:", mikveData);
            onClose();
        } catch (error) {
            console.error("Error updating mikve: ", error);
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
