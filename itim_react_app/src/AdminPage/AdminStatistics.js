// AdminStatistics.js

import './AdminStatistics.css';
import React, { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { VisitorStatistics } from './VisitorStatistics';
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminStatistics = ({ allMikves }) => {
    const [showModal, setShowModal] = useState(false);
    const [chartType, setChartType] = useState('');
    const [filteredMikves, setFilteredMikves] = useState(allMikves);
    const [showTrafficGraph, setShowTrafficGraph] = useState(false);

    // Computes and memoizes the list of cities with at least two mikvehs,
    // sorted alphabetically. Updates when `allMikves` changes.
    const cities = useMemo(() => {
        const cityCounts = allMikves.reduce((acc, mikve) => {
            acc[mikve.city] = (acc[mikve.city] || 0) + 1;
            return acc;
        }, {});

        const filteredCities = Object.entries(cityCounts)
            .filter(([city, count]) => count >= 2)
            .map(([city]) => city)
            .sort();

        return filteredCities;
    }, [allMikves]);

    // Filters `allMikves` by the selected city and updates `filteredMikves`.
    // If no city is selected, resets to the full list of mikvehs.
    const handleFilter = (city) => {
        const filtered = city ? allMikves.filter(mikve => mikve.city === city) : allMikves;
        setFilteredMikves(filtered);
    };

    const handleCloseModal = () => {
        setChartType('');
        setShowModal(false);
        setFilteredMikves(allMikves);
    }

    // Aggregates mikveh data into categories: shelter, accessibility, levad, and waterSampling.
    // Counts occurrences based on the specified attributes and returns an object with the aggregated data.
    const collectMikveData = (data) => {
        const acc = {
            generalShelter: {
                withoutShelter: 0,
                partialShelter: 0,
                fullShelter: 0
            },
            generalAccessibility: {
                withoutAccessibility: 0,
                partialAccessibility: 0,
                fullAccessibility: 0
            },
            levad: {
                true: 0,
                false: 0
            },
            waterSampling: {
                mikveNotChecked: 0,
                mikveCheckedAndPassed: 0,
                mikveCheckedAndNotPassed: 0
            }
        };

        for (let i = 0; i < data.length; i++) {
            const { general_shelter, general_accessibility, levad, water_sampling } = data[i];

            if (general_shelter === "0") acc.generalShelter.withoutShelter += 1;
            else if (general_shelter === "1") acc.generalShelter.partialShelter += 1;
            else if (general_shelter === "2") acc.generalShelter.fullShelter += 1;

            if (general_accessibility === "0") acc.generalAccessibility.withoutAccessibility += 1;
            else if (general_accessibility === "1") acc.generalAccessibility.partialAccessibility += 1;
            else if (general_accessibility === "2") acc.generalAccessibility.fullAccessibility += 1;

            if (levad === true) acc.levad.true += 1;
            else if (levad === false) acc.levad.false += 1;

            if (water_sampling === "0") acc.waterSampling.mikveNotChecked += 1;
            else if (water_sampling === "1") acc.waterSampling.mikveCheckedAndPassed += 1;
            else if (water_sampling === "2") acc.waterSampling.mikveCheckedAndNotPassed += 1;

        }
        return acc;
    };

    // Generates data for a pie chart based on the selected type ('shelter', 'accessibility', 'levad', or 'waterSampling').
    // Uses `collectMikveData` to gather statistics and formats them into chart-compatible datasets.
    const getPieChartData = (type) => {
        const mikvesData = collectMikveData(filteredMikves);
        switch (type) {
            case 'shelter':
                return {
                    labels: ['ללא מיגון', 'מיגון חלקי', 'מיגון מלא'],
                    datasets: [{
                        data: [
                            mikvesData.generalShelter.withoutShelter,
                            mikvesData.generalShelter.partialShelter,
                            mikvesData.generalShelter.fullShelter
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
            case 'accessibility':
                return {
                    labels: ['ללא נגישות', 'נגישות חלקית', 'נגישות מלאה'],
                    datasets: [{
                        data: [
                            mikvesData.generalAccessibility.withoutAccessibility,
                            mikvesData.generalAccessibility.partialAccessibility,
                            mikvesData.generalAccessibility.fullAccessibility
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
            case 'levad':
                return {
                    labels: ['עם השגחה', 'ללא השגחה'],
                    datasets: [{
                        data: [
                            mikvesData.levad.true,
                            mikvesData.levad.false
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
            case 'waterSampling':
                return {
                    labels: ['נבדק ולא תקין', 'נבדק ותקין', 'לא נבדק'],
                    datasets: [{
                        data: [
                            mikvesData.waterSampling.mikveCheckedAndNotPassed,
                            mikvesData.waterSampling.mikveCheckedAndPassed,
                            mikvesData.waterSampling.mikveNotChecked,
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
            default:
                return {};
        }
    };

    return (
        <div className="admin-statistics-content">
            <button className="open-statistics-button" onClick={() => { setShowModal(true); setFilteredMikves(allMikves) }}>הצג סטטיסטיקות</button>
            {showModal && <div className="backdrop" onClick={handleCloseModal}></div>}
            {showModal && (
                <div className="statistics-modal">
                    <div className="statistics-modal-header">
                        <h3>התפלגויות</h3>
                        <button className="close-statistics-button" onClick={() => { handleCloseModal(); }}>X</button>
                    </div>
                    <div className="distribution-buttons">
                        <button className="distribution-button" onClick={() => { setShowTrafficGraph(true); setChartType(''); }}>כניסות לאתר</button>
                        <button className="distribution-button" onClick={() => { setShowTrafficGraph(false); setChartType('shelter'); }}>מיגון</button>
                        <button className="distribution-button" onClick={() => { setShowTrafficGraph(false); setChartType('accessibility'); }}>נגישות</button>
                        <button className="distribution-button" onClick={() => { setShowTrafficGraph(false); setChartType('levad'); }}>השגחה</button>
                        <button className="distribution-button" onClick={() => { setShowTrafficGraph(false); setChartType('waterSampling'); }}>תברואה</button>
                    </div>
                    <div className="distribution-content">
                        {(chartType || showTrafficGraph) && (
                            <div className="chart-container">
                                {!showTrafficGraph && (
                                    <div className='filter-labels'>
                                        <div className='choose-city-label'>
                                            <label htmlFor="city-select">בחר עיר:</label>
                                            <select id="city-select" onChange={(e) => handleFilter(e.target.value)}>
                                                <option value="">כל הערים</option>
                                                {cities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <label>סה"כ מקוואות בתרשים: {filteredMikves.length}</label>
                                        <label>סה"כ מקוואות במערכת: {allMikves.length}</label>
                                    </div>
                                )}
                                <div className="chartjs-container">
                                    {showTrafficGraph ? (
                                        <VisitorStatistics />
                                    ) : (
                                        <Pie data={getPieChartData(chartType)} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminStatistics };