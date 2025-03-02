"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Feature importances you provided:
const FEATURE_IMPORTANCES = [
  { name: "PNEUMONIA", importance: 0.576945 },
  { name: "AGE", importance: 0.108371 },
  { name: "MEDICAL_UNIT", importance: 0.080387 },
  { name: "SEX", importance: 0.031381 },
  { name: "USMER", importance: 0.029805 },
  { name: "DIABETES", importance: 0.028269 },
  { name: "RENAL_CHRONIC", importance: 0.025381 },
  { name: "INMSUPR", importance: 0.018086 },
  { name: "OTHER_DISEASE", importance: 0.014885 },
  { name: "CLASIFFICATION_FINAL", importance: 0.013689 },
  { name: "ASTHMA", importance: 0.012912 },
  { name: "TOBACCO", importance: 0.012352 },
  { name: "COPD", importance: 0.010883 },
  { name: "CARDIOVASCULAR", importance: 0.010764 },
  { name: "OBESITY", importance: 0.010321 },
  { name: "HIPERTENSION", importance: 0.009160 },
  { name: "PREGNANT", importance: 0.006410 },
]

export default function RiskCalculatorPage() {
  // States for user input
  const [age, setAge] = useState<number>(50)
  const [hasPneumonia, setHasPneumonia] = useState<boolean>(false)
  const [hasDiabetes, setHasDiabetes] = useState<boolean>(false)

  // States for result
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskLabel, setRiskLabel] = useState<string>("")

  // Simple mock formula for a risk score
  function handleCalculateRisk() {
    // Example: age/10 + pneumonia? + diabetes?
    let score = age / 10
    if (hasPneumonia) score += 5
    if (hasDiabetes) score += 3

    setRiskScore(score)

    if (score >= 20) {
      setRiskLabel("High Risk")
    } else if (score >= 10) {
      setRiskLabel("Moderate Risk")
    } else {
      setRiskLabel("Low Risk")
    }
  }

  // For the bar chart: find the highest importance to scale bar widths
  const maxImportance = useMemo(
    () => Math.max(...FEATURE_IMPORTANCES.map((fi) => fi.importance)),
    []
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header, matching style from your snippet */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>PandemicSafe HK</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="/risk-calculator"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Risk Calculator
            </Link>
            <Link href="/map" className="text-sm font-medium hover:text-primary">
              Risk Map
            </Link>
            <Link href="/government" className="text-sm font-medium hover:text-primary">
              Government
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Risk Calculator Card */}
            <Card>
              <CardHeader>
                <CardTitle>COVID Risk Calculator</CardTitle>
                <CardDescription>Enter your information below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AGE */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Age</p>
                  <Input
                    type="number"
                    className="max-w-[120px]"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value || "0"))}
                  />
                </div>

                {/* Pneumonia */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pneumonia"
                    checked={hasPneumonia}
                    onCheckedChange={(checked) => setHasPneumonia(Boolean(checked))}
                  />
                  <label htmlFor="pneumonia" className="text-sm font-medium">
                    Pneumonia?
                  </label>
                </div>

                {/* Diabetes */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="diabetes"
                    checked={hasDiabetes}
                    onCheckedChange={(checked) => setHasDiabetes(Boolean(checked))}
                  />
                  <label htmlFor="diabetes" className="text-sm font-medium">
                    Diabetes?
                  </label>
                </div>

                <Button onClick={handleCalculateRisk}>Calculate Risk</Button>

                {riskScore !== null && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm">
                      <strong>Risk Score:</strong> {riskScore.toFixed(1)}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <strong>Risk Category:</strong>
                      {riskLabel === "High Risk" && (
                        <Badge variant="destructive">High Risk</Badge>
                      )}
                      {riskLabel === "Moderate Risk" && (
                        <Badge variant="default">Moderate Risk</Badge>
                      )}
                      {riskLabel === "Low Risk" && (
                        <Badge variant="outline">Low Risk</Badge>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  This calculation is a simulated example and not a medical diagnosis.
                </p>
              </CardFooter>
            </Card>

            {/* Right Column: Feature Importances Card */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Importances</CardTitle>
                <CardDescription>
                  Key factors influencing COVID mortality risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FEATURE_IMPORTANCES.map((fi) => {
                    // Scale bar width from 0..100%
                    const barWidth = (fi.importance / maxImportance) * 100
                    return (
                      <div key={fi.name} className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                          <span>{fi.name}</span>
                          <span className="text-muted-foreground">
                            {fi.importance.toFixed(6)}
                          </span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded bg-muted">
                          <div
                            className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>High value = more influence on outcome</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
