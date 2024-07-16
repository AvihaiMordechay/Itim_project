// VisitorStatistics.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { db } from '../Firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import './VisitorStatistics.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VisitorStatistics = () => {
    const [visitorData, setVisitorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVisitorData = async () => {
            setIsLoading(true);
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const startDate = thirtyDaysAgo.toISOString().slice(0, 10);
            const endDate = today.toISOString().slice(0, 10);

            const visitorRef = collection(db, 'visitors');
            const q = query(visitorRef,
                where('__name__', '>=', startDate),
                where('__name__', '<=', endDate)
            );

            try {
                const querySnapshot = await getDocs(q);
                const data = {};
                // Initialize data for all days in the last 30 days
                for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
                    const dateString = d.toISOString().slice(0, 10);
                    data[dateString] = 0;
                }

                // Fill in actual data
                querySnapshot.docs.forEach(doc => {
                    data[doc.id] = doc.data().count;
                });

                // Convert to array and sort
                const sortedData = Object.entries(data)
                    .map(([date, visitors]) => ({ date, visitors }))
                    .sort((a, b) => a.date.localeCompare(b.date));

                setVisitorData(sortedData);
                setIsLoading(false);
                // Cleanup old data
                await cleanupOldData(startDate);
            } catch (error) {
                console.error("Error fetching visitor data: ", error);
                setIsLoading(false);
            }
        };

        fetchVisitorData();
    }, []);

    useEffect(() => {
        console.log('Updated visitorData:', visitorData);
    }, [visitorData]);

    const cleanupOldData = async (cutoffDate) => {
        const visitorRef = collection(db, 'visitors');
        const oldDataQuery = query(visitorRef, where('__name__', '<', cutoffDate));

        try {
            const snapshot = await getDocs(oldDataQuery);
            snapshot.docs.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        } catch (error) {
            console.error("Error cleaning up old visitor data:", error);
        }
    };

    const chartData = {
        labels: visitorData ? visitorData.map(d => d.date) : [],
        datasets: [
            {
                label: 'מספר מבקרים',
                data: visitorData ? visitorData.map(d => d.visitors) : [],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'מספר מבקרים ב-30 הימים האחרונים',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0
                }
            },
            x: {
                ticks: {
                    maxTicksLimit: 10 // Limit the number of x-axis labels to improve readability
                }
            }
        }
    };

    console.log('visitorData before rendering:', visitorData);

    return (
        <div className="visitor-statistics">
            <h2>סטטיסטיקת מבקרים</h2>
            {isLoading ? (
                <p>טוען נתונים...</p>
            ) : visitorData && visitorData.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
            ) : (
                <p>אין נתונים זמינים</p>
            )}
        </div>
    );
};

export { VisitorStatistics };