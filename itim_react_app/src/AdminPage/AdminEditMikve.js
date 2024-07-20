import "./AdminEditMikve.css";
import React, { useState } from "react";
import { db } from "../Firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { TbEdit } from "react-icons/tb";
import { IoIosSave } from "react-icons/io";
import { getCoordinates } from "../GetCoordinates";
import citiesList from "./cityList.json";
import Autocomplete from "react-autocomplete";

const AdminEditMikve = ({ mikve, onClose, onSave, onDelete }) => {
  const [mikveData, setMikveData] = useState(mikve);
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState(mikve);
  const [isLevadChecked, setIsLevadChecked] = useState(mikve.levad);
  const [newId, setNewId] = useState("");
  const [mikveDeletePopup, setMikveDeletePopup] = useState(false);
  const [cities, setCities] = useState(citiesList);

  //  Validates a phone number.
  // Checks if the phone number contains only digits, dashes, and spaces.
  function isValidPhoneNumbers(phoneNumber) {
    return /^[0-9-\s]+$/.test(phoneNumber);
  }

  // Validates required fields, checks phone number format, verifies city existence,
  // fetches coordinates for the mikve address or city, and updates the mikve data in Firestore.
  // Displays alerts for missing or invalid data and calls onSave and onClose callbacks upon success.
  const handleSave = async () => {
    // Check if all required fields are filled
    if (
      mikveData.city &&
      mikveData.general_shelter &&
      mikveData.general_accessibility
    ) {
      if (mikveData.phone && !isValidPhoneNumbers(mikveData.phone)) {
        alert("אנא הכנס טלפון חוקי");
        // Handle invalid phone number case (can show an alert or any other UI indication)
        return;
      }

      const choosedCityName = mikveData.city.trim(); // Trim spaces from the city name
      const trimmedCitiesList = citiesList.map((city) => city.trim()); // Trim spaces from all city names
      if (!trimmedCitiesList.includes(choosedCityName)) {
        alert("העיר שהוזנה אינה נמצאת ברשימת הערים.");
        return;
      }

      let coordinates;
      if (mikveData.address) {
        // Call getCoordinates to fetch latitude and longitude
        coordinates = await getCoordinates(
          `${mikveData.address}, ${mikveData.city}`
        );
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

  // Saves the edited field data to the main mikveData state.
  // Updates specific fields like 'levad', 'general_shelter', and 'general_accessibility'
  // and resets the editField state.
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
    if (name === "city") {
      setCities(
        citiesList.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
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

  const handleCitySelect = (value) => {
    setTempData((prevData) => ({
      ...prevData,
      city: value,
    }));
  };

  const handleAddId = () => {
    if (newId.trim() !== "") {
      if (newId.trim() in tempData.ids) {
        alert("ה-ID כבר קיים בבור מים.");
      } else {
        setTempData((prevData) => ({
          ...prevData,
          ids: { ...prevData.ids, [newId.trim()]: "0" },
        }));
        setNewId("");
      }
    }
  };

  // Adds a new ID to the mikve's IDs if it's not empty or already exists.
  // Updates the `tempData` state with the new ID and clears the input field.
  const handleDeleteId = (id) => {
    const { [id]: _, ...updatedIds } = tempData.ids;
    setTempData((prevData) => ({
      ...prevData,
      ids: updatedIds,
    }));
  };

  // Deletes the mikve from the Firestore database and triggers onDelete callback.
  // Closes the edit popup after successful deletion.
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
          <button className="close-icon" onClick={onClose}>
            X
          </button>
        </div>
        <form className="edit-mikve-form">
          <div className="form-group" key="name">
            <label htmlFor="edit-mikve-name">שם מקווה:</label>

            <input
              type="text"
              id="edit-mikve-name"
              name="name"
              value={
                editField === "name" ? tempData["name"] : mikveData["name"]
              }
              onChange={handleInputChange}
              disabled={editField !== "name"}
            />
            {editField === "name" ? (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("name")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("name")}
              >
                <TbEdit />
              </button>
            )}
          </div>
          <div className="form-group" key="city">
            <label htmlFor="edit-mikve-city">
              עיר:
              <span className="required">*</span>
            </label>

            <Autocomplete
              getItemValue={(item) => item}
              items={cities}
              renderItem={(item, isHighlighted) => (
                <div
                  key={item}
                  className={`autocomplete-item ${isHighlighted ? "highlighted" : ""
                    }`}
                >
                  {item}
                </div>
              )}
              value={tempData.city}
              onChange={(e) => handleInputChange(e)}
              onSelect={handleCitySelect}
              inputProps={{
                id: "mikve-city",
                name: "city",
                required: true,
                className: "autocomplete-input",
                disabled: editField !== "city",
              }}
              wrapperStyle={{
                display: "flex",
                width: "100%",
                position: "relative",
                zIndex: "9999",
                color: "black",
              }}
            />
            {editField === "city" ? (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("city")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("city")}
              >
                <TbEdit />
              </button>
            )}
          </div>
          {[
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
                value={
                  editField === field.id
                    ? tempData[field.id]
                    : mikveData[field.id]
                }
                onChange={handleInputChange}
                disabled={editField !== field.id}
                required={field.required}
              />
              {editField === field.id ? (
                <button
                  className="edit-button"
                  type="button"
                  onClick={() => handleFieldSave(field.id)}
                >
                  <IoIosSave />
                </button>
              ) : (
                <button
                  className="edit-button"
                  type="button"
                  onClick={() => handleFieldEdit(field.id)}
                >
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
              value={
                editField === "general_shelter"
                  ? tempData.general_shelter
                  : mikveData.general_shelter
              }
              onChange={handleInputChange}
              disabled={editField !== "general_shelter"}
              required
            >
              <option value="">--בחר רמת מיגון--</option>
              <option value="0">אין מיגון</option>
              <option value="1">מיגון חלקי </option>
              <option value="2">מיגון מלא</option>
            </select>

            {editField === "general_shelter" ? (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("general_shelter")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("general_shelter")}
              >
                <TbEdit />
              </button>
            )}
          </div>
          <div className="form-group">
            <label htmlFor={`edit-mikve-accessibility`}>תיאור מיגון:</label>
            <input
              type="text"
              id="edit-mikve-shelter"
              name="shelter"
              value={
                editField === "general_shelter"
                  ? tempData.shelter
                  : mikveData.shelter
              }
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
              value={
                editField === "general_accessibility"
                  ? tempData.general_accessibility
                  : mikveData.general_accessibility
              }
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
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("general_accessibility")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("general_accessibility")}
              >
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
              value={
                editField === "general_accessibility"
                  ? tempData.accessibility
                  : mikveData.accessibility
              }
              onChange={handleInputChange}
              disabled={editField !== "general_accessibility"}
            />
          </div>

          <div className="form-group levad-group">
            <label htmlFor="edit-mikve-levad" className="levad-label">
              טבילה לבד:
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
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("levad")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("levad")}
              >
                <TbEdit />
              </button>
            )}
          </div>

          {isLevadChecked && (
            <div className="form-group">
              <label htmlFor="edit-mikve-levad-date">תאריך בדיקת השגחה:</label>
              <input
                type="date"
                id="edit-mikve-levad-date"
                name="when_levad"
                value={
                  editField === "levad"
                    ? tempData.when_levad
                    : mikveData.when_levad
                }
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
              placeholder="הוסף בור מקווה ID"
              onChange={(e) => setNewId(e.target.value)}
            />
            {editField === "ids" && (
              <button
                className="edit-button"
                id="add-mikve-id"
                type="button"
                onClick={handleAddId}
              >
                הוסף
              </button>
            )}
            {editField === "ids" ? (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("ids")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("ids")}
              >
                <TbEdit />
              </button>
            )}
          </div>

          <div className="adds-id">
            {editField === "ids"
              ? Object.entries(tempData.ids).map(([key, value]) => (
                <div key={key} className="added-id">
                  <button onClick={() => handleDeleteId(key)} type="button">
                    X
                  </button>
                  <span>{key}</span>
                </div>
              ))
              : Object.entries(tempData.ids).map(([key, value]) => (
                <div key={key} className="added-id">
                  <span>{key}</span>
                </div>
              ))}
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
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldSave("notes")}
              >
                <IoIosSave />
              </button>
            ) : (
              <button
                className="edit-button"
                type="button"
                onClick={() => handleFieldEdit("notes")}
              >
                <TbEdit />
              </button>
            )}
          </div>

          <div className="edit-mikve-buttons">
            <div className="left-buttons">
              <button
                type="button"
                className="save-button"
                onClick={handleSave}
              >
                שמור
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                בטל שינויים
              </button>
            </div>
            <div className="right-buttons">
              <button
                type="button"
                className="delete-button"
                onClick={() => setMikveDeletePopup(true)}
              >
                מחק מקווה
              </button>
            </div>

            {mikveDeletePopup && (
              <div className="delete-mikve-popup">
                <div className="delete-mikve-content">
                  <h2>אישור מחיקה</h2>
                  <p>האם אתה בטוח שברצונך למחוק?</p>
                  <button
                    type="button"
                    className="save-button"
                    onClick={handleDeleteMikve}
                  >
                    אישור
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setMikveDeletePopup(false)}
                  >
                    בטל
                  </button>
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
