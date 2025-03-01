from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input model for prediction
class InfectionData(BaseModel):
    country: str
    population: int
    confirmed_cases: int
    deaths: int
    vaccinations: int

# Sample Data (Mock Data for Demonstration)
covid_stats = [
    {"country": "USA", "population": 331000000, "cases": 1000000, "deaths": 50000, "vaccinations": 900000},
    {"country": "UK", "population": 67000000, "cases": 500000, "deaths": 20000, "vaccinations": 450000},
]

# API Endpoints
@app.get("/")
def home():
    return {"message": "Infectious Disease Prediction API"}

@app.get("/covid-data/")
def get_covid_data():
    return {"covid_stats": covid_stats}

@app.post("/predict-infection-rate/")
def predict_infection_rate(data: InfectionData):
    # Simple formula: (cases/population) * 100 to get % infection rate
    try:
        infection_rate = (data.confirmed_cases / data.population) * 100
        predicted_infection_rate = round(infection_rate * random.uniform(0.9, 1.1), 2)  # randomness
        return {"predicted_infection_rate": predicted_infection_rate}
    except ZeroDivisionError:
        return {"error": "Population cannot be zero"}
