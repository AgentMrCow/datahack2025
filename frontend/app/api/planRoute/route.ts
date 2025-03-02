// /app/api/planRoute/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { origin, destination } = await request.json();

    // Simulate risk calculation (this is where you'd integrate your risk logic)
    const result = {
      probability: 0.25, // e.g. 25% risk probability
      riskLevel: "green",
      path: [origin, destination],
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
