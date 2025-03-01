"use client";
import { useState, useEffect } from "react";
import { fetchCovidData, predictInfectionRate } from "@/lib/api";
import GoogleMapComponent from "@/components/GoogleMap";

export default function Home() {
    const [covidData, setCovidData] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [input, setInput] = useState({
        country: "",
        population: 0,
        confirmed_cases: 0,
        deaths: 0,
        vaccinations: 0
    });

    useEffect(() => {
        async function loadData() {
            const covid = await fetchCovidData();
            setCovidData(covid.covid_stats);
        }
        loadData();
    }, []);

    const handlePredict = async () => {
        const result = await predictInfectionRate(input);
        setPrediction(result.predicted_infection_rate);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-bold text-center text-blue-700">🌍 Public Health Dashboard</h1>

                {/* COVID-19 Data Section */}
                <h2 className="mt-6 text-2xl font-semibold text-gray-800">📊 COVID-19 Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {covidData.map((item, index) => (
                        <div key={index} className="bg-blue-100 p-4 rounded-lg shadow">
                            <h3 className="font-bold text-blue-800">{item.country}</h3>
                            <p>🧑‍🤝‍🧑 Population: {item.population.toLocaleString()}</p>
                            <p>🦠 Cases: {item.cases.toLocaleString()}</p>
                            <p>☠️ Deaths: {item.deaths.toLocaleString()}</p>
                            <p>💉 Vaccinations: {item.vaccinations.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Infection Rate Prediction Section */}
                <h2 className="mt-10 text-2xl font-semibold text-gray-800">🔮 Predict Infection Rate</h2>
                <div className="bg-gray-50 p-6 rounded-lg shadow mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Country" onChange={(e) => setInput({ ...input, country: e.target.value })} />
                        <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" placeholder="Population" onChange={(e) => setInput({ ...input, population: parseInt(e.target.value) })} />
                        <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" placeholder="Confirmed Cases" onChange={(e) => setInput({ ...input, confirmed_cases: parseInt(e.target.value) })} />
                        <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" placeholder="Deaths" onChange={(e) => setInput({ ...input, deaths: parseInt(e.target.value) })} />
                        <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" placeholder="Vaccinations" onChange={(e) => setInput({ ...input, vaccinations: parseInt(e.target.value) })} />
                    </div>
                    <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300" onClick={handlePredict}>🚀 Predict</button>
                </div>

                {/* Display Prediction Result */}
                {prediction !== null && (
                    <div className="mt-6 bg-green-100 p-6 rounded-lg text-center shadow">
                        <h3 className="text-xl font-semibold text-green-700">📈 Predicted Infection Rate</h3>
                        <p className="text-3xl font-bold text-green-800">{prediction}%</p>
                    </div>
                )}
            </div>
            <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-bold text-center text-blue-700">🌍 Public Health Dashboard</h1>

                {/* Google Maps Heatmap */}
                <h2 className="mt-6 text-2xl font-semibold text-gray-800">🗺️ COVID-19 Heatmap</h2>
                <GoogleMapComponent />

                {/* COVID-19 Data Section */}
                <h2 className="mt-6 text-2xl font-semibold text-gray-800">📊 COVID-19 Data</h2>
                <ul>
                    {covidData.map((item, index) => (
                        <li key={index}>
                            <strong>{item.country}</strong>: Cases: {item.cases.toLocaleString()}, Deaths: {item.deaths.toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </div>
    );
}
