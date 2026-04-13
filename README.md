# Osdag Bridge Module — Web UI

A web-based user interface for the **Osdag Bridge Design Module**, developed as part of a screening task for the Osdag open-source project. This application provides an interactive frontend for configuring bridge design parameters — including project location, geometric details, and material properties — backed by a Django REST API that serves location-specific wind, seismic, and temperature data sourced from Indian Standards (IS 875, IS 1893, IRC 6).

---

## 📸 Project Overview

The UI mirrors the design philosophy of the desktop Osdag application, offering:

- A **left panel** with tabbed input forms (Basic Inputs, Advanced, etc.)
- A **right panel** showing a bridge cross-section diagram
- Location-aware auto-population of wind speed, seismic zone, zone factor, and temperature limits
- Support for both **predefined location selection** (State → District) and **custom value entry**
- Geometry modification via a popup dialog
- Material grade selection (concrete and steel)

---

## ✨ Features

- 🗺️ **Location-based parameter auto-fill** — select a state and district; wind speed, seismic zone, zone factor, max/min temperature populate automatically
- 🏗️ **Geometric detail inputs** — span length, carriageway width, number of lanes, footpath width
- 🔧 **Modify Geometry popup** — fine-grained cross-section geometry editing
- 🧱 **Material inputs** — concrete and steel grade selection with Indian Standards grades
- 📐 **Structure type selector** — Highway, Railway, Pedestrian (disables form for unsupported types)
- ⚡ **Django REST API backend** — serves location data from a pre-populated SQLite database
- 🌐 **CORS-enabled** — ready for local full-stack development

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite 5, Axios                 |
| Backend   | Django 5, Django REST Framework, CORS   |
| Database  | SQLite (development)                    |
| Styling   | Inline CSS (dark theme, Osdag palette)  |
| Standards | IS 875 Part 3, IS 1893, IRC 6 (2017)   |

---

## 📁 Project Structure

```
osdag-bridge-module-ui-web/
├── backend/                        # Django REST API
│   ├── api/
│   │   ├── migrations/             # DB migrations
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py               # LocationData model
│   │   ├── urls.py                 # API route definitions
│   │   └── views.py                # API view logic + location DB
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── load_location_data.py       # Script to seed location DB
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                       # React + Vite application
│   ├── public/
│   │   └── bridge-cross-section.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── BasicInputsTab.jsx
│   │   │   ├── GeometricDetails.jsx
│   │   │   ├── LeftPanel.jsx
│   │   │   ├── MaterialInputs.jsx
│   │   │   ├── ModifyGeometryPopup.jsx
│   │   │   ├── ProjectLocation.jsx
│   │   │   ├── RightPanel.jsx
│   │   │   └── TypeOfStructure.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Python** 3.10 or higher
- **Node.js** 18 or higher and **npm**
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/osdag-bridge-module-ui-web.git
cd osdag-bridge-module-ui-web
```

---

### 2. Backend Setup (Django)

```bash
# Navigate to backend folder
cd backend

# (Recommended) Create and activate a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and set your SECRET_KEY

# Run database migrations
python manage.py migrate

# Seed the location database
python load_location_data.py

# Start the development server
python manage.py runserver
```

The backend will be available at: **http://localhost:8000**

---

### 3. Frontend Setup (React + Vite)

Open a **new terminal** and:

```bash
# Navigate to frontend folder
cd frontend

# Set up environment variables
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 🚀 How to Run the Project

1. Start the **backend** server first: `python manage.py runserver` (from `backend/`)
2. Start the **frontend** server: `npm run dev` (from `frontend/`)
3. Open your browser at **http://localhost:5173**
4. Select a **Structure Type** from the left panel dropdown
5. Click **Set Project Location** → choose a State and District to auto-fill wind/seismic/temperature data
6. Fill in **Geometric Details** and modify geometry via the popup if needed
7. Select **Material grades** for concrete and steel
8. Click **Design** to submit inputs

---

## 🔌 API Endpoints

| Method | Endpoint                                         | Description                        |
|--------|--------------------------------------------------|------------------------------------|
| GET    | `/api/states/`                                   | List all available states          |
| GET    | `/api/districts/?state=<state>`                  | List districts for a state         |
| GET    | `/api/location-data/?state=<s>&district=<d>`     | Get wind/seismic/temp data         |
| GET    | `/api/states/<state>/districts/`                 | Legacy: districts by state         |
| GET    | `/api/states/<state>/districts/<district>/data/` | Legacy: location data by path      |

---

## 📐 Data Sources

Location-specific engineering parameters are sourced from:

- **IS 875 (Part 3)** — Wind loads on buildings and structures
- **IS 1893** — Criteria for earthquake-resistant design (Seismic Zones)
- **IRC 6 (2017)** — Standard specifications for loads for road bridges

---

## 👤 Author

Developed as part of the Osdag open-source screening task.

---

## 🗄️ Database (Extra Credit — Completed)

A location database covering **74 districts across 15+ Indian states** has been pre-populated with engineering parameters sourced from IS 875, IS 1893, and IRC 6.

### Included in `database/` folder:

| File | Format | Description |
|------|--------|-------------|
| `location_data.sqlite3` | SQLite | Full Django database — drop into `backend/` to run without seeding |

### Database Schema (`api_locationdata` table):

| Column | Type | Description |
|--------|------|-------------|
| `state` | Text | Indian state name |
| `district` | Text | District / city name |
| `wind_speed` | Float | Design wind speed in m/s (IS 875 Part 3) |
| `seismic_zone` | Text | Seismic zone (II / III / IV / V) per IS 1893 |
| `zone_factor` | Float | Zone factor Z (0.10 – 0.36) |
| `temp_max` | Float | Maximum design temperature (°C) per IRC 6 |
| `temp_min` | Float | Minimum design temperature (°C) per IRC 6 |

### To use the pre-built database:
```bash
# Option A — Use pre-built SQLite (no seeding needed)
cp database/location_data.sqlite3 backend/db.sqlite3
python manage.py migrate  # runs safely on existing DB

# Option B — Seed fresh from the app's embedded data
python manage.py migrate
python load_location_data.py
```
