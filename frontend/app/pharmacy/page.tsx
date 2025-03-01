"use client"

import { useState } from "react"
import {
    Activity,
    AlertTriangle,
    Calendar,
    ChevronDown,
    Clock,
    Download,
    FileText,
    Filter,
    Home,
    Layers,
    MapPin,
    Package,
    PieChart,
    Plus,
    Search,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function PharmacyDashboard() {
    const [selectedTab, setSelectedTab] = useState("overview")

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-muted/40">
                <Sidebar className="border-r">
                    <SidebarHeader className="border-b">
                        <div className="flex items-center gap-2 px-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                                <Package className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">MediPharm HK</span>
                                <span className="text-xs text-muted-foreground">Pharmacy Dashboard</span>
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={selectedTab === "overview"}
                                    onClick={() => setSelectedTab("overview")}
                                >
                                    <button>
                                        <Home className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={selectedTab === "inventory"}
                                    onClick={() => setSelectedTab("inventory")}
                                >
                                    <button>
                                        <Package className="h-4 w-4" />
                                        <span>Stock Management</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={selectedTab === "orders"} onClick={() => setSelectedTab("orders")}>
                                    <button>
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>Orders</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={selectedTab === "customers"}
                                    onClick={() => setSelectedTab("customers")}
                                >
                                    <button>
                                        <Users className="h-4 w-4" />
                                        <span>Customers</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={selectedTab === "analytics"}
                                    onClick={() => setSelectedTab("analytics")}
                                >
                                    <button>
                                        <Activity className="h-4 w-4" />
                                        <span>Reports & Analytics</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={selectedTab === "settings"}
                                    onClick={() => setSelectedTab("settings")}
                                >
                                    <button>
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter className="border-t p-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/placeholder.svg?height=32&width=32"
                                width={32}
                                height={32}
                                className="rounded-full border"
                                alt="Pharmacy Admin"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Alex Wong</span>
                                <span className="text-xs text-muted-foreground">Pharmacy Manager</span>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex-1">
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger />
                        <div className="flex flex-1 items-center gap-4 md:gap-8">
                            <form className="flex-1 md:flex-initial">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                                    />
                                </div>
                            </form>
                            <div className="ml-auto flex items-center gap-4">
                                <Button variant="outline" size="sm">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Central District
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Bell className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span className="hidden md:inline">Today</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Today</DropdownMenuItem>
                                        <DropdownMenuItem>Yesterday</DropdownMenuItem>
                                        <DropdownMenuItem>This Week</DropdownMenuItem>
                                        <DropdownMenuItem>This Month</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Custom Range</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-6">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold tracking-tight">Pharmacy Dashboard</h1>
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="covid">COVID-19</TabsTrigger>
                                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">$12,543</div>
                                            <p className="text-xs text-muted-foreground">+18% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">COVID-19 Items</CardTitle>
                                            <Layers className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">3,456</div>
                                            <p className="text-xs text-muted-foreground">+24% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">573</div>
                                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">24</div>
                                            <p className="text-xs text-muted-foreground">-4% from last month</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <Card className="lg:col-span-4">
                                        <CardHeader>
                                            <CardTitle>Sales Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pl-2">
                                            <div className="h-[240px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                                                <PieChart className="h-8 w-8 text-muted" />
                                                <span className="ml-2 text-sm text-muted-foreground">Sales Chart</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="lg:col-span-3">
                                        <CardHeader>
                                            <CardTitle>COVID-19 Inventory Status</CardTitle>
                                            <CardDescription>Current stock levels of critical items</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Face Masks</span>
                                                        <span className="text-sm text-muted-foreground">78%</span>
                                                    </div>
                                                    <Progress value={78} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Hand Sanitizers</span>
                                                        <span className="text-sm text-muted-foreground">45%</span>
                                                    </div>
                                                    <Progress value={45} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">COVID-19 Test Kits</span>
                                                        <span className="text-sm text-muted-foreground">23%</span>
                                                    </div>
                                                    <Progress value={23} className="h-2" />
                                                    <Badge variant="destructive" className="mt-1">
                                                        Low Stock
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Immune Boosters</span>
                                                        <span className="text-sm text-muted-foreground">92%</span>
                                                    </div>
                                                    <Progress value={92} className="h-2" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <Card className="lg:col-span-4">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                            <CardTitle>Recent Orders</CardTitle>
                                            <Button variant="outline" size="sm">
                                                View All
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Order ID</TableHead>
                                                        <TableHead>Customer</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">#ORD-1234</TableCell>
                                                        <TableCell>John Smith</TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-green-500">Completed</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">$125.00</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">#ORD-1235</TableCell>
                                                        <TableCell>Emily Johnson</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">Processing</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">$78.50</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">#ORD-1236</TableCell>
                                                        <TableCell>Michael Brown</TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-green-500">Completed</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">$45.99</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">#ORD-1237</TableCell>
                                                        <TableCell>Sarah Davis</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">Processing</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">$189.99</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                    <Card className="lg:col-span-3">
                                        <CardHeader>
                                            <CardTitle>COVID-19 Alerts</CardTitle>
                                            <CardDescription>Recent updates and notifications</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 rounded-lg border p-3">
                                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">COVID-19 Test Kits Low Stock</p>
                                                        <p className="text-xs text-muted-foreground">Inventory below 25%. Reorder recommended.</p>
                                                        <div className="flex items-center pt-1">
                                                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 rounded-lg border p-3">
                                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">COVID-19 Cases Increasing</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Local health department reports 15% increase in cases.
                                                        </p>
                                                        <div className="flex items-center pt-1">
                                                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">1 day ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 rounded-lg border p-3">
                                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-green-500" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">New Vaccine Shipment</p>
                                                        <p className="text-xs text-muted-foreground">New shipment of vaccines arriving tomorrow.</p>
                                                        <div className="flex items-center pt-1">
                                                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">2 days ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="covid" className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card className="col-span-2">
                                        <CardHeader>
                                            <CardTitle>COVID-19 Trend Analysis</CardTitle>
                                            <CardDescription>Local case trends and inventory impact</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                                                <Activity className="h-8 w-8 text-muted" />
                                                <span className="ml-2 text-sm text-muted-foreground">COVID-19 Trend Chart</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Demand Forecast</CardTitle>
                                            <CardDescription>Predicted demand for next 7 days</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Face Masks</span>
                                                        <span className="text-sm font-medium text-red-500">+35%</span>
                                                    </div>
                                                    <Progress value={85} className="h-2" />
                                                    <p className="text-xs text-muted-foreground">Expected high demand</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Hand Sanitizers</span>
                                                        <span className="text-sm font-medium text-red-500">+28%</span>
                                                    </div>
                                                    <Progress value={78} className="h-2" />
                                                    <p className="text-xs text-muted-foreground">Expected high demand</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">COVID-19 Test Kits</span>
                                                        <span className="text-sm font-medium text-red-500">+65%</span>
                                                    </div>
                                                    <Progress value={95} className="h-2" />
                                                    <p className="text-xs text-muted-foreground">Critical demand expected</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download Forecast Report
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>COVID-19 Inventory Management</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Filter className="mr-2 h-4 w-4" />
                                                    Filter
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Export
                                                </Button>
                                            </div>
                                        </div>
                                        <CardDescription>Monitor and manage COVID-19 related products</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Current Stock</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Reorder Level</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">N95 Face Masks</TableCell>
                                                    <TableCell>PPE</TableCell>
                                                    <TableCell>245 units</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-500">In Stock</Badge>
                                                    </TableCell>
                                                    <TableCell>100 units</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Reorder
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">COVID-19 Rapid Test Kits</TableCell>
                                                    <TableCell>Diagnostics</TableCell>
                                                    <TableCell>32 units</TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive">Low Stock</Badge>
                                                    </TableCell>
                                                    <TableCell>50 units</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Reorder
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Hand Sanitizer (500ml)</TableCell>
                                                    <TableCell>Hygiene</TableCell>
                                                    <TableCell>78 units</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">Medium Stock</Badge>
                                                    </TableCell>
                                                    <TableCell>40 units</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Reorder
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Disposable Gloves (Box)</TableCell>
                                                    <TableCell>PPE</TableCell>
                                                    <TableCell>56 boxes</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">Medium Stock</Badge>
                                                    </TableCell>
                                                    <TableCell>30 boxes</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Reorder
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Digital Thermometers</TableCell>
                                                    <TableCell>Diagnostics</TableCell>
                                                    <TableCell>12 units</TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive">Low Stock</Badge>
                                                    </TableCell>
                                                    <TableCell>20 units</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Reorder
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <div className="text-sm text-muted-foreground">Showing 5 of 24 products</div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" disabled>
                                                Previous
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Next
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="inventory" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold">Inventory Management</h2>
                                        <p className="text-sm text-muted-foreground">Manage your pharmacy inventory and stock levels</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Product
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Input placeholder="Search products..." className="max-w-sm" />
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="covid">COVID-19</SelectItem>
                                            <SelectItem value="prescription">Prescription</SelectItem>
                                            <SelectItem value="otc">Over-the-counter</SelectItem>
                                            <SelectItem value="supplements">Supplements</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="instock">In Stock</SelectItem>
                                            <SelectItem value="lowstock">Low Stock</SelectItem>
                                            <SelectItem value="outofstock">Out of Stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                </div>

                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product Name</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>SKU</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Stock</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">N95 Face Masks</TableCell>
                                                    <TableCell>COVID-19</TableCell>
                                                    <TableCell>PPE-N95-001</TableCell>
                                                    <TableCell>$2.99</TableCell>
                                                    <TableCell>245 units</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-500">In Stock</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">COVID-19 Rapid Test Kits</TableCell>
                                                    <TableCell>COVID-19</TableCell>
                                                    <TableCell>DIA-COV-002</TableCell>
                                                    <TableCell>$24.99</TableCell>
                                                    <TableCell>32 units</TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive">Low Stock</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Hand Sanitizer (500ml)</TableCell>
                                                    <TableCell>COVID-19</TableCell>
                                                    <TableCell>HYG-SAN-003</TableCell>
                                                    <TableCell>$8.50</TableCell>
                                                    <TableCell>78 units</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">Medium Stock</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Ibuprofen (200mg, 50 tablets)</TableCell>
                                                    <TableCell>OTC</TableCell>
                                                    <TableCell>OTC-IBU-004</TableCell>
                                                    <TableCell>$7.99</TableCell>
                                                    <TableCell>120 units</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-500">In Stock</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Vitamin C (1000mg, 100 tablets)</TableCell>
                                                    <TableCell>Supplements</TableCell>
                                                    <TableCell>SUP-VTC-005</TableCell>
                                                    <TableCell>$12.99</TableCell>
                                                    <TableCell>85 units</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-500">In Stock</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter className="flex justify-between py-4">
                                        <div className="text-sm text-muted-foreground">Showing 5 of 124 products</div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" disabled>
                                                Previous
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Next
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

function Bell(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}

function DollarSign(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}

