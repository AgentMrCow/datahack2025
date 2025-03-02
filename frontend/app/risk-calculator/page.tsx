"use client"

import React, { useState, useMemo } from "react"

type FeatureImportance = {
  name: string
  importance: number
}

// The feature importances you provided:
const FEATURE_IMPORTANCES: FeatureImportance[] = [
  { name: "PNEUMONIA",            importance: 0.576945 },
  { name: "AGE",                  importance: 0.108371 },
  { name: "MEDICAL_UNIT",         importance: 0.080387 },
  { name: "SEX",                  importance: 0.031381 },
  { name: "USMER",                importance: 0.029805 },
  { name: "DIABETES",             importance: 0.028269 },
  { name: "RENAL_CHRONIC",        importance: 0.025381 },
  { name: "INMSUPR",              importance: 0.018086 },
  { name: "OTHER_DISEASE",        importance: 0.014885 },
  { name: "CLASIFFICATION_FINAL", importance: 0.013689 },
  { name: "ASTHMA",               importance: 0.012912 },
  { name: "TOBACCO",              importance: 0.012352 },
  { name: "COPD",                 importance: 0.010883 },
  { name: "CARDIOVASCULAR",       importance: 0.010764 },
  { name: "OBESITY",              importance: 0.010321 },
  { name: "HIPERTENSION",         importance: 0.009160 },
  { name: "PREGNANT",             importance: 0.006410 }
]

export default function RiskCalculator() {
  // We'll store a mock "risk score" or "risk label"
  const [age, setAge] = useState(50)
  const [pneumonia, setPneumonia] = useState<boolean>(false)
  const [diabetes, setDiabetes] = useState<boolean>(false)

  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskLabel, setRiskLabel] = useState<string>("")

  // Simple function to "simulate" a risk score based on user input
  function handleCalculateRisk() {
    // Fake formula: age/10 + pneumonia? + diabetes?
    let score = age / 10
    if (pneumonia) score += 5
    if (diabetes) score += 3

    setRiskScore(score)

    if (score >= 20) {
      setRiskLabel("High Risk")
    } else if (score >= 10) {
      setRiskLabel("Moderate Risk")
    } else {
      setRiskLabel("Low Risk")
    }
  }

  // For the bar chart: find max importance to scale bar widths
  const maxImportance = useMemo(() => {
    return Math.max(...FEATURE_IMPORTANCES.map((fi) => fi.importance))
  }, [])

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Simple Risk Calculator (Feature Importances Demo)
      </h1>

      {/* ------------------ User Input Form ------------------ */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Enter Your Information</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "inline-block", width: "120px" }}>
            Age:
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value || "0"))}
            style={{ padding: "4px", width: "100px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "inline-block", width: "120px" }}>
            Pneumonia?
          </label>
          <input
            type="checkbox"
            checked={pneumonia}
            onChange={(e) => setPneumonia(e.target.checked)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "inline-block", width: "120px" }}>
            Diabetes?
          </label>
          <input
            type="checkbox"
            checked={diabetes}
            onChange={(e) => setDiabetes(e.target.checked)}
          />
        </div>

        <button
          onClick={handleCalculateRisk}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Calculate Risk
        </button>

        {/* Display the result */}
        {riskScore !== null && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Calculated Risk Score:</strong> {riskScore.toFixed(1)}
            </p>
            <p>
              <strong>Risk Category:</strong> {riskLabel}
            </p>
          </div>
        )}
      </div>

      {/* ------------------ Feature Importances Chart ------------------ */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Model Feature Importances
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxWidth: "600px",
          }}
        >
          {FEATURE_IMPORTANCES.map((fi) => {
            // Scale bar width from 0..max
            const barWidthPercent = (fi.importance / maxImportance) * 100

            return (
              <div key={fi.name}>
                <div style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                  {fi.name} ({fi.importance.toFixed(6)})
                </div>
                <div
                  style={{
                    background: "#eee",
                    height: "16px",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      background: "#0070f3",
                      width: `${barWidthPercent}%`,
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
