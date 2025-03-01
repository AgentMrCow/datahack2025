"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, Search, MapPin, Phone, Clock, ExternalLink, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock pharmacy data
const pharmacies = [
  {
    id: 1,
    name: "Central Pharmacy",
    address: "123 Main St, Downtown",
    distance: "0.5 miles",
    phone: "555-123-4567",
    hours: "8:00 AM - 10:00 PM",
    inventory: {
      masks: "In Stock",
      testKits: "In Stock",
      medicines: "In Stock",
      sanitizers: "In Stock",
    },
  },
  {
    id: 2,
    name: "HealthPlus Pharmacy",
    address: "456 Oak Ave, Westside",
    distance: "1.2 miles",
    phone: "555-987-6543",
    hours: "24 Hours",
    inventory: {
      masks: "In Stock",
      testKits: "Low Stock",
      medicines: "In Stock",
      sanitizers: "In Stock",
    },
  },
  {
    id: 3,
    name: "QuickMed Pharmacy",
    address: "789 Pine St, Northside",
    distance: "1.8 miles",
    phone: "555-456-7890",
    hours: "9:00 AM - 9:00 PM",
    inventory: {
      masks: "Out of Stock",
      testKits: "In Stock",
      medicines: "In Stock",
      sanitizers: "Low Stock",
    },
  },
  {
    id: 4,
    name: "Community Health Pharmacy",
    address: "321 Elm St, Eastside",
    distance: "2.3 miles",
    phone: "555-789-0123",
    hours: "8:00 AM - 8:00 PM",
    inventory: {
      masks: "In Stock",
      testKits: "In Stock",
      medicines: "Low Stock",
      sanitizers: "In Stock",
    },
  },
]

// Mock telemedicine providers
const telemedicineProviders = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    availability: "Available Now",
    price: "$45",
    rating: "4.9",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Infectious Disease",
    availability: "Available in 15 min",
    price: "$60",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pulmonologist",
    availability: "Available in 30 min",
    price: "$55",
    rating: "4.7",
  },
]

export default function MedicalServices() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("pharmacies")
  const [selectedPharmacy, setSelectedPharmacy] = useState<(typeof pharmacies)[0] | null>(null)

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredProviders = telemedicineProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>PandemicSafe</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="/risk-calculator"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Risk Calculator
            </Link>
            <Link href="/medical-services" className="text-sm font-medium transition-colors hover:text-primary">
              Medical Services
            </Link>
            <Link
              href="/map"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
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
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Medical Services</h1>
              <p className="text-muted-foreground">
                Find nearby pharmacies, medical supplies, and telemedicine services
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or service..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="pharmacies" onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pharmacies">Pharmacies & Supplies</TabsTrigger>
                <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
              </TabsList>

              <TabsContent value="pharmacies" className="space-y-4 pt-4">
                {filteredPharmacies.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">No pharmacies found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPharmacies.map((pharmacy) => (
                      <Card key={pharmacy.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <CardTitle>{pharmacy.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {pharmacy.address}
                          </CardDescription>
                          <Badge variant="outline" className="absolute right-4 top-4">
                            {pharmacy.distance}
                          </Badge>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Masks:</span>
                              <Badge
                                variant={
                                  pharmacy.inventory.masks === "In Stock"
                                    ? "outline"
                                    : pharmacy.inventory.masks === "Low Stock"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {pharmacy.inventory.masks}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Test Kits:</span>
                              <Badge
                                variant={
                                  pharmacy.inventory.testKits === "In Stock"
                                    ? "outline"
                                    : pharmacy.inventory.testKits === "Low Stock"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {pharmacy.inventory.testKits}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Medicines:</span>
                              <Badge
                                variant={
                                  pharmacy.inventory.medicines === "In Stock"
                                    ? "outline"
                                    : pharmacy.inventory.medicines === "Low Stock"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {pharmacy.inventory.medicines}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Sanitizers:</span>
                              <Badge
                                variant={
                                  pharmacy.inventory.sanitizers === "In Stock"
                                    ? "outline"
                                    : pharmacy.inventory.sanitizers === "Low Stock"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {pharmacy.inventory.sanitizers}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setSelectedPharmacy(pharmacy)}
                          >
                            <Phone className="h-4 w-4" /> Contact
                          </Button>
                          <Link href={`/navigation?destination=${encodeURIComponent(pharmacy.address)}`}>
                            <Button size="sm" className="gap-1">
                              <MapPin className="h-4 w-4" /> Directions
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="telemedicine" className="space-y-4 pt-4">
                {filteredProviders.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">No providers found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProviders.map((provider) => (
                      <Card key={provider.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{provider.name}</CardTitle>
                            <Badge
                              variant={provider.availability.includes("Now") ? "outline" : "default"}
                              className="text-xs"
                            >
                              {provider.availability}
                            </Badge>
                          </div>
                          <CardDescription>{provider.specialty}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Price:</span> {provider.price}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Rating:</span> {provider.rating}/5
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full gap-1">
                                <Video className="h-4 w-4" /> Start Consultation
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Start Telemedicine Consultation</DialogTitle>
                                <DialogDescription>
                                  You're about to start a video consultation with {provider.name}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-16 w-16 rounded-full bg-muted"></div>
                                  <div>
                                    <h3 className="font-medium">{provider.name}</h3>
                                    <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                                  </div>
                                </div>
                                <div className="rounded-md bg-muted p-4 text-sm">
                                  <p className="font-medium">Consultation Details:</p>
                                  <ul className="mt-2 space-y-1">
                                    <li>• Price: {provider.price} for 15 minutes</li>
                                    <li>• Available now for immediate consultation</li>
                                    <li>• Secure, HIPAA-compliant video platform</li>
                                  </ul>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>Proceed to Payment</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Pharmacy Details Dialog */}
      {selectedPharmacy && (
        <Dialog open={!!selectedPharmacy} onOpenChange={(open) => !open && setSelectedPharmacy(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPharmacy.name}</DialogTitle>
              <DialogDescription>{selectedPharmacy.address}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedPharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedPharmacy.hours}</span>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Current Inventory</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Masks</span>
                    <Badge
                      variant={
                        selectedPharmacy.inventory.masks === "In Stock"
                          ? "outline"
                          : selectedPharmacy.inventory.masks === "Low Stock"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {selectedPharmacy.inventory.masks}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Test Kits</span>
                    <Badge
                      variant={
                        selectedPharmacy.inventory.testKits === "In Stock"
                          ? "outline"
                          : selectedPharmacy.inventory.testKits === "Low Stock"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {selectedPharmacy.inventory.testKits}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Medicines</span>
                    <Badge
                      variant={
                        selectedPharmacy.inventory.medicines === "In Stock"
                          ? "outline"
                          : selectedPharmacy.inventory.medicines === "Low Stock"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {selectedPharmacy.inventory.medicines}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sanitizers</span>
                    <Badge
                      variant={
                        selectedPharmacy.inventory.sanitizers === "In Stock"
                          ? "outline"
                          : selectedPharmacy.inventory.sanitizers === "Low Stock"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {selectedPharmacy.inventory.sanitizers}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="sm:w-auto w-full gap-1">
                <ExternalLink className="h-4 w-4" /> Visit Website
              </Button>
              <Link
                href={`/navigation?destination=${encodeURIComponent(selectedPharmacy.address)}`}
                className="sm:w-auto w-full"
              >
                <Button className="w-full gap-1">
                  <MapPin className="h-4 w-4" /> Get Directions
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

