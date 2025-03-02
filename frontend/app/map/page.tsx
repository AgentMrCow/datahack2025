"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, MapPin, AlertTriangle, LocateFixed, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, HeatmapLayer, DirectionsRenderer } from "@react-google-maps/api";
import { googleMapsConfig, mapCenter } from "@/lib/googleMapsConfig";
import PlanRoutePage from "@/app/map/plan";

// Constants for the MTR Risk Map
const DISTANCE_THRESHOLD_KM = 1.0;
const MTR_LINE_COLORS = {
    "Island Line": "#007DC5",
    "Tsuen Wan Line": "#ED1D24",
    "Kwun Tong Line": "#00AB4E",
    "Tseung Kwan O Line": "#7D499D",
    "Tung Chung Line": "#F7943E",
    "Airport Express": "#00888A",
    "Disneyland Resort Line": "#F173AC",
    "East Rail Line": "#53B7E8",
    "South Island Line": "#BAC429",
    "Tuen Ma Line": "#923011",
    "Light Rail": "#D3A809",
};

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

// Helper: Haversine formula to compute distance (in km)
function haversineDistance([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    return (
        R *
        2 *
        Math.asin(
            Math.sqrt(
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) ** 2
            )
        )
    );
}

export default function RiskMap() {
    // Existing state for Risk Map / Medical Services view
    const [mapView, setMapView] = useState<"risk" | "medical">("risk");
    const [riskLevel, setRiskLevel] = useState<number>(3);
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const [timePeriod, setTimePeriod] = useState<"24h" | "7d">("7d");
    const [heatMapMode, setHeatMapMode] = useState<boolean>(true);
    const [globalRiskHeatmap, setGlobalRiskHeatmap] = useState<boolean>(false);
    const [showStations, setShowStations] = useState<boolean>(false);

    const [stations, setStations] = useState<any[]>([]);
    const [buildings, setBuildings] = useState<any[]>([]);
    const [lines, setLines] = useState<Record<string, boolean>>({});
    const [toggledLines, setToggledLines] = useState<Record<string, boolean>>({});

    const [hospitals, setHospitals] = useState<any[]>([]);
    const [pharmacies, setPharmacies] = useState<any[]>([]);
    const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(["pharmacy", "hospital"]);
    const [inventoryFilters, setInventoryFilters] = useState({
        masks: false,
        testKits: false,
        medicines: false,
        sanitizers: false,
    });
    const [distanceFilter, setDistanceFilter] = useState<number>(5);
    const currentLocationStatic = { lat: 22.382, lng: 114.192 };

    // -------------------------------
    // New State for Safe Navigation (moved from navigation/page.tsx)
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [routeCalculated, setRouteCalculated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [currentLocation, setCurrentLocation] = useState("Detecting your location...");

    const originRef = useRef<HTMLInputElement | null>(null);
    const destinationRef = useRef<HTMLInputElement | null>(null);
    // -------------------------------

    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded, loadError } = useJsApiLoader(googleMapsConfig);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onMapUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    // Load CSV data for MTR stations and buildings when the component mounts
    useEffect(() => {
        async function loadMapData() {
            try {
                const stationResponse = await fetch("/Cleaned_UT_MTR_Station_Data_with_Line_Names.csv");
                const stationCsv = await stationResponse.text();
                const stationResults = Papa.parse(stationCsv, { header: true });
                const stationsData = stationResults.data
                    .map((station) => ({
                        name: station["English Name"],
                        line: station["Line Name"],
                        lat: parseFloat(station.latitude),
                        lng: parseFloat(station.longitude),
                    }))
                    .filter((s) => !isNaN(s.lat) && !isNaN(s.lng));
                setStations(stationsData);

                const uniqueLines = [...new Set(stationsData.map((s) => s.line))];
                const allLines = Object.fromEntries(uniqueLines.map((line) => [line, true]));
                setLines(allLines);
                setToggledLines(Object.fromEntries(uniqueLines.map((line) => [line, line === "East Rail Line"])));

                const buildingResponse = await fetch("/building_list_with_coords.csv");
                const buildingCsv = await buildingResponse.text();
                const buildingResults = Papa.parse(buildingCsv, { header: true });
                const buildingsData = buildingResults.data
                    .map((building) => ({
                        name: building["Building name"],
                        lat: parseFloat(building.Latitude),
                        lng: parseFloat(building.Longitude),
                        lastVisit: building["Last date of visit of the case(s)"],
                    }))
                    .filter((b) => !isNaN(b.lat) && !isNaN(b.lng));
                setBuildings(buildingsData);
            } catch (error) {
                console.error("Error loading map data:", error);
            }
        }
        loadMapData();
    }, []);

    // Load hospital and pharmacy data
    useEffect(() => {
        fetch("/facility-hosp.json")
            .then((response) => response.json())
            .then((data) => {
                const formattedHospitals = data.map((item: any, index: number) => ({
                    id: `hospital-${index}`,
                    position: { lat: item.latitude, lng: item.longitude },
                    type: "hospital",
                    name: item.institution_eng,
                    address: item.address_eng,
                    withAE: item.with_AE_service_eng,
                    inventory: { masks: "In Stock", testKits: "In Stock", medicines: "Low Stock", sanitizers: "In Stock" },
                }));
                setHospitals(formattedHospitals);
            })
            .catch((error) => console.error("Error loading hospitals:", error));

        fetch("/Pharmacy_List_with_coords.csv")
            .then((response) => response.text())
            .then((csvData) => {
                const results = Papa.parse(csvData, { header: true });
                const formattedPharmacies = results.data.map((item: any, index: number) => ({
                    id: `pharmacy-${index}`,
                    position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) },
                    type: "pharmacy",
                    name: item["Company Name"],
                    address: item["Company Address"],
                    district: item["District"],
                    telephone: item["Telephone Number"],
                    inventory: { masks: "Low Stock", testKits: "In Stock", medicines: "In Stock", sanitizers: "Low Stock" },
                }));
                setPharmacies(formattedPharmacies);
            })
            .catch((error) => console.error("Error loading pharmacies:", error));
    }, []);

    const medicalServices = useMemo(() => {
        return [...hospitals, ...pharmacies];
    }, [hospitals, pharmacies]);

    const filteredMedicalServices = useMemo(() => {
        return medicalServices.filter((service) => {
            if (!selectedServiceTypes.includes(service.type)) return false;
            const activeInventoryFilters = Object.entries(inventoryFilters).filter(([_, active]) => active);
            if (activeInventoryFilters.length > 0) {
                if (!service.inventory) return false;
                for (const [item, active] of activeInventoryFilters) {
                    if (active && service.inventory[item] !== "In Stock") {
                        return false;
                    }
                }
            }
            const distanceToService = haversineDistance(
                [currentLocationStatic.lat, currentLocationStatic.lng],
                [service.position.lat, service.position.lng]
            );
            if (distanceToService > distanceFilter) return false;
            return true;
        });
    }, [medicalServices, selectedServiceTypes, inventoryFilters, distanceFilter]);

    const filteredBuildings = useMemo(() => {
        return timePeriod === "24h"
            ? buildings.filter((b) => b.lastVisit === "28/12/2022")
            : buildings;
    }, [timePeriod, buildings]);

    const activeStations = useMemo(() => {
        const activeLines = Object.entries(toggledLines)
            .filter(([_, toggled]) => toggled)
            .map(([line]) => line);
        return stations.filter((station) => activeLines.includes(station.line));
    }, [toggledLines, stations]);

    const effectiveThreshold = useMemo(() => (DISTANCE_THRESHOLD_KM * riskLevel) / 3, [riskLevel]);

    const filteredDangerousBuildings = useMemo(() => {
        if (activeStations.length === 0 || filteredBuildings.length === 0) return [];
        return filteredBuildings
            .map((building) => {
                let nearestStation = null;
                let minDistance = Infinity;
                activeStations.forEach((station) => {
                    const distance = haversineDistance([station.lat, station.lng], [building.lat, building.lng]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestStation = station;
                    }
                });
                return minDistance <= effectiveThreshold
                    ? {
                        ...building,
                        color: nearestStation ? MTR_LINE_COLORS[nearestStation.line] : "#FF0000",
                    }
                    : null;
            })
            .filter((building) => building !== null);
    }, [activeStations, filteredBuildings, effectiveThreshold]);

    // -------------------------------
    // Safe Navigation: Get current location via Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    const formatted = `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
                    setCurrentLocation(formatted);
                    setOrigin(formatted);
                },
                () => {
                    setCurrentLocation("Unable to retrieve your location");
                }
            );
        } else {
            setCurrentLocation("Geolocation is not supported by your browser");
        }
    }, []);

    const calculateRoute = useCallback(() => {
        if (!origin || !destination) return;

        setLoading(true);
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);
                    setDistance(result.routes[0].legs[0].distance?.text || "");
                    setDuration(result.routes[0].legs[0].duration?.text || "");
                    setRouteCalculated(true);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
                setLoading(false);
            }
        );
    }, [origin, destination]);
    // -------------------------------

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Shield className="h-6 w-6 text-primary" />
                        <span>PandemicSafe HK</span>
                    </Link>
                    <nav className="ml-auto flex gap-4 sm:gap-6">
                        <Link href="/risk-calculator" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Risk Calculator
                        </Link>
                        <Link href="/map" className="text-sm font-medium hover:text-primary">
                            Risk Map
                        </Link>
                        {/* The navigation page is no longer used */}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="container px-4 py-6 md:px-6 md:py-8">
                    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                        <div className="space-y-4">
                            {/* Map Title & Tabs */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {mapView === "risk" ? "Hong Kong MTR Risk Map" : "Hong Kong Medical Services"}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {mapView === "risk"
                                            ? "View potential risk zones based on MTR stations proximity"
                                            : "View real-time medical services availability in Hong Kong"}
                                    </p>
                                </div>
                                <Tabs
                                    defaultValue="risk"
                                    className="w-full sm:w-auto"
                                    onValueChange={(value) => setMapView(value as "risk" | "medical")}
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="risk">Risk Map</TabsTrigger>
                                        <TabsTrigger value="medical">Medical Services</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Map Container */}
                            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                                {loadError && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                                            <p className="mt-2 text-sm text-muted-foreground">Error loading Google Maps</p>
                                            <p className="text-xs text-muted-foreground">
                                                Please check your API key and try again
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {!isLoaded && !loadError && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                            <p className="text-sm text-muted-foreground">Loading map data...</p>
                                        </div>
                                    </div>
                                )}
                                {isLoaded && (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={mapCenter}
                                        zoom={12}
                                        options={options}
                                        onLoad={onMapLoad}
                                        onUnmount={onMapUnmount}
                                    >
                                        {mapView === "risk" && (
                                            <>
                                                {showStations &&
                                                    activeStations.map((station, index) => (
                                                        <Marker
                                                            key={`station-${index}`}
                                                            position={{ lat: station.lat, lng: station.lng }}
                                                            icon={{
                                                                path: google.maps.SymbolPath.CIRCLE,
                                                                scale: 6,
                                                                fillColor: MTR_LINE_COLORS[station.line],
                                                                fillOpacity: 1,
                                                                strokeWeight: 1,
                                                                strokeColor: "#ffffff",
                                                            }}
                                                        />
                                                    ))}
                                                {heatMapMode ? (
                                                    <HeatmapLayer
                                                        data={
                                                            globalRiskHeatmap
                                                                ? filteredBuildings.map((b) => new google.maps.LatLng(b.lat, b.lng))
                                                                : filteredDangerousBuildings.map((b) => new google.maps.LatLng(b.lat, b.lng))
                                                        }
                                                    />
                                                ) : (
                                                    filteredDangerousBuildings.map((building, index) => (
                                                        <Marker
                                                            key={`building-${index}`}
                                                            position={{ lat: building.lat, lng: building.lng }}
                                                            icon={{
                                                                path: google.maps.SymbolPath.CIRCLE,
                                                                scale: 6,
                                                                fillColor: building.color,
                                                                fillOpacity: 1,
                                                                strokeWeight: 1,
                                                                strokeColor: "#ffffff",
                                                            }}
                                                        />
                                                    ))
                                                )}
                                            </>
                                        )}
                                        {mapView === "medical" &&
                                            filteredMedicalServices.map((service) => (
                                                <Marker
                                                    key={service.id}
                                                    position={service.position}
                                                    icon={{
                                                        url:
                                                            service.type === "pharmacy"
                                                                ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                                                : service.type === "hospital"
                                                                    ? "https://maps.google.com/mapfiles/ms/icons/purple-dot.png"
                                                                    : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                                        scaledSize: new window.google.maps.Size(32, 32),
                                                    }}
                                                    onClick={() => setSelectedMarker({ ...service, type: "medical" })}
                                                />
                                            ))}
                                        {directions && (
                                            <DirectionsRenderer
                                                directions={directions}
                                                options={{
                                                    polylineOptions: {
                                                        strokeColor: "#3b82f6",
                                                        strokeWeight: 6,
                                                        strokeOpacity: 0.8,
                                                    },
                                                }}
                                            />
                                        )}
                                        {selectedMarker && (
                                            <InfoWindow position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
                                                <div className="p-1">
                                                    {selectedMarker.type === "medical" && (
                                                        <div>
                                                            <h3 className="font-medium text-sm">{selectedMarker.name}</h3>
                                                            <p className="text-xs text-muted-foreground capitalize">{selectedMarker.type}</p>
                                                            {selectedMarker.address && <p className="text-xs">{selectedMarker.address}</p>}
                                                            {selectedMarker.telephone && <p className="text-xs">Tel: {selectedMarker.telephone}</p>}
                                                            {selectedMarker.withAE && <p className="text-xs">AE Service: {selectedMarker.withAE}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </GoogleMap>
                                )}
                            </div>

                            {/* Bottom Cards */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Current Location</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Sha Tin, New Territories</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Local Risk Level</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={riskLevel > 3 ? "destructive" : riskLevel > 1 ? "default" : "outline"}>
                                                {riskLevel > 3 ? "High" : riskLevel > 1 ? "Moderate" : "Low"}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">Updated 15 min ago</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Nearby Services</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">
                                                {filteredMedicalServices.filter((s) => s.type === "pharmacy").length} Pharmacies,{" "}
                                            </span>
                                            <span className="text-sm">
                                                {filteredMedicalServices.filter((s) => s.type === "hospital").length} Hospitals
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Right Side: Filter Options and Safe Navigation Cards */}
                        <div className="space-y-6">
                            {/* Filter Options Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Filter Options</CardTitle>
                                    <CardDescription>Customize your map view</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {mapView === "risk" ? (
                                        <>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Risk Level</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-muted-foreground">Low</span>
                                                    <Slider
                                                        value={[riskLevel]}
                                                        max={5}
                                                        min={1}
                                                        step={1}
                                                        onValueChange={(value) => setRiskLevel(value[0])}
                                                    />
                                                    <span className="text-xs text-muted-foreground">High</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Data Source</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button variant="outline" size="sm" className="bg-primary text-white">
                                                        <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                                                        Official Data
                                                    </Button>
                                                    <Button variant="outline" size="sm" disabled>
                                                        <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                                                        User Reports
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Time Period</h3>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setTimePeriod("24h")}
                                                        className={timePeriod === "24h" ? "bg-primary text-white" : ""}
                                                    >
                                                        24h
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setTimePeriod("7d")}
                                                        className={timePeriod === "7d" ? "bg-primary text-white" : ""}
                                                    >
                                                        7d
                                                    </Button>
                                                    <Button variant="outline" size="sm" disabled>
                                                        30d
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Display Mode</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">Absolute</span>
                                                    <Switch checked={heatMapMode} onCheckedChange={setHeatMapMode} />
                                                    <span className="text-xs">Heat Map</span>
                                                </div>
                                            </div>
                                            {heatMapMode && (
                                                <div className="space-y-2">
                                                    <h3 className="text-sm font-medium">Heatmap Type</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">Local Risk</span>
                                                        <Switch checked={globalRiskHeatmap} onCheckedChange={setGlobalRiskHeatmap} />
                                                        <span className="text-xs">Global Risk</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Display Stations</h3>
                                                <div className="flex items-center gap-2">
                                                    <Switch checked={showStations} onCheckedChange={setShowStations} />
                                                    <span className="text-xs">{showStations ? "Show Stations" : "Hide Stations"}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">MTR Map Controls</h3>
                                                <div className="space-y-1">
                                                    {Object.keys(lines).map((line) => (
                                                        <label key={line} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={toggledLines[line] ?? false}
                                                                onCheckedChange={(checked) => {
                                                                    setToggledLines((prev) => ({ ...prev, [line]: checked }));
                                                                }}
                                                                style={{ accentColor: MTR_LINE_COLORS[line] }}
                                                            />
                                                            <span style={{ color: MTR_LINE_COLORS[line] }} className="text-xs">
                                                                {line}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Service Type</h3>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="justify-start"
                                                        onClick={() => {
                                                            setSelectedServiceTypes((prev) =>
                                                                prev.includes("pharmacy")
                                                                    ? prev.filter((s) => s !== "pharmacy")
                                                                    : [...prev, "pharmacy"]
                                                            );
                                                        }}
                                                        style={{
                                                            backgroundColor: selectedServiceTypes.includes("pharmacy") ? "#2563eb" : undefined,
                                                            color: selectedServiceTypes.includes("pharmacy") ? "#fff" : undefined,
                                                        }}
                                                    >
                                                        <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                                                        Pharmacies
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="justify-start"
                                                        onClick={() => {
                                                            setSelectedServiceTypes((prev) =>
                                                                prev.includes("hospital")
                                                                    ? prev.filter((s) => s !== "hospital")
                                                                    : [...prev, "hospital"]
                                                            );
                                                        }}
                                                        style={{
                                                            backgroundColor: selectedServiceTypes.includes("hospital") ? "#2563eb" : undefined,
                                                            color: selectedServiceTypes.includes("hospital") ? "#fff" : undefined,
                                                        }}
                                                    >
                                                        <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                                                        Hospitals
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Inventory Filter</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["masks", "testKits", "medicines", "sanitizers"].map((item) => (
                                                        <Button
                                                            key={item}
                                                            variant="outline"
                                                            size="sm"
                                                            className="justify-start"
                                                            onClick={() =>
                                                                setInventoryFilters((prev) => ({
                                                                    ...prev,
                                                                    [item]: !prev[item as keyof typeof inventoryFilters],
                                                                }))
                                                            }
                                                            style={{
                                                                backgroundColor: inventoryFilters[item as keyof typeof inventoryFilters]
                                                                    ? "#2563eb"
                                                                    : undefined,
                                                                color: inventoryFilters[item as keyof typeof inventoryFilters]
                                                                    ? "#fff"
                                                                    : undefined,
                                                            }}
                                                        >
                                                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Distance (km)</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-muted-foreground">Near</span>
                                                    <Slider
                                                        value={[distanceFilter]}
                                                        max={10}
                                                        min={1}
                                                        step={1}
                                                        onValueChange={(value) => setDistanceFilter(value[0])}
                                                    />
                                                    <span className="text-xs text-muted-foreground">Far</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
<PlanRoutePage />          {routeCalculated && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Route Summary</CardTitle>
                                        <CardDescription>Overview of your journey in Hong Kong</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <div className="text-sm">
                                                    <p className="font-medium">From</p>
                                                    <p className="text-muted-foreground">{origin}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <div className="text-sm">
                                                    <p className="font-medium">To</p>
                                                    <p className="text-muted-foreground">{destination}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-md bg-muted p-4">
                                            <h3 className="mb-2 text-sm font-medium">Safety Information</h3>
                                            <ul className="space-y-1 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                    <span>Route avoids known high-risk zones in Hong Kong</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Badge variant="outline" className="h-2 w-2 rounded-full p-0" />
                                                    <span>Passes by pharmacies with supplies</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Badge variant="outline" className="h-2 w-2 rounded-full p-0" />
                                                    <span>Overall risk level: Low to Moderate</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full" onClick={() => window.print()}>
                                            Save Route
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Safety Tips for Hong Kong</CardTitle>
                                    <CardDescription>Stay safe during your journey</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center">1</Badge>
                                            <span>Wear a mask in public spaces, especially in moderate to high-risk areas</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center">2</Badge>
                                            <span>Maintain physical distance from others when possible</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center">3</Badge>
                                            <span>Use hand sanitizer after touching public surfaces</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Badge className="mt-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center">4</Badge>
                                            <span>
                                                Check for updates on risk zones in different Hong Kong districts before starting your journey
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
