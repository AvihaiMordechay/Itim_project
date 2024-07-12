import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart as ChartJS, ArcElement, PieController, Tooltip, Legend, Title } from 'chart.js';
import './AdminDownloadStatistics.css'; // Import the CSS file

ChartJS.register(ArcElement, PieController, Tooltip, Legend, Title);

const AdminDownloadStatistics = ({ allMikves }) => {

    const handleDownload = async () => {
        const doc = new jsPDF();

        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);

        const mikvesData = collectMikveData();
        const mikvesLength = allMikves.length;

        const headerElement = document.createElement('div');
        headerElement.classList.add('header-container-stat'); // Add class for styling
        headerElement.innerHTML = `
           <h2>סטטיסטיקה</h2>
           <h3>עמותת עיתים</h3>
           <p>התרשימים והנתונים הנ״ל מתארים את נתוני מקוואות הנשים במדינת ישראל</p> 
           <label>סה״כ המקוואות במערכת: ${mikvesLength}</label> 
        `;
        element.appendChild(headerElement);

        const createChart = (chartData, labels, colors, containerClass) => {
            const chartContainer = document.createElement('div');
            chartContainer.classList.add('chart-container'); // Add class for styling

            const labelsContainer = document.createElement('div');
            labelsContainer.classList.add('chart-labels-container'); // Add class for styling
            labels.forEach((label, index) => {
                const labelItem = document.createElement('div');
                labelItem.classList.add('chart-item'); // Add class for margin between items
                labelItem.innerHTML = `
                    <span class="chart-label" style="background-color: ${colors[index].border};"></span>
                    <span>${label.text}: ${chartData[index]} (${label.percentage}%)</span>
                `;
                labelsContainer.appendChild(labelItem);
            });

            const canvasElement = document.createElement('canvas');
            canvasElement.width = 400;
            canvasElement.height = 400;
            chartContainer.appendChild(labelsContainer);
            chartContainer.appendChild(canvasElement);

            new ChartJS(canvasElement, {
                type: 'pie',
                data: {
                    labels: labels.map(label => label.text),
                    datasets: [{
                        data: chartData,
                        backgroundColor: colors.map(color => color.background),
                        borderColor: colors.map(color => color.border),
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: false,
                        tooltip: false,
                        datalabels: {
                            display: false,
                        },
                    },
                },
            });

            element.appendChild(chartContainer);
        };

        const shelterData = mikvesData.generalShelter;
        createChart(
            [shelterData.withoutShelter, shelterData.partialShelter, shelterData.fullShelter],
            [
                { text: 'ללא מיגון', percentage: ((shelterData.withoutShelter / mikvesLength) * 100).toFixed(2) },
                { text: 'מיגון חלקי', percentage: ((shelterData.partialShelter / mikvesLength) * 100).toFixed(2) },
                { text: 'מיגון מלא', percentage: ((shelterData.fullShelter / mikvesLength) * 100).toFixed(2) },
            ],
            [
                { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
                { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
                { background: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
            ]
        );

        await new Promise(resolve => setTimeout(resolve, 1000));
        let canvas = await html2canvas(element);
        let imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 10, 180, 160);
        element.innerHTML = '';

        const accessibilityData = mikvesData.generalAccessibility;
        createChart(
            [accessibilityData.withoutAccessibility, accessibilityData.partialAccessibility, accessibilityData.fullAccessibility],
            [
                { text: 'ללא נגישות', percentage: ((accessibilityData.withoutAccessibility / mikvesLength) * 100).toFixed(2) },
                { text: 'נגישות חלקית', percentage: ((accessibilityData.partialAccessibility / mikvesLength) * 100).toFixed(2) },
                { text: 'נגישות מלאה', percentage: ((accessibilityData.fullAccessibility / mikvesLength) * 100).toFixed(2) },
            ],
            [
                { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
                { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
                { background: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
            ]
        );


        const levadData = mikvesData.levad;
        createChart(
            [levadData.true, levadData.false],
            [
                { text: 'עם השגחה', percentage: ((levadData.true / mikvesLength) * 100).toFixed(2) },
                { text: 'ללא השגחה', percentage: ((levadData.false / mikvesLength) * 100).toFixed(2) },
            ],
            [
                { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
                { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
            ]
        );

        await new Promise(resolve => setTimeout(resolve, 1000));
        canvas = await html2canvas(element);
        imgData = canvas.toDataURL('image/png');
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, 10, 180, 160);

        doc.save('Statistics.pdf');
        document.body.removeChild(element);
    };

    const collectMikveData = () => {
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
            }
        };

        for (let i = 0; i < allMikves.length; i++) {
            const { general_shelter, general_accessibility, levad } = allMikves[i];

            if (general_shelter === "0") acc.generalShelter.withoutShelter += 1;
            else if (general_shelter === "1") acc.generalShelter.partialShelter += 1;
            else if (general_shelter === "2") acc.generalShelter.fullShelter += 1;

            if (general_accessibility === "0") acc.generalAccessibility.withoutAccessibility += 1;
            else if (general_accessibility === "1") acc.generalAccessibility.partialAccessibility += 1;
            else if (general_accessibility === "2") acc.generalAccessibility.fullAccessibility += 1;

            if (levad === true) acc.levad.true += 1;
            else if (levad === false) acc.levad.false += 1;
        }

        return acc;
    };

    return (
        <div>
            <button onClick={handleDownload}>הורד סטיסטיקות כ-PDF</button>
        </div>
    );
};

export { AdminDownloadStatistics };
