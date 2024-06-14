import "./AddMikve.css"
import React, { useState } from 'react';
import { getCoordinates } from '../GetCoordinates';

const AddMikve = () => {
    const [isAddMikvePopupOpen, setIsAddMikvePopupOpen] = useState(false); // Add pop-up state
    const [isSupervisionChecked, setIsSupervisionChecked] = useState(false);
    const [mikveData, setMikveData] = useState({
        name: '',
        city: '',
        address: '',
        phone: '',
        shelter: '',
        accessibility: '',
        supervision: false,
        supervisionDate: '',
        notes: '',
    });

    const handleSupervisionChange = () => {
        setIsSupervisionChecked(!isSupervisionChecked);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMikveData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

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
            // Call getCoordinates to fetch latitude and longitude
            const { lat, lng } = await getCoordinates(`${mikveData.address}, ${mikveData.city}`);

            // Prepare data to upload to Firestore or perform other actions
            const mikveToAdd = {
                name: mikveData.name,
                city: mikveData.city,
                address: mikveData.address,
                phone: mikveData.phone,
                shelter: mikveData.shelter,
                accessibility: mikveData.accessibility,
                supervision: mikveData.supervision,
                supervisionDate: mikveData.supervisionDate,
                notes: mikveData.notes,
                position: lat && lng ? { latitude: lat, longitude: lng } : null,
                water_sampling: " ",
                when_sampling: " ",
            };

            // Handle further actions (e.g., upload to Firestore)
            console.log('Mikve data to add:', mikveToAdd);

            // Clear form or close popup
            setIsAddMikvePopupOpen(false);
            setMikveData({
                name: '',
                city: '',
                address: '',
                phone: '',
                shelter: '',
                accessibility: '',
                supervision: false,
                supervisionDate: '',
                notes: '',
            });
        } else {
            alert('Please fill all required fields.');
        }
    };

    return (
        <div className="add-mikve-container">
            <button className="add-mikve-button" onClick={() => setIsAddMikvePopupOpen(true)}>הוסף מקווה</button>

            {isAddMikvePopupOpen && (
                <div className="add-mikve-popup">
                    <div className='add-mikve-content'>
                        <form className='add-mikve-form'>
                            <label htmlFor="mikve-name">שם מקווה:</label>
                            <input
                                type="text"
                                id="mikve-name"
                                name="name"
                                value={mikveData.name}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="mikve-city">עיר:</label>
                            <input
                                type="text"
                                id="mikve-city"
                                name="city"
                                value={mikveData.city}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="mikve-address">כתובת:</label>
                            <input
                                type='text'
                                id='mikve-address'
                                name='address'
                                value={mikveData.address}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="mikve-phone">טלפון:</label>
                            <input
                                type="tel"
                                id="mikve-phone"
                                name="phone"
                                value={mikveData.phone}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="mikve-shelter">מיגון:</label>
                            <input
                                type='text'
                                id='mikve-shelter'
                                name='shelter'
                                value={mikveData.shelter}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="mikve-accessibility">נגישות:</label>
                            <input
                                type="text"
                                id="mikve-accessibility"
                                name="accessibility"
                                value={mikveData.accessibility}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="mikve-supervision">השגחה:</label>
                            <input
                                type="checkbox"
                                id="mikve-supervision"
                                name="supervision"
                                checked={isSupervisionChecked}
                                onChange={handleSupervisionChange}
                            />

                            {isSupervisionChecked && (
                                <div>
                                    <label htmlFor="mikve-supervision-date">מתי השגחה:</label>
                                    <input
                                        type="date"
                                        id="mikve-supervision-date"
                                        name="supervisionDate"
                                        value={mikveData.supervisionDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <textarea
                                id="mikve-notes"
                                name="notes"
                                rows="4"
                                cols="50"
                                placeholder='הערות'
                                value={mikveData.notes}
                                onChange={handleInputChange}
                            />

                        </form>
                        <button className='confirm-add-mikve-botton' onClick={handleAddMikve}> הוסף מקווה</button>
                        <button className='exit-button-add-mikve' onClick={() => setIsAddMikvePopupOpen(false)}> צא ללא שינויים</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export { AddMikve };
