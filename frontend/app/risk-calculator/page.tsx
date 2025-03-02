"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
// XGBoost predictor
import { XGBoostModel } from "xgboost-predictor"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// ----------------------------------
// 1. Utility to transform user input
//    into numeric features for XGBoost
// ----------------------------------
function transformInput(symptoms, exposure, travel) {
  /*
    In your real code, you must replicate *exactly* the preprocessing logic from Python:
      - The same columns in the same order
      - The same min-max scaling (if any)
      - The same label encoding or binary mappings
      - The same fillna approach, etc.

    For demonstration, let's imagine your final X had 3 "fake" features:
      1) A combined "symptomScore" integer
      2) "exposureLevel": 0 (none), 1 (indirect), 2 (direct)
      3) "travelLevel": 0 (none), 1 (domestic), 2 (international)
  */

  // Quick example: sum up selected symptoms into an integer
  let symptomScore = 0
  if (symptoms.includes("fever")) symptomScore += 2
  if (symptoms.includes("cough")) symptomScore += 1
  if (symptoms.includes("breath")) symptomScore += 2
  if (symptoms.includes("fatigue")) symptomScore += 1
  if (symptoms.includes("taste")) symptomScore += 2

  // Map exposure
  let exposureLevel = 0
  if (exposure === "indirect") exposureLevel = 1
  if (exposure === "direct") exposureLevel = 2

  // Map travel
  let travelLevel = 0
  if (travel === "domestic") travelLevel = 1
  if (travel === "international") travelLevel = 2

  // Return an array in the EXACT order your XGBoost model expects
  return [symptomScore, exposureLevel, travelLevel]
}

export default function RiskCalculator() {
  // -----------------------------
  // 2. UI state
  // -----------------------------
  const [step, setStep] = useState(1)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [exposure, setExposure] = useState("")
  const [travel, setTravel] = useState("")

  const [isCalculating, setIsCalculating] = useState(false)
  const [riskScore, setRiskScore] = useState(0)
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | null>(null)

  // -----------------------------
  // 3. XGBoost model states
  // -----------------------------
  const [model, setModel] = useState<XGBoostModel | null>(null)
  const [modelLoading, setModelLoading] = useState(true)

  // -----------------------------------------
  // 4. On mount, load the model.json
  // -----------------------------------------
  useEffect(() => {
    async function loadXGBoostModel() {
      try {
        const resp = await fetch("/model/model.json")
        const modelJson = await resp.json()

        const predictor = new XGBoostModel()
        // "json" is the default format for a JSON-based XGBoost model
        await predictor.loadModel(modelJson)

        // If you have label encoders or scalers, load them similarly here
        // const labelEncoderResp = await fetch("/model/label_encoder_classes.json")
        // const labelEncoderData = await labelEncoderResp.json()
        // etc.

        setModel(predictor)
      } catch (err) {
        console.error("Failed to load XGBoost model:", err)
      } finally {
        setModelLoading(false)
      }
    }

    loadXGBoostModel()
  }, [])

  // -----------------------------------------
  // 5. Handler for symptom checkboxes
  // -----------------------------------------
  const handleSymptomChange = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }
  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  // -----------------------------------------
  // 6. Real "calculateRisk" using the loaded model
  // -----------------------------------------
  const calculateRisk = async () => {
    if (!model) {
      alert("Model still loading. Please wait a moment and try again.")
      return
    }

    setIsCalculating(true)

    try {
      // 1) Transform your user input into a numeric array
      const numericFeatures = transformInput(symptoms, exposure, travel)

      // 2) xgboost-predictor requires an array of arrays for the DMatrix
      //    because it can predict multiple rows at once. For a single row:
      const inputMatrix = [numericFeatures]

      // 3) Create the DMatrix from your input
      const dmatrix = model.createDMatrix(inputMatrix)

      // 4) Predict. For classification, your model could produce different shapes:
      //    - If it's binary, you might get `[ [logistic_prob_0, logistic_prob_1], ... ]`
      //    - Or you might get `[ classIndex, ... ]` if not using probabilities
      //    => Check your training parameters. 
      //    Below we assume we want class probabilities:
      const predictions = model.predict(dmatrix, {
        // for many XGBoost JSON models:
        // 'predict_proba': true might not exist in older versions
        // Try advanced usage if needed, or check the shape of `predictions`.
      })

      console.log("Raw predictions from XGBoost:", predictions)

      // Suppose it's returning an array of shape [ [prob_class0, prob_class1], ... ] for binary classification:
      let probClass1 = 0
      if (Array.isArray(predictions[0])) {
        // Then predictions[0][1] is the probability of class1
        probClass1 = predictions[0][1]
      } else {
        // If your model returns just [score, ...], handle it accordingly
        probClass1 = predictions[0]
      }

      // We'll interpret probClass1 as "risk score" for demonstration
      // Let's turn that into a 0-15 scale just for your UI
      const scaledScore = Math.round(probClass1 * 15)
      setRiskScore(scaledScore)

      // Choose a "risk level" by thresholds
      // e.g. > 0.66 => "high", > 0.33 => "moderate", else => "low"
      if (probClass1 >= 0.66) {
        setRiskLevel("high")
      } else if (probClass1 >= 0.33) {
        setRiskLevel("moderate")
      } else {
        setRiskLevel("low")
      }

      setStep(4)
    } catch (err) {
      console.error("Error during XGBoost prediction:", err)
      alert("Something went wrong with the model prediction. See console for details.")
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
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
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Risk Assessment Calculator</h1>
              <p className="text-muted-foreground">
                Answer a few questions to assess your risk of infection
              </p>
            </div>

            {/* Progress display */}
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of 4</span>
              <span className="text-sm font-medium">{step * 25}%</span>
            </div>
            <Progress value={step * 25} className="h-2 mb-6" />

            {/* Step 1: Symptoms */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Symptoms</CardTitle>
                  <CardDescription>Select any symptoms you've experienced recently</CardDescription>
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
                  <Button onClick={handleNext} className="w-full" disabled={modelLoading}>
                    {modelLoading ? "Loading Model..." : "Next"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 2: Exposure */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Exposure History</CardTitle>
                  <CardDescription>Have you been in contact with a positive case?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={exposure} onValueChange={setExposure} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="direct" id="direct" />
                      <Label htmlFor="direct">Direct contact (household, close contact)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="indirect" id="indirect" />
                      <Label htmlFor="indirect">Indirect contact (shared space, event)</Label>
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

            {/* Step 3: Travel */}
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
                  <Button onClick={calculateRisk} disabled={isCalculating || modelLoading}>
                    {isCalculating ? "Calculating..." : "Calculate Risk"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 4: Results */}
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
                  <CardDescription>Based on your inputs, our XGBoost model calculated your risk</CardDescription>
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
                      <span className="text-sm font-medium">
                        {riskScore}/15
                      </span>
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
                          <li>• Monitor symptoms closely</li>
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
                          <li>• Monitor any new symptoms</li>
                          <li>• Stay updated on local advisories</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  {riskLevel === "high" && (
                    <Link href="/medical-services" className="w-full">
                      <Button className="w-full bg-red-500 hover:bg-red-600">
                        Find Medical Help
                      </Button>
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
