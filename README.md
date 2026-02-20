# UptimeGuard AI - Server Downtime Predictor & Monitoring

A complete MVP web application for monitoring server health, predicting downtime risk before deployments, and managing maintenance windows with public status pages.

## 🎯 Features

- **Real-time Server Monitoring**: Live metrics for CPU, RAM, response time, error rate, and database latency
- **Downtime Risk Prediction**: Analyze deployment updates to predict downtime risk and duration
- **Maintenance Mode**: Enable/disable maintenance with ETA countdown
- **Public Status Page**: User-friendly status page showing current system state
- **Automatic Incident Detection**: System automatically creates incidents when anomalies are detected
- **Admin Dashboard**: Protected dashboard with live charts and metrics

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python) - REST API
- **SQLAlchemy** - ORM
- **SQLite** - Database (MVP)
- **JWT** - Authentication
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

**Default Admin Credentials:**
- Email: `admin@uptimeguard.ai`
- Password: `admin123`

The admin user is automatically created on first startup.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # Authentication utilities
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── auth_routes.py      # Authentication endpoints
│   │   ├── metrics_routes.py   # Metrics endpoints
│   │   ├── incident_routes.py  # Incident endpoints
│   │   ├── maintenance_routes.py # Maintenance endpoints
│   │   └── predict_routes.py   # Risk prediction endpoints
│   └── services/
│       ├── metrics_simulator.py # Simulated metrics generator
│       └── risk_predictor.py   # Rule-based risk predictor
│
└── frontend/
    ├── app/
    │   ├── login/              # Login page
    │   ├── dashboard/          # Admin dashboard
    │   │   ├── page.tsx        # Overview dashboard
    │   │   ├── update-planner/ # Update risk prediction
    │   │   ├── incidents/      # Incidents page
    │   │   └── maintenance/    # Maintenance control
    │   └── status/             # Public status page
    ├── components/             # Reusable components
    └── lib/
        ├── api.ts              # API client
        └── auth.ts             # Auth utilities
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token

### Metrics
- `GET /metrics/live` - Get live system metrics

### Incidents
- `GET /incidents` - Get all incidents
- `POST /incidents/create` - Create incident (admin only)

### Maintenance
- `GET /maintenance` - Get maintenance status
- `POST /maintenance/enable` - Enable maintenance mode (admin only)
- `POST /maintenance/disable` - Disable maintenance mode (admin only)

### Prediction
- `POST /predict/update-risk` - Predict downtime risk for an update (admin only)

## 🎨 Features Overview

### 1. Admin Dashboard (`/dashboard`)
- Real-time system health cards
- Live charts for CPU, RAM, response time, and error rate
- Recent incidents table
- Auto-refreshes every 3 seconds

### 2. Update Planner (`/dashboard/update-planner`)
- Input update details (title, type, services, migration, etc.)
- Get risk score (0-100) and risk level (Low/Medium/High)
- Predicted downtime range
- Risk reasons and recommendations

### 3. Public Status Page (`/status`)
- Current system status (Operational/Degraded/Down/Maintenance)
- Maintenance ETA countdown with progress bar
- Recent incidents list
- No authentication required

### 4. Maintenance Control (`/dashboard/maintenance`)
- Enable/disable maintenance mode
- Set ETA in minutes
- View current maintenance status

## 🔒 Security Notes

- JWT tokens are stored in localStorage (for MVP)
- In production, use httpOnly cookies for tokens
- Change the SECRET_KEY in `backend/auth.py` for production
- Add rate limiting and input validation for production

## 🧪 Testing the Application

1. **Login**: Go to `/login` and use the default credentials
2. **View Dashboard**: See live metrics updating every 3 seconds
3. **Test Update Planner**: 
   - Go to `/dashboard/update-planner`
   - Fill in update details
   - Click "Analyze Update Risk"
   - See risk prediction
4. **Enable Maintenance**:
   - Go to `/dashboard/maintenance`
   - Set ETA and enable maintenance
   - Check `/status` page to see maintenance mode
5. **View Status Page**: Go to `/status` (no login required)

## 📊 Metrics Simulation

The backend simulates realistic server metrics:
- CPU and RAM fluctuate smoothly
- Random spikes occur occasionally
- Error rate and response time affect system status
- Status changes: operational → degraded → down based on thresholds

## 🎯 Risk Prediction Logic

The risk predictor uses rule-based scoring:
- **Update Type**: Major (+25), Hotfix (+15), Minor (+5)
- **Database Migration**: +30 points
- **Critical Services**: +20 per service (payments, database, auth)
- **Long Deployments**: +15 for >15 minutes
- **High-Risk Keywords**: +10 (schema, migration, refactor, etc.)

Risk Levels:
- **0-30**: Low
- **31-60**: Medium
- **61-100**: High

## 🚧 Future Enhancements

- Replace rule-based predictor with ML model
- Add email/telegram notifications
- Real server metrics integration
- User management (multiple admins)
- Historical data analysis
- Custom alert thresholds
- Database migration to PostgreSQL/MySQL

## 📝 License

This is an MVP project for demonstration purposes.

## 🤝 Contributing

This is a complete MVP. Feel free to extend it with additional features!

---

**Built with ❤️ for server monitoring and downtime prediction**
