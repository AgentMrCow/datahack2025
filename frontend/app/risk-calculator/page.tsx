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
  { name: "PREGNANT",             importance: 0.006410 },
]

export default function RiskCalculator() {
  // Mock user inputs:
  const [age, setAge] = useState(50)
  const [pneumonia, setPneumonia] = useState<boolean>(false)
  const [diabetes, setDiabetes] = useState<boolean>(false)

  // We'll store a mock "risk score" or "risk label"
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const
