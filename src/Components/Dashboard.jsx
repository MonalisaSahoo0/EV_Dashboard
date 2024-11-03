import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Papa from "papaparse";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [evData, setEvData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV file
    Papa.parse("/Electric_Vehicle_Population_Data.csv", {
      download: true,
      header: true, // Parses the first row as header fields
      complete: (result) => {
        setEvData(result.data); // Set parsed data to state
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      },
    });
  }, []);

  // Aggregate data for the Bar Chart (Registrations by year)
  const yearlyData = evData.reduce((acc, item) => {
    const year = item["Model Year"]; // Adjust the column name if needed
    if (year) { // Check if the year is defined and not empty
      acc[year] = acc[year] ? acc[year] + 1 : 1;
    } else {
      console.warn("Undefined Model Year found:", item);
    }
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(yearlyData),
    datasets: [
      {
        label: "EV Registrations by Year",
        data: Object.values(yearlyData),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Aggregate data for the Pie Chart (EVs by manufacturer)
  const manufacturerData = evData.reduce((acc, item) => {
    const make = item.Make; // Adjust the column name if needed
    if (make) { // Check if the make is defined and not empty
      acc[make] = acc[make] ? acc[make] + 1 : 1;
    } else {
      console.warn("Undefined Make found:", item);
    }
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(manufacturerData),
    datasets: [
      {
        label: "EVs by Manufacturer",
        data: Object.values(manufacturerData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Electric Vehicle Dashboard</h2>
      
      {/* Bar Chart */}
      <div style={{ width: "70%", margin: "20px auto" }}>
        <h3>EV Registrations by Year</h3>
        <Bar data={barChartData} />
      </div>
      
      {/* Pie Chart */}
      <div style={{ width: "40%", margin: "20px auto" }}>
        <h3>EVs by Manufacturer</h3>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
