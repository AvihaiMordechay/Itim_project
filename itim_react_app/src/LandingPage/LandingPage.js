import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [accessibility, setAccessibility] = useState([]);
    const [cleanliness, setCleanliness] = useState('');
    const [hasBalanit, setHasBalanit] = useState(false);
    const [hasMamad, setHasMamad] = useState(false);
    const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search logic here
        console.log({ searchQuery, accessibility, cleanliness, hasBalanit, hasMamad });
    };

    const toggleAccessibility = () => {
        setIsAccessibilityOpen(!isAccessibilityOpen);
    };

    const handleAccessibilityChange = (option) => {
        setAccessibility((prevAccessibility) => {
            if (prevAccessibility.includes(option)) {
                return prevAccessibility.filter((item) => item !== option);
            } else {
                return [...prevAccessibility, option];
            }
        });
    };

    return (
        <div className="landing-page">
            <div className="header">
                <div className="header-text">חיפוש מקוואות נשים</div>
                <img src="itimlogo.png" className="logo" />
            </div>
            <div className="main-content">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="כתובת / עיר / אזור"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-bar"
                        />
                        <button type="submit" className="search-button">Search</button>
                    </div>
                    <div className="filters">
                        <div className="select-box accessibility-select">
                            <div className="select-header" onClick={toggleAccessibility}>
                                נגישות
                            </div>
                            {isAccessibilityOpen && (
                                <div className="select-options">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            value="option1"
                                            checked={accessibility.includes('option1')}
                                            onChange={() => handleAccessibilityChange('option1')}
                                        />
                                        Option 1
                                    </label>
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            value="option2"
                                            checked={accessibility.includes('option2')}
                                            onChange={() => handleAccessibilityChange('option2')}
                                        />
                                        Option 2
                                    </label>
                                    {/* Add more checkbox options as needed */}
                                </div>
                            )}
                        </div>
                        <select
                            value={cleanliness}
                            onChange={(e) => setCleanliness(e.target.value)}
                            className="select-box"
                        >
                            <option value="">רמת ניקיון</option>
                            {/* Add more options as needed */}
                        </select>
                        <label className="checkbox-container">
                            בלענית
                            <input
                                type="checkbox"
                                checked={hasBalanit}
                                onChange={(e) => setHasBalanit(e.target.checked)}
                            />
                        </label>
                        <label className="checkbox-container">
                            ממ"ד
                            <input
                                type="checkbox"
                                checked={hasMamad}
                                onChange={(e) => setHasMamad(e.target.checked)}
                            />
                        </label>
                    </div>
                </form>
                <div className="content">
                    <div className="map">Map Placeholder</div>
                    <div className="list">
                        <h3>מקוואות קרובים אלייך</h3>
                        {/* Scrollable list items go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { LandingPage };
