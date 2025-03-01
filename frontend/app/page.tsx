import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, MapPin, Navigation, Pill, Activity } from "lucide-react"

export default function Home() {
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Stay Safe During the Pandemic
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Real-time risk assessment, medical services integration, and safe navigation to help you stay
                    healthy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/risk-calculator">
                    <Button size="lg">Check Your Risk</Button>
                  </Link>
                  <Link href="/map">
                    <Button size="lg" variant="outline">
                      View Risk Map
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Pandemic Safety App Dashboard"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=550&width=800"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform provides comprehensive tools to keep you safe during the pandemic.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <Activity className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Risk Calculator</CardTitle>
                  <CardDescription>AI-powered risk assessment based on your symptoms and exposure</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Input your symptoms, travel history, and exposure details to get a personalized risk assessment.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/risk-calculator" className="w-full">
                    <Button size="sm" className="w-full">
                      Check Risk
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Pill className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Medical Services</CardTitle>
                  <CardDescription>Find nearby pharmacies and medical supplies</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Locate pharmacies with real-time inventory for masks, medicines, and test kits.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/medical-services" className="w-full">
                    <Button size="sm" className="w-full">
                      Find Services
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <MapPin className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Risk Map</CardTitle>
                  <CardDescription>Real-time heat map of high-risk zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View infection hotspots and safe zones based on health data and user reports.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/map" className="w-full">
                    <Button size="sm" className="w-full">
                      View Map
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Navigation className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Safe Navigation</CardTitle>
                  <CardDescription>Plan routes that avoid high-risk areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get turn-by-turn directions for the safest route to your destination.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/navigation" className="w-full">
                    <Button size="sm" className="w-full">
                      Navigate
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 PandemicSafe. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

