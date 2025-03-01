const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchCovidData() {
    const res = await fetch(`${backendUrl}/covid-data/`);
    return res.json();
}

export async function predictInfectionRate(data: any) {
    const res = await fetch(`${backendUrl}/predict-infection-rate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}
