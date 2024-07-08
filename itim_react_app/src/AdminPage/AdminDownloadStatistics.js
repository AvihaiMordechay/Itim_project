// src/AdminDownloadStatistics.js
import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDownloadStatistics = () => {

    const handleDownload = async () => {
        const doc = new jsPDF();

        // יצירת תיבה בלתי נראית ליצירת תוכן
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);

        // הוספת תוכן לתיבה
        const data = {
            labels: ['אדום', 'כחול', 'צהוב'],
            datasets: [{
                label: 'מספר הצבעות',
                data: [10, 20, 30],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }],
        };

        const textElement = document.createElement('div');
        textElement.innerHTML = `
      <h2>סטטיסטיקות עבור הפרויקט שלי</h2>
      <p>התרשימים למטה מציגים נתונים דמויים הממחישים את התפלגות הצבעות לפי צבעים שונים. נתוני ההצבעות נראים לפי צבעים:</p>
      <ul>
        <li><strong>אדום:</strong> 10 הצבעות</li>
        <li><strong>כחול:</strong> 20 הצבעות</li>
        <li><strong>צהוב:</strong> 30 הצבעות</li>
      </ul>
    `;
        element.appendChild(textElement);

        // הוספת תרשים לתיבה
        const canvasElement = document.createElement('canvas');
        element.appendChild(canvasElement);

        new ChartJS(canvasElement, {
            type: 'pie',
            data: data,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                width: 400,
                height: 400,
            },
        });

        // המתנה לסיום יצירת התרשים והמרת האלמנט לתמונה
        await new Promise(resolve => setTimeout(resolve, 1000));

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');

        // הוספת התמונה של התרשים ל-PDF
        doc.addImage(imgData, 'PNG', 10, 10, 180, 160);

        doc.save('Statistics.pdf');

        // הסרת האלמנט מהדף
        document.body.removeChild(element);
    };

    return (
        <div>
            <button onClick={handleDownload}>הורד כ-PDF</button>
        </div>
    );
};

export { AdminDownloadStatistics };
