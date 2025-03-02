import { NextRequest, NextResponse } from "next/server"
import xgboost from "xgboost_node"

// --------------
// Global model storage
// --------------
let trainedModelBuffer: Buffer | null = null

// Example training data
const trainingFeatures = [
  // [square_feet, property_age, total_rooms, has_parking, neighborhood_type, is_furnished]
  [1200, 8, 10, 0, 1, 1],
  [800, 14, 15, 1, 2, 0],
  [1300, 10, 12, 1, 1, 1],
  [900, 12, 9,  0, 1, 0],
]
const trainingLabels = [250, 180, 270, 190] // in thousands

const params = {
  max_depth: 3,
  eta: 0.3,
  objective: "reg:squarederror",
  eval_metric: "rmse",
  nthread: 4,
  num_round: 50,
  min_child_weight: 1,
  subsample: 0.8,
  colsample_bytree: 0.8,
}

/**
 * Helper: Train in memory, store the model buffer globally
 */
async function trainIfNotTrained() {
  if (!trainedModelBuffer) {
    // Train from scratch
    await xgboost.train(trainingFeatures, trainingLabels, params)
    // Save model to a Buffer (not a file)
    trainedModelBuffer = await xgboost.saveModelToBuffer()
  }
}

/**
 * POST /api/house
 * Expects JSON body like:
 * {
 *   "features": [
 *     [1000, 5, 8, 1, 1, 0],
 *     [700, 20, 6, 0, 2, 0]
 *   ]
 * }
 * Returns predicted house prices in thousands.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newFeatures: number[][] = body.features
    if (!Array.isArray(newFeatures)) {
      return NextResponse.json({ success: false, error: "Invalid 'features' array" }, { status: 400 })
    }

    // 1) Make sure the model is trained in memory
    await trainIfNotTrained()

    // 2) Load the model from the in-memory buffer
    //    (This overwrites any existing model in xgboost_node.)
    await xgboost.loadModelFromBuffer(trainedModelBuffer!)

    // 3) Predict
    const predictions = await xgboost.predict(newFeatures)

    return NextResponse.json({
      success: true,
      predictions, // e.g. [250, 220, ...] means $250k, $220k, etc.
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

/**
 * GET /api/house
 * Optionally let someone "force re-train" the model or just check status
 */
export async function GET() {
  try {
    // Force re-train for demonstration if you like:
    // trainedModelBuffer = null
    // await trainIfNotTrained()

    return NextResponse.json({
      success: true,
      message: trainedModelBuffer
        ? "Model is trained (in memory)."
        : "Model not yet trained. It will train upon first POST request.",
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
