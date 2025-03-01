"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, MapPin, AlertTriangle, LocateFixed, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api"
import { googleMapsConfig, mapCenter } from "@/lib/googleMapsConfig"

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const options = {
  disableDefaultUI: true,
  zoomControl: true,
}

// **Wrap useSearchParams in a Suspense component**
function DestinationInput({ setDestination }: { setDestination: (value: string) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    setDestination(searchParams.get("destination") || "");
  }, [searchParams]);

  return null;
}

export default function SafeNavigation() {
  const [destination, setDestination] = useState("");

  return (
    <Suspense fallback={<div>Loading search params...</div>}>
      <DestinationInput setDestination={setDestination} />
      <NavigationComponent destination={destination} setDestination={setDestination} />
    </Suspense>
  );
}

function NavigationComponent({ destination, setDestination }: { destination: string, setDestination: (value: string) => void }) {
  const [origin, setOrigin] = useState("")
  const [routeCalculated, setRouteCalculated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("Detecting your location...")
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")

  const mapRef = useRef<google.maps.Map | null>(null)
  const originRef = useRef<HTMLInputElement | null>(null)
  const destinationRef = useRef<HTMLInputElement | null>(null)

  const { isLoaded, loadError } = useJsApiLoader(googleMapsConfig)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`)
          setOrigin(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`)
        },
        () => {
          setCurrentLocation("Unable to retrieve your location")
        },
      )
    } else {
      setCurrentLocation("Geolocation is not supported by your browser")
    }
  }, [])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const calculateRoute = useCallback(() => {
    if (!origin || !destination) return

    setLoading(true)
    const directionsService = new google.maps.DirectionsService()
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
          setDistance(result.routes[0].legs[0].distance?.text || "")
          setDuration(result.routes[0].legs[0].duration?.text || "")
          setRouteCalculated(true)
        } else {
          console.error(`error fetching directions ${result}`)
        }
        setLoading(false)
      },
    )
  }, [origin, destination])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading...</div>

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
            <Link
              href="/map"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Risk Map
            </Link>
            <Link href="/navigation" className="text-sm font-medium transition-colors hover:text-primary">
              Safe Navigation
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Safe Navigation in Hong Kong</h1>
                <p className="text-muted-foreground">Plan routes that avoid high-risk areas in Hong Kong</p>
              </div>

              <div className="relative overflow-hidden rounded-lg border">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                  options={options}
                  onLoad={onMapLoad}
                >
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
                </GoogleMap>

                {/* Map Legend */}
                <div className="absolute bottom-4 right-4 rounded-md bg-background/90 p-3 backdrop-blur">
                  <h3 className="mb-2 text-sm font-medium">Route Legend</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-blue-500"></div>
                      <span className="text-xs">Safe Route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                      <span className="text-xs">High Risk Zone</span>
                    </div>
                  </div>
                </div>
              </div>

              {routeCalculated && (
                <Card>
                  <CardHeader>
                    <CardTitle>Turn-by-Turn Directions</CardTitle>
                    <CardDescription>Follow these directions for the safest route</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {directions?.routes[0].legs[0].steps.map((step, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2">
                          <Badge className="h-6 w-6 rounded-full">{index + 1}</Badge>
                          <span dangerouslySetInnerHTML={{ __html: step.instructions || "" }}></span>
                        </div>
                        {index < directions.routes[0].legs[0].steps.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Total Distance:</span> {distance}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">ETA:</span> {duration}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plan Your Route</CardTitle>
                  <CardDescription>We'll find the safest path to your destination in Hong Kong</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Starting Point</label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter starting location"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        ref={originRef}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setOrigin(currentLocation)}
                        title="Use current location"
                      >
                        <LocateFixed className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Current location: {currentLocation}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <Input
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      ref={destinationRef}
                    />
                  </div>

                  <Button className="w-full" onClick={calculateRoute} disabled={!origin || !destination || loading}>
                    {loading ? "Calculating..." : "Find Safe Route"}
                  </Button>
                </CardContent>
              </Card>

              {routeCalculated && (
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
  )
}

