"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, MapPin, AlertTriangle, Info } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from "@react-google-maps/api"
import { googleMapsConfig, mapCenter } from "@/lib/googleMapsConfig"

// Mock data for risk zones
const riskZones = [
  { id: 1, position: { lat: 22.419722, lng: 114.206792 }, risk: "high", radius: 1000 },
  { id: 2, position: { lat: 22.429722, lng: 114.216792 }, risk: "high", radius: 800 },
  { id: 3, position: { lat: 22.409722, lng: 114.196792 }, risk: "moderate", radius: 1200 },
  { id: 4, position: { lat: 22.439722, lng: 114.226792 }, risk: "low", radius: 1500 },
]

// Mock data for medical services
const medicalServices = [
  {
    id: 1,
    position: { lat: 22.422722, lng: 114.209792 },
    type: "pharmacy",
    name: "University Health Centre Pharmacy",
    inventory: { masks: "In Stock", testKits: "In Stock" },
  },
  {
    id: 2,
    position: { lat: 22.432722, lng: 114.219792 },
    type: "pharmacy",
    name: "Sha Tin Watson's Pharmacy",
    inventory: { masks: "In Stock", testKits: "Low Stock" },
  },
  {
    id: 3,
    position: { lat: 22.412722, lng: 114.199792 },
    type: "hospital",
    name: "Prince of Wales Hospital",
    inventory: { masks: "In Stock", testKits: "In Stock" },
  },
  {
    id: 4,
    position: { lat: 22.442722, lng: 114.229792 },
    type: "testing",
    name: "Community Testing Centre",
    inventory: { testKits: "In Stock" },
  },
]

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const options = {
  disableDefaultUI: true,
  zoomControl: true,
}

export default function RiskMap() {
  const [mapView, setMapView] = useState<"risk" | "medical">("risk")
  const [riskLevel, setRiskLevel] = useState(3) // 1-5 scale
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader(googleMapsConfig)

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onMapUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  // Filter risk zones based on risk level
  const filteredRiskZones = riskZones.filter((zone) => {
    if (zone.risk === "high" && riskLevel >= 4) return true
    if (zone.risk === "moderate" && riskLevel >= 2) return true
    if (zone.risk === "low" && riskLevel >= 1) return true
    return false
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>PandemicSafe HK</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="/risk-calculator"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Risk Calculator
            </Link>
            <Link
              href="/medical-services"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Medical Services
            </Link>
            <Link href="/map" className="text-sm font-medium transition-colors hover:text-primary">
              Risk Map
            </Link>
            <Link
              href="/navigation"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Safe Navigation
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Hong Kong Risk Map</h1>
                  <p className="text-muted-foreground">View real-time infection hotspots and safe zones in Hong Kong</p>
                </div>
                <Tabs
                  defaultValue="risk"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => setMapView(value as "risk" | "medical")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="risk">Risk Zones</TabsTrigger>
                    <TabsTrigger value="medical">Medical Services</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                {loadError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                      <p className="mt-2 text-sm text-muted-foreground">Error loading Google Maps</p>
                      <p className="text-xs text-muted-foreground">Please check your API key and try again</p>
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
                  <div className="h-full w-full">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={14}
                      options={options}
                      onLoad={onMapLoad}
                      onUnmount={onMapUnmount}
                    >
                      {/* Risk Zones */}
                      {mapView === "risk" &&
                        filteredRiskZones.map((zone) => (
                          <Circle
                            key={zone.id}
                            center={zone.position}
                            radius={zone.radius}
                            options={{
                              strokeColor:
                                zone.risk === "high" ? "#ef4444" : zone.risk === "moderate" ? "#eab308" : "#22c55e",
                              strokeOpacity: 0.8,
                              strokeWeight: 2,
                              fillColor:
                                zone.risk === "high" ? "#ef4444" : zone.risk === "moderate" ? "#eab308" : "#22c55e",
                              fillOpacity: 0.35,
                            }}
                            onClick={() => setSelectedMarker({ ...zone, type: "risk" })}
                          />
                        ))}

                      {/* Medical Services */}
                      {mapView === "medical" &&
                        medicalServices.map((service) => (
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

                      {/* Info Windows */}
                      {selectedMarker && (
                        <InfoWindow position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
                          <div className="p-1">
                            {selectedMarker.type === "risk" ? (
                              <div>
                                <h3 className="font-medium text-sm">
                                  {selectedMarker.risk === "high"
                                    ? "High Risk Zone"
                                    : selectedMarker.risk === "moderate"
                                      ? "Moderate Risk Zone"
                                      : "Low Risk Zone"}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Radius: {(selectedMarker.radius / 1000).toFixed(1)} km
                                </p>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-sm">{selectedMarker.name}</h3>
                                <p className="text-xs text-muted-foreground capitalize">{selectedMarker.type}</p>
                                {selectedMarker.inventory && (
                                  <div className="mt-1 text-xs">
                                    {selectedMarker.inventory.masks && <p>Masks: {selectedMarker.inventory.masks}</p>}
                                    {selectedMarker.inventory.testKits && (
                                      <p>Test Kits: {selectedMarker.inventory.testKits}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>

                    {/* Map Overlay Elements */}
                    {mapView === "risk" && (
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 backdrop-blur">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">
                          {filteredRiskZones.filter((z) => z.risk === "high").length} high-risk zones detected
                        </span>
                      </div>
                    )}

                    {mapView === "medical" && (
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 backdrop-blur">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {medicalServices.filter((s) => s.type === "pharmacy").length} pharmacies nearby
                        </span>
                      </div>
                    )}

                    {/* Map Legend */}
                    <div className="absolute bottom-4 right-4 rounded-md bg-background/90 p-3 backdrop-blur">
                      <h3 className="mb-2 text-sm font-medium">Map Legend</h3>
                      <div className="space-y-2">
                        {mapView === "risk" ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-red-500"></div>
                              <span className="text-xs">High Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                              <span className="text-xs">Moderate Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <span className="text-xs">Low Risk</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                              <span className="text-xs">Pharmacy</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                              <span className="text-xs">Hospital</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                              <span className="text-xs">Testing Centre</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                        {medicalServices.filter((s) => s.type === "pharmacy").length} Pharmacies,{" "}
                        {medicalServices.filter((s) => s.type === "testing").length} Testing Centres
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
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
                            defaultValue={[riskLevel]}
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
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Official Data
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            User Reports
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Time Period</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm">
                            24h
                          </Button>
                          <Button variant="outline" size="sm">
                            7d
                          </Button>
                          <Button variant="outline" size="sm">
                            30d
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Service Type</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Pharmacies
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Testing Centres
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Hospitals
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Inventory Filter</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Masks
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Test Kits
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Medicines
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Badge className="mr-2 h-2 w-2 rounded-full bg-primary p-0" />
                            Sanitizers
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Distance</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground">Near</span>
                          <Slider defaultValue={[5]} max={10} min={1} step={1} />
                          <span className="text-xs text-muted-foreground">Far</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>Latest information in your area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        15m ago
                      </Badge>
                      <h3 className="text-sm font-medium">New High-Risk Zone</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A new high-risk zone has been identified in Sha Tin District.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        1h ago
                      </Badge>
                      <h3 className="text-sm font-medium">Pharmacy Restock</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      University Health Centre Pharmacy has restocked masks and test kits.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        3h ago
                      </Badge>
                      <h3 className="text-sm font-medium">Risk Level Change</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tai Po District risk level has decreased from high to moderate.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Link href="/navigation">
                <Button className="w-full">Plan Safe Route</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

