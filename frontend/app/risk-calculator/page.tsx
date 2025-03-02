"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function RiskCalculator() {
  const [step, setStep] = useState(1)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [exposure, setExposure] = useState("")
  const [travel, setTravel] = useState("")
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | null>(null)
  const [riskScore, setRiskScore] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleSymptomChange = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const calculateRisk = () => {
    setIsCalculating(true)

    // Simulate AI calculation with a delay
    setTimeout(() => {
      // Simple risk calculation algorithm (in a real app, this would be an AI model)
      let score = 0

      // Add points for symptoms
      if (symptoms.includes("fever")) score += 3
      if (symptoms.includes("cough")) score += 2
      if (symptoms.includes("breath")) score += 3
      if (symptoms.includes("fatigue")) score += 1
      if (symptoms.includes("taste")) score += 3

      // Add points for exposure
      if (exposure === "direct") score += 5
      if (exposure === "indirect") score += 3

      // Add points for travel
      if (travel === "international") score += 4
      if (travel === "domestic") score += 2

      setRiskScore(score)

      // Determine risk level
      if (score >= 8) {
        setRiskLevel("high")
      } else if (score >= 4) {
        setRiskLevel("moderate")
      } else {
        setRiskLevel("low")
      }

      setIsCalculating(false)
      setStep(4)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>PandemicSafe</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/risk-calculator" className="text-sm font-medium transition-colors hover:text-primary">
              Risk Calculator
            </Link>
            <Link
              href="/map"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Risk Map
            </Link>
            <Link href="/government" className="text-sm font-medium hover:text-primary">
                            Government
                        </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Risk Assessment Calculator</h1>
              <p className="text-muted-foreground">Answer a few questions to assess your risk of infection</p>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of 4</span>
              <span className="text-sm font-medium">{step * 25}%</span>
            </div>
            <Progress value={step * 25} className="h-2 mb-6" />

            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Symptoms</CardTitle>
                  <CardDescription>Select any symptoms you've experienced in the past 14 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fever"
                      checked={symptoms.includes("fever")}
                      onCheckedChange={() => handleSymptomChange("fever")}
                    />
                    <Label htmlFor="fever">Fever or chills</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cough"
                      checked={symptoms.includes("cough")}
                      onCheckedChange={() => handleSymptomChange("cough")}
                    />
                    <Label htmlFor="cough">Cough</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breath"
                      checked={symptoms.includes("breath")}
                      onCheckedChange={() => handleSymptomChange("breath")}
                    />
                    <Label htmlFor="breath">Shortness of breath</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fatigue"
                      checked={symptoms.includes("fatigue")}
                      onCheckedChange={() => handleSymptomChange("fatigue")}
                    />
                    <Label htmlFor="fatigue">Fatigue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taste"
                      checked={symptoms.includes("taste")}
                      onCheckedChange={() => handleSymptomChange("taste")}
                    />
                    <Label htmlFor="taste">Loss of taste or smell</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNext} className="w-full">
                    Next
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Exposure History</CardTitle>
                  <CardDescription>Have you been in contact with anyone who tested positive?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={exposure} onValueChange={setExposure} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="direct" id="direct" />
                      <Label htmlFor="direct">Direct contact (household member, close contact)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="indirect" id="indirect" />
                      <Label htmlFor="indirect">Indirect contact (same building, event)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">No known contact</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Travel History</CardTitle>
                  <CardDescription>Have you traveled in the past 14 days?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={travel} onValueChange={setTravel} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="international" id="international" />
                      <Label htmlFor="international">International travel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="domestic" id="domestic" />
                      <Label htmlFor="domestic">Domestic travel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none-travel" />
                      <Label htmlFor="none-travel">No travel</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={calculateRisk} disabled={isCalculating}>
                    {isCalculating ? "Calculating..." : "Calculate Risk"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 4 && riskLevel && (
              <Card
                className={
                  riskLevel === "high"
                    ? "border-red-500"
                    : riskLevel === "moderate"
                      ? "border-yellow-500"
                      : "border-green-500"
                }
              >
                <CardHeader
                  className={
                    riskLevel === "high"
                      ? "bg-red-50 dark:bg-red-950/20"
                      : riskLevel === "moderate"
                        ? "bg-yellow-50 dark:bg-yellow-950/20"
                        : "bg-green-50 dark:bg-green-950/20"
                  }
                >
                  <div className="flex items-center gap-2">
                    {riskLevel === "high" && <AlertTriangle className="h-6 w-6 text-red-500" />}
                    {riskLevel === "moderate" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                    {riskLevel === "low" && <CheckCircle className="h-6 w-6 text-green-500" />}
                    <CardTitle>
                      {riskLevel === "high" && "High Risk"}
                      {riskLevel === "moderate" && "Moderate Risk"}
                      {riskLevel === "low" && "Low Risk"}
                    </CardTitle>
                  </div>
                  <CardDescription>Based on your inputs, our AI model has calculated your risk level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Risk Score</h3>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(riskScore / 15) * 100}
                        className={`h-2 ${
                          riskLevel === "high"
                            ? "bg-red-100"
                            : riskLevel === "moderate"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                        }`}
                        indicatorClassName={
                          riskLevel === "high"
                            ? "bg-red-500"
                            : riskLevel === "moderate"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }
                      />
                      <span className="text-sm font-medium">{riskScore}/15</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Recommendations</h3>
                    <ul className="space-y-1 text-sm">
                      {riskLevel === "high" && (
                        <>
                          <li>• Get tested immediately</li>
                          <li>• Self-isolate until you receive test results</li>
                          <li>• Contact your healthcare provider</li>
                          <li>• Monitor your symptoms closely</li>
                          <li>• Consider telemedicine consultation</li>
                        </>
                      )}
                      {riskLevel === "moderate" && (
                        <>
                          <li>• Consider getting tested</li>
                          <li>• Limit contact with others for 7 days</li>
                          <li>• Monitor your symptoms</li>
                          <li>• Wear a mask in public</li>
                          <li>• Practice strict hand hygiene</li>
                        </>
                      )}
                      {riskLevel === "low" && (
                        <>
                          <li>• Continue following safety guidelines</li>
                          <li>• Wear a mask in crowded places</li>
                          <li>• Practice good hand hygiene</li>
                          <li>• Monitor for any new symptoms</li>
                          <li>• Stay updated on local health advisories</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  {riskLevel === "high" && (
                    <Link href="/medical-services" className="w-full">
                      <Button className="w-full bg-red-500 hover:bg-red-600">Find Medical Help</Button>
                    </Link>
                  )}
                  <Link href="/" className="w-full">
                    <Button variant="outline" className="w-full">
                      Return to Dashboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

