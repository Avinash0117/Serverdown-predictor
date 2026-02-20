# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: `http://localhost:8000`

### Step 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Step 3: Login

1. Go to `http://localhost:3000/login`
2. Use credentials:
   - Email: `admin@uptimeguard.ai`
   - Password: `admin123`

### Step 4: Explore

- **Dashboard**: View live metrics updating every 3 seconds
- **Update Planner**: Test risk prediction with sample data
- **Status Page**: Visit `http://localhost:3000/status` (no login needed)
- **Maintenance**: Enable maintenance mode and see it on status page

## 📝 Sample Update for Testing

Try this in Update Planner:
- **Title**: Payment API v2.0
- **Type**: Major
- **Services**: payments, database
- **DB Migration**: Yes
- **Expected Time**: 20 minutes
- **Description**: "Major schema migration for payment processing"

This should show a **High** risk score with detailed reasons and recommendations.

## ✅ Verification Checklist

- [x] Backend starts without errors
- [x] Frontend starts without errors
- [x] Can login with default credentials
- [x] Dashboard shows live metrics
- [x] Charts update automatically
- [x] Update planner returns risk predictions
- [x] Status page accessible without login
- [x] Maintenance mode works
- [x] Incidents appear automatically when metrics spike

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Ensure virtual environment is activated
- Try: `pip install --upgrade pip`

**Frontend won't start:**
- Check Node.js version (18+)
- Delete `node_modules` and run `npm install` again

**CORS errors:**
- Ensure backend is running on port 8000
- Check `backend/main.py` CORS settings

**Can't login:**
- Check backend is running
- Verify admin user was created (check console output)
- Try restarting backend

## 📊 API Documentation

Once backend is running, visit:
- `http://localhost:8000/docs` - Interactive API documentation
- `http://localhost:8000/redoc` - Alternative API docs
