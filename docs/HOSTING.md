# Hosting Guide for Portfolio Application

This guide covers hosting options for your full-stack portfolio application (React frontend + FastAPI backend + MongoDB).

## 🏗️ Architecture Overview

- **Frontend**: React app (static files after build)
- **Backend**: FastAPI (Python) API server
- **Database**: MongoDB

---

## 🎯 Recommended Hosting Options

### Option 1: **Railway** (Easiest - All-in-One) ⭐ RECOMMENDED

**Best for**: Quick deployment, beginner-friendly, free tier available

**Setup**:
1. **Frontend**: Connect GitHub repo → Select `frontend/` folder → Build command: `npm install && npm run build` → Start command: `npx serve -s build -l 3000`
2. **Backend**: Connect GitHub repo → Select `backend/` folder → Build command: `pip install -r requirements.txt` → Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **MongoDB**: Use Railway's MongoDB plugin (free tier available) or MongoDB Atlas (free)

**Pricing**: Free tier ($5 credit/month), then ~$5-20/month

**Pros**:
- ✅ Deploys both frontend and backend easily
- ✅ Automatic HTTPS
- ✅ Environment variables management
- ✅ Free tier available
- ✅ GitHub integration

**Cons**:
- ⚠️ Free tier limited
- ⚠️ May need paid plan for production

---

### Option 2: **Vercel (Frontend) + Render (Backend)** ⭐ BEST FREE OPTION

**Best for**: Free hosting, excellent performance

#### Frontend on Vercel:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Root directory: `frontend`
5. Build command: `npm run build`
6. Output directory: `build`
7. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

**Pricing**: Free forever (with limitations)

#### Backend on Render:
1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repo
4. Root directory: `backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables from your `.env` file

**Pricing**: Free tier available (spins down after inactivity)

**MongoDB**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier: 512MB)

---

### Option 3: **Netlify (Frontend) + Fly.io (Backend)**

**Best for**: Global CDN, edge functions

#### Frontend on Netlify:
1. Connect GitHub repo
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/build`
5. Add environment variable: `REACT_APP_API_URL=https://your-app.fly.dev/api`

**Pricing**: Free tier available

#### Backend on Fly.io:
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `backend/` folder: `fly launch`
3. Follow prompts
4. Deploy: `fly deploy`

**Pricing**: Free tier available (3 shared VMs)

---

### Option 4: **All on AWS/GCP/Azure** (Advanced)

**Best for**: Enterprise, full control, scalability

**AWS**:
- Frontend: S3 + CloudFront
- Backend: Elastic Beanstalk or EC2
- Database: DocumentDB or MongoDB Atlas

**GCP**:
- Frontend: Firebase Hosting
- Backend: Cloud Run or App Engine
- Database: MongoDB Atlas

**Pricing**: Pay-as-you-go (~$10-50/month minimum)

---

## 📋 Step-by-Step: Railway Deployment (Recommended)

### Prerequisites
- GitHub account
- Railway account ([railway.app](https://railway.app))

### Step 1: Prepare Your Code

1. **Update frontend `.env`** for production:
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

2. **Update backend `.env`** (you'll add these in Railway dashboard):
```env
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGINS=https://your-frontend.railway.app,https://your-custom-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### Step 2: Deploy Backend

1. Go to Railway → New Project → Deploy from GitHub
2. Select your repo
3. Add service → Select `backend/` folder
4. Railway auto-detects Python
5. Add environment variables:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `CORS_ORIGINS` (your frontend URL)
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD`
6. Deploy → Railway gives you a URL like `https://your-app.railway.app`

### Step 3: Deploy Frontend

1. Add another service → Select `frontend/` folder
2. Railway auto-detects Node.js
3. Override build command: `npm install && npm run build`
4. Override start command: `npx serve -s build -l $PORT`
5. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend.railway.app/api`
6. Deploy

### Step 4: Setup MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0 - Free tier)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all, or Railway's IPs)
5. Get connection string → Use in backend `MONGODB_URI`
6. Run seed script locally or via Railway CLI:
   ```bash
   railway run python seed_data.py
   ```

### Step 5: Custom Domain (Optional)

1. In Railway → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `CORS_ORIGINS` and `REACT_APP_API_URL` with new domain

---

## 📋 Step-by-Step: Vercel + Render (Free Option)

### Frontend on Vercel

1. **Push to GitHub** (if not already)
2. **Go to Vercel** → Import Project
3. **Select GitHub repo**
4. **Configure**:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Environment Variables**:
   - `REACT_APP_API_URL=https://your-backend.onrender.com/api`
6. **Deploy**

### Backend on Render

1. **Go to Render** → New → Web Service
2. **Connect GitHub repo**
3. **Configure**:
   - Name: `portfolio-backend`
   - Region: Choose closest
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables** (from your `.env`):
   - `MONGODB_URI`
   - `CORS_ORIGINS=https://your-frontend.vercel.app`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
5. **Deploy**

**Note**: Render free tier spins down after 15min inactivity. First request may be slow.

---

## 🔧 Important Configuration Changes

### Before Deploying:

1. **Backend CORS**: Update `CORS_ORIGINS` in backend `.env`:
   ```env
   CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-domain.com
   ```

2. **Frontend API URL**: Update `REACT_APP_API_URL` in frontend `.env`:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

3. **MongoDB Atlas**:
   - Create cluster (free M0 tier)
   - Whitelist Railway/Render IPs (or `0.0.0.0/0` for testing)
   - Get connection string
   - Update `MONGODB_URI` in backend

4. **Seed Database**: After first deploy, run:
   ```bash
   # Via Railway CLI
   railway run python seed_data.py
   
   # Or locally (if MONGODB_URI points to Atlas)
   cd backend && python seed_data.py
   ```

---

## 🚀 Quick Comparison

| Platform | Frontend | Backend | Free Tier | Ease | Best For |
|----------|----------|---------|-----------|------|----------|
| **Railway** | ✅ | ✅ | ✅ ($5 credit) | ⭐⭐⭐⭐⭐ | All-in-one |
| **Vercel + Render** | ✅ | ✅ | ✅ Forever | ⭐⭐⭐⭐ | Free hosting |
| **Netlify + Fly.io** | ✅ | ✅ | ✅ Forever | ⭐⭐⭐⭐ | Global CDN |
| **AWS/GCP** | ✅ | ✅ | ❌ (trial) | ⭐⭐ | Enterprise |

---

## 📝 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables prepared
- [ ] CORS origins updated
- [ ] Frontend API URL updated
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Database seeded with initial data
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS verified
- [ ] Admin login tested

---

## 🆘 Troubleshooting

### Backend not connecting to MongoDB
- Check `MONGODB_URI` format
- Verify IP whitelist in MongoDB Atlas
- Check backend logs in Railway/Render dashboard

### CORS errors
- Ensure `CORS_ORIGINS` includes your frontend URL (exact match)
- Check backend logs for CORS errors

### Frontend shows old API URL
- Rebuild frontend after changing `REACT_APP_API_URL`
- Clear browser cache
- Check environment variables in hosting dashboard

### 404 on refresh (React Router)
- Configure hosting for SPA routing:
  - **Vercel**: Create `vercel.json` with rewrites
  - **Netlify**: Create `_redirects` file
  - **Railway**: Use `serve` with `-s` flag (already in guide)

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

---

**Recommended for beginners**: Railway (all-in-one) or Vercel + Render (free)

**Recommended for production**: Railway (paid) or AWS/GCP (if you need scale)
