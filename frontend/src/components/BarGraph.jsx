import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { useRef, useEffect } from 'react';

export const BarGraph = ({ chartData, headText }) => {
    const chartRef = useRef(null);
    useEffect(() => {
        const chartInstance = new Chart(chartRef.current, {
            type: 'bar',
            data: chartData,
            options: {
                plugins: {
                    title: { display: true, text: headText },
                    legend: { display: false }
                }
            }
        });

        return () => {
            chartInstance.destroy();
        };
    }, [chartData]);

    return (
        <div className="container">
            
            <canvas ref={chartRef} />
        </div>
    );
};
