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

  if (!chartData) return <div className="text-yellow-400 mt-8">Loading progress graph...</div>;

  return (
    <div className="p-6 mt-8 rounded-3xl bg-gray-900 border border-yellow-400/30 shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl text-yellow-400 text-center font-bold mb-4">Weekly Progress</h3>
      <Bar data={chartData} options={{
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }} />
    </div>
  );
}

export default WeeklyProgressChart;
