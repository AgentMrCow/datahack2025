# 🚀 Machine Learning Public Health Dashboard

## 📌 Project Overview
This project is a **Machine Learning-powered Public Health Dashboard** that provides **COVID-19 data analysis** and **infectious rate predictions** using **FastAPI (Python)** for the backend and **Next.js (React)** for the frontend.

---

## 🏗 Tech Stack
### **Frontend:**
- 🟢 Next.js (React + TypeScript)
- 🎨 Tailwind CSS (for UI styling)
- 🔄 Axios (for API calls)

### **Backend:**
- 🐍 FastAPI (Python)
- 📊 Scikit-learn (Machine Learning)
- 🔥 Uvicorn (ASGI server)

### **Deployment:**
- 🐳 Docker & Docker Compose
- 🌎 Vercel (Frontend)
- 🛠 AWS/GCP (Backend, optional)

---

## 🛠 Installation & Setup
### **1️⃣ Clone the Repository**
```bash
  git clone https://github.com/your-username/machine-learning-project.git
  cd machine-learning-project
```

### **2️⃣ Setup the Backend (FastAPI)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```
🔹 **API will be running at:** `http://127.0.0.1:8080`

### **3️⃣ Setup the Frontend (Next.js)**
```bash
cd ../frontend
npm install
npm run dev
```
🔹 **App will be available at:** `http://127.0.0.1:3000`

### **4️⃣ Run with Docker (Optional)**
```bash
docker-compose up --build
```
🔹 This will start both **backend (8080)** and **frontend (3000)** together.

---

## 🔥 Features
✅ **View COVID-19 Data** (cases, deaths, vaccinations, etc.)
✅ **Predict Infection Rate** based on user input
✅ **Machine Learning-powered infectious rate estimation**
✅ **Modern & responsive UI with Tailwind CSS**
✅ **REST API for data retrieval & predictions**
✅ **Deployed using Docker & Cloud Services**

---

## 🔌 API Endpoints
### **1️⃣ Get COVID-19 Data**
**Endpoint:** `GET /covid-data/`
```json
{
  "covid_stats": [
    { "country": "USA", "cases": 1000000, "deaths": 50000, "hospitalizations": 20000, "vaccinations": 900000 }
  ]
}
```

### **2️⃣ Predict Infection Rate**
**Endpoint:** `POST /predict-infection-rate/`
#### **Request:**
```json
{
  "country": "USA",
  "population": 331000000,
  "confirmed_cases": 1000000,
  "deaths": 50000,
  "vaccinations": 900000
}
```
#### **Response:**
```json
{
  "predicted_infection_rate": 2.45
}
```

---

## 📜 Folder Structure
```
machine-learning-project/
│── backend/             # FastAPI Backend
│   ├── main.py          # API Server
│   ├── models.py        # ML Models
│   ├── routes.py        # API Endpoints
│   ├── requirements.txt # Dependencies
│── frontend/            # Next.js Frontend
│   ├── app/             # Pages & Components
│   ├── lib/api.ts       # API Calls to Backend
│── docker-compose.yml   # Docker Setup
│── README.md            # Documentation
```

---

## 📌 Deployment
### **Deploy Backend to AWS/GCP** (Example using Docker)
```bash
docker build -t fastapi-ml .
docker run -p 8080:8080 fastapi-ml
```

### **Deploy Frontend to Vercel**
```bash
cd frontend
vercel deploy
```

---

## 🚀 Contributing
1. Fork the repository
2. Create a new branch (`feature-xyz`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to GitHub & create a Pull Request

---

## 📝 License
This project is **MIT licensed**. Feel free to modify and distribute.

💡 **Happy Coding!** 🚀

