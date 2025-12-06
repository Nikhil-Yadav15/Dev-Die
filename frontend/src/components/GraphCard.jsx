import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Chart from 'chart.js/auto';

function WeeklyProgressChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchProgress() {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://medico-backend-hjxm.onrender.com/progress/weekly", {
        params: { token },
      });
      const data = res.data;

     
      const labels = [];
      const percentages = [];
   for (let i = 0; i < 7; i++) {
  const day = new Date();
  day.setDate(day.getDate() - (6 - i));


  const dayString = day.toISOString().slice(0, 10);

  

  labels.push(
    `${day.toLocaleDateString("en-US", { weekday: "short" })} (${day.getMonth() + 1}/${day.getDate()})`
  );

 
  
  const progressDay = data.find((p) => p._id === dayString);

  if (progressDay && progressDay.dosesScheduled > 0) {
    percentages.push(
      Math.round((progressDay.dosesTaken / progressDay.dosesScheduled) * 100)
    );
  } else {
    percentages.push(0);
  }
}


      setChartData({
        labels,
        datasets: [
          {
            label: "Adherence (%)",
            data: percentages,
            backgroundColor: "rgba(255, 206, 86, 0.6)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
          },
        ],
      });
    }
    fetchProgress();
  }, []);

  if (!chartData) return <div className="text-cyan-300 mt-8 text-center">Loading progress graph...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 mt-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-cyan-400/40 shadow-[0_24px_70px_rgba(15,23,42,1)] max-w-4xl mx-auto">
      <h3 className="text-lg sm:text-xl md:text-2xl text-cyan-200 text-center font-bold mb-4 sm:mb-6">Weekly Progress</h3>
      <div className="w-full overflow-x-auto">
        <Bar 
          data={{
            ...chartData,
            datasets: [{
              ...chartData.datasets[0],
              backgroundColor: "rgba(34, 197, 94, 0.6)",
              borderColor: "rgba(34, 197, 94, 1)",
              borderWidth: 2,
            }]
          }} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: { 
                beginAtZero: true, 
                max: 100,
                ticks: { color: '#cbd5e1' },
                grid: { color: 'rgba(100, 116, 139, 0.2)' }
              },
              x: {
                ticks: { color: '#cbd5e1' },
                grid: { color: 'rgba(100, 116, 139, 0.2)' }
              }
            },
            plugins: {
              legend: {
                labels: { color: '#cbd5e1' }
              }
            }
          }} 
        />
      </div>
    </div>
  );
}

export default WeeklyProgressChart;
