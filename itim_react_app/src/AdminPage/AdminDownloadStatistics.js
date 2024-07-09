// src/AdminDownloadStatistics.js
import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart as ChartJS, ArcElement, PieController, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, PieController, Tooltip, Legend, Title);

const AdminDownloadStatistics = ({ allMikves }) => {

    const handleDownload = async () => {
        const doc = new jsPDF();

        // Create an invisible div to generate content for the PDF
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);

        // Get mikveh data
        const mikvesData = collectMikveData();
        const mikvesLength = allMikves.length;
        const shelterData = mikvesData.generalShelter;

        // Create the content of the div
        const textElement = document.createElement('div');
        textElement.innerHTML = `
           <h2>סטטיסטיקה</h2>
           <h3>עמותת עיתים</h3>
           <p>התרשימים והנתונים הנ״ל מתארים את נתוני מקוואות נשים במדינת ישראל</p> 
           <label>סה״כ המקוואות במערכת: ${mikvesLength}</label> 
        `;
        element.appendChild(textElement);

        // Add custom labels for the pie chart
        const labelsContainer = document.createElement('div');
        labelsContainer.style.display = 'flex';
        labelsContainer.style.flexDirection = 'column';
        labelsContainer.style.alignItems = 'flex-start'; // Align to the left side
        labelsContainer.style.marginLeft = '40px';
        labelsContainer.innerHTML = `
            <div>
                <span style="display: inline-block; width: 10px; height: 10px; background-color: rgba(255, 99, 132, 1); margin-right: 5px;"></span>
                <span>ללא מיגון: ${shelterData.withoutShelter}</span>
            </div>
            <div>
                <span style="display: inline-block; width: 10px; height: 10px; background-color: rgba(54, 162, 235, 1); margin-right: 5px;"></span>
                <span>מיגון חלקי: ${shelterData.partialShelter}</span>
            </div>
            <div>
                <span style="display: inline-block; width: 10px; height: 10px; background-color: rgba(255, 206, 86, 1); margin-right: 5px;"></span>
                <span>מיגון מלא: ${shelterData.fullShelter}</span>
            </div>
        `;

        // Create a container to position the labels and the chart side by side
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.marginTop = '80px';
        container.style.alignItems = 'center'; // Align vertically center
        container.appendChild(labelsContainer);

        // Add the chart to the container
        const canvasElement = document.createElement('canvas');
        canvasElement.width = 400;  // Set chart width
        canvasElement.height = 400; // Set chart height
        container.appendChild(canvasElement);

        // Create the pie chart data
        const shelterPieData = {
            labels: ['ללא מיגון', 'מיגון חלקי', 'מיגון מלא'],  // Add labels for the pie chart
            datasets: [{
                label: 'מיגון',
                data: [shelterData.withoutShelter, shelterData.partialShelter, shelterData.fullShelter],
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

        new ChartJS(canvasElement, {
            type: 'pie',
            data: shelterPieData,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: false, // Disable automatic legend
                    tooltip: false, // Disable automatic tooltips
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.forEach(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(2) + "%";
                            return percentage;
                        },
                        color: '#000', // Set the color of the data labels to black
                        align: 'center', // Align data labels to the center
                        anchor: 'center', // Anchor the data labels to the center
                        font: {
                            weight: 'bold', // Make the font bold
                            size: 16 // Set the font size
                        },
                    }
                }
            },
            plugins: [ChartDataLabels] // Include the datalabels plugin
        });

        element.appendChild(container);

        // Wait for the chart to render and convert the element to an image
        await new Promise(resolve => setTimeout(resolve, 1000));

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');

        // Add the chart image to the PDF
        doc.addImage(imgData, 'PNG', 10, 10, 180, 160);

        doc.save('Statistics.pdf');

        // Remove the element from the page
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
