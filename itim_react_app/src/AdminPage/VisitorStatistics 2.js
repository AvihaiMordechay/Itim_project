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

    useEffect(() => {
        fetchVisitorData();
    }, []);

    const fetchVisitorData = async () => {
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

            // Cleanup old data
            await cleanupOldData(startDate);
        } catch (error) {
            console.error("Error fetching visitor data: ", error);
        }
    };

    const cleanupOldData = async (cutoffDate) => {
        const visitorRef = collection(db, 'visitors');
        const oldDataQuery = query(visitorRef, where('__name__', '<', cutoffDate));

        try {
            const snapshot = await getDocs(oldDataQuery);
            snapshot.docs.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            console.log(`Deleted ${snapshot.size} old visitor records.`);
        } catch (error) {
            console.error("Error cleaning up old visitor data:", error);
        }
    };

    const chartData = {
        labels: visitorData?.map(d => d.date) || [],
        datasets: [
            {
                label: 'מספר מבקרים',
                data: visitorData?.map(d => d.visitors) || [],
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

    return (
        <div className="visitor-statistics">
            <h2>סטטיסטיקת מבקרים</h2>
            {visitorData && <Line data={chartData} options={chartOptions} />}
        </div>
    );
};

export default VisitorStatistics;