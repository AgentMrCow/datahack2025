"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  HelpCircle,
  Home,
  Map,
  MapPin,
  Menu,
  Package,
  PieChart,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// **Updated HK Data**
const caseData = [
  { name: "Jan", cases: 3200, recovered: 2700, deaths: 50 },
  { name: "Feb", cases: 4100, recovered: 3100, deaths: 60 },
  { name: "Mar", cases: 2900, recovered: 3300, deaths: 30 },
  { name: "Apr", cases: 2100, recovered: 3500, deaths: 25 },
  { name: "May", cases: 1800, recovered: 3000, deaths: 20 },
  { name: "Jun", cases: 2500, recovered: 3200, deaths: 15 },
  { name: "Jul", cases: 3900, recovered: 4100, deaths: 40 },
]

const resourceData = [
  { name: "Central & Western", masks: 5000, vaccines: 3000, tests: 2800 },
  { name: "Kowloon City", masks: 4200, vaccines: 2700, tests: 2500 },
  { name: "Yau Tsim Mong", masks: 3800, vaccines: 3100, tests: 2400 },
  { name: "Sha Tin", masks: 3500, vaccines: 2900, tests: 2300 },
  { name: "Tuen Mun", masks: 3200, vaccines: 2800, tests: 2200 },
]

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div
        className={`bg-background border-r ${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 hidden md:block`}
      >
        <div className="flex h-16 items-center border-b px-4">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className={`ml-2 text-xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}>Pandemic Portal</h1>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="py-4">
          <nav className="grid gap-1 px-2">
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary">
              <Home className="h-5 w-5" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Activity className="h-5 w-5" />
              {isSidebarOpen && <span>Case Monitoring</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Package className="h-5 w-5" />
              {isSidebarOpen && <span>Resources</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Map className="h-5 w-5" />
              {isSidebarOpen && <span>District Map</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Users className="h-5 w-5" />
              {isSidebarOpen && <span>Population Data</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <BarChart3 className="h-5 w-5" />
              {isSidebarOpen && <span>Statistics</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <FileText className="h-5 w-5" />
              {isSidebarOpen && <span>Reports</span>}
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="rounded-full shadow-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background md:hidden">
          <div className="flex h-16 items-center border-b px-4">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="ml-2 text-xl font-bold">Pandemic Portal</h1>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarOpen(false)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="py-4">
            <nav className="grid gap-1 px-2">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Activity className="h-5 w-5" />
                <span>Case Monitoring</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Package className="h-5 w-5" />
                <span>Resource Management</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Map className="h-5 w-5" />
                <span>Geographic Data</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Population Data</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <h1 className="text-lg font-semibold md:text-xl">Pandemic Government Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Last 7 days</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Custom range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download report</span>
            </Button>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Cases</CardTitle>
              <CardDescription>Hong Kong cumulative cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234,567</div>
              <p className="text-xs text-muted-foreground">+2,345 from yesterday</p>
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseData}>
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="cases" stroke="#0284c7" fillOpacity={1} fill="url(#colorCases)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active Cases</CardTitle>
              <CardDescription>Currently infected patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234,567</div>
              <p className="text-xs text-muted-foreground">-1,234 from yesterday</p>
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseData}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="cases" stroke="#f59e0b" fillOpacity={1} fill="url(#colorActive)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recovered</CardTitle>
              <CardDescription>Total recovered patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">987,654</div>
              <p className="text-xs text-muted-foreground">+3,456 from yesterday</p>
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseData}>
                    <defs>
                      <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="recovered"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRecovered)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Deaths</CardTitle>
              <CardDescription>Total fatalities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12,346</div>
              <p className="text-xs text-muted-foreground">+123 from yesterday</p>
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseData}>
                    <defs>
                      <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="deaths" stroke="#ef4444" fillOpacity={1} fill="url(#colorDeaths)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Vaccination Rate</CardTitle>
              <CardDescription>Percentage of population vaccinated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">+0.3% from yesterday</p>
              <div className="mt-4">
                <Progress value={78.5} className="h-2" />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <div>0%</div>
                  <div>50%</div>
                  <div>100%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resource Status</CardTitle>
              <CardDescription>Critical supplies inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Masks</div>
                    <div className="font-medium">3.2M units</div>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Vaccines</div>
                    <div className="font-medium">1.5M doses</div>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Test Kits</div>
                    <div className="font-medium">2.8M units</div>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert card */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 col-span-full">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <CardTitle className="text-base text-red-700 dark:text-red-400">Critical Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-400">
                Mask shortages reported in North and East regions. Immediate redistribution required.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>

          {/* Charts */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Case Trends</CardTitle>
              <CardDescription>Daily new cases, recoveries, and deaths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="cases" stackId="1" stroke="#0284c7" fill="#0284c7" />
                    <Area type="monotone" dataKey="recovered" stackId="2" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="deaths" stackId="3" stroke="#ef4444" fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle>Resource Distribution</CardTitle>
              <CardDescription>By region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="masks" fill="#3b82f6" />
                    <Bar dataKey="vaccines" fill="#10b981" />
                    <Bar dataKey="tests" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Map section */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Pandemic hotspots and resource allocation</CardDescription>
              <Tabs defaultValue="cases" className="mt-2">
                <TabsList>
                  <TabsTrigger value="cases">Cases</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="relative h-[400px] w-full rounded-md border bg-muted/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Map className="h-12 w-12" />
                  <div className="text-center">
                    <p>Interactive map visualization</p>
                    <p className="text-sm">(Map data would be displayed here)</p>
                  </div>
                </div>
                {/* Map hotspots */}
                <div className="absolute top-1/4 left-1/4">
                  <Badge variant="destructive" className="flex items-center gap-1 px-2">
                    <MapPin className="h-3 w-3" />
                    <span>High Risk</span>
                  </Badge>
                </div>
                <div className="absolute top-1/3 right-1/3">
                  <Badge className="bg-amber-500 flex items-center gap-1 px-2">
                    <MapPin className="h-3 w-3" />
                    <span>Medium Risk</span>
                  </Badge>
                </div>
                <div className="absolute bottom-1/4 right-1/4">
                  <Badge variant="outline" className="bg-green-100 text-green-700 flex items-center gap-1 px-2">
                    <MapPin className="h-3 w-3" />
                    <span>Low Risk</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north">North Region</SelectItem>
                  <SelectItem value="south">South Region</SelectItem>
                  <SelectItem value="east">East Region</SelectItem>
                  <SelectItem value="west">West Region</SelectItem>
                  <SelectItem value="central">Central Region</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Map Data
              </Button>
            </CardFooter>
          </Card>

          {/* Resource allocation table */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Pharmacy Resource Allocation</CardTitle>
              <CardDescription>Distribution of masks and vaccines to pharmacies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Pharmacy</th>
                      <th className="text-left p-2">Region</th>
                      <th className="text-left p-2">Masks</th>
                      <th className="text-left p-2">Vaccines</th>
                      <th className="text-left p-2">Test Kits</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Central Pharmacy</td>
                      <td className="p-2">North</td>
                      <td className="p-2">5,000</td>
                      <td className="p-2">2,500</td>
                      <td className="p-2">3,000</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700">
                          Adequate
                        </Badge>
                      </td>
                      <td className="p-2">2 hours ago</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">MediPlus</td>
                      <td className="p-2">East</td>
                      <td className="p-2">500</td>
                      <td className="p-2">1,200</td>
                      <td className="p-2">800</td>
                      <td className="p-2">
                        <Badge variant="destructive">Critical</Badge>
                      </td>
                      <td className="p-2">1 day ago</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">HealthFirst</td>
                      <td className="p-2">South</td>
                      <td className="p-2">2,300</td>
                      <td className="p-2">1,800</td>
                      <td className="p-2">1,500</td>
                      <td className="p-2">
                        <Badge className="bg-amber-100 text-amber-700">
                          Low
                        </Badge>
                      </td>
                      <td className="p-2">5 hours ago</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">WellCare</td>
                      <td className="p-2">West</td>
                      <td className="p-2">3,200</td>
                      <td className="p-2">2,100</td>
                      <td className="p-2">2,800</td>
                      <td className="p-2">
                        <Badge  className="bg-green-100 text-green-700">
                          Adequate
                        </Badge>
                      </td>
                      <td className="p-2">3 hours ago</td>
                    </tr>
                    <tr>
                      <td className="p-2">QuickMed</td>
                      <td className="p-2">Central</td>
                      <td className="p-2">1,800</td>
                      <td className="p-2">900</td>
                      <td className="p-2">1,200</td>
                      <td className="p-2">
                        <Badge className="bg-amber-100 text-amber-700">
                          Low
                        </Badge>
                      </td>
                      <td className="p-2">1 hour ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <PieChart className="mr-2 h-4 w-4" />
                View Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/40 p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Hong Kong Pandemic Response Center. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

