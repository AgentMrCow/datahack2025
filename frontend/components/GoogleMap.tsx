"use client";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: 37.7749, // Default center (San Francisco)
    lng: -122.4194,
};

export default function GoogleMapComponent() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [map, setMap] = useState(null); // Store Google Map instance

    const fetchCovidData = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!backendUrl) {
              console.error("Backend URL is not set in the environment variables.");
              return;
            }
      
            const response = await fetch(`${backendUrl}/covid-data/`);
            const data = await response.json();

            if (!window.google) {
                console.error("Google Maps API not loaded yet.");
                return;
            }

            // Convert data to Google Maps LatLng points
            const points = data.covid_stats.map((item: any) => ({
                location: new window.google.maps.LatLng(item.lat, item.lng),
                weight: item.cases, // Weight based on case numbers
            }));

            setHeatmapData(points);
        } catch (error) {
            console.error("Failed to fetch COVID data:", error);
        }
    };

    useEffect(() => {
        if (map) fetchCovidData();
    }, [map]);

    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            libraries={["visualization"]}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={5}
                onLoad={(mapInstance) => setMap(mapInstance)} // Ensure map is ready
            >
                {heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}
            </GoogleMap>
        </LoadScript>
    );
}
