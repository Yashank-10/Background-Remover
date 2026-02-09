# Deploying Background-Remover Backend to Render

## Step-by-Step Deployment Guide

### Prerequisites
1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at https://render.com
3. **Git installed** - For version control

---

## Step 1: Prepare Your Repository

Your project is now ready with these files:
- ✅ `Procfile` - Tells Render how to run your app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `requirements.txt` - Lists all dependencies
- ✅ `backend/api/main.py` - Your FastAPI application

### Push to GitHub
```bash
cd d:\Minor Projects\Background-Remover
git add .
git commit -m "Add Render deployment configuration"
git push
```

---

## Step 2: Create a Render Account & New Web Service

1. Go to https://render.com
2. Click **"New +"** → Select **"Web Service"**
3. Click **"Connect a repository"** and authorize GitHub
4. Select your **Background-Remover** repository
5. Click **"Connect"**

---

## Step 3: Configure the Web Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `background-remover-api` (or your choice) |
| **Environment** | `Python 3` |
| **Region** | Select closest to your users |
| **Branch** | `main` (or your default branch) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn api.main:app --host 0.0.0.0 --port $PORT` |

**Important:** Make sure the build & start commands reference the correct path from root.

### Advanced Settings
- **Root Directory**: Leave empty (or set to `backend/` if config doesn't work)
- **Auto-Deploy**: Toggle ON (auto-redeploy on git push)

---

## Step 4: Update Your Frontend

Once deployed, update [app.js](../../app.js#L75) with your Render URL:

**Find this line:**
```javascript
const response = await fetch("http://localhost:8000/remove-bg", {
```

**Replace with:**
```javascript
const response = await fetch("https://background-remover-api.onrender.com/remove-bg", {
```

(Use the actual URL provided by Render)

---

## Step 5: Deploy & Test

1. Click **"Deploy"** button on Render
2. Watch the deployment logs
3. Once "Live" appears, test your API:

```bash
curl -X GET https://background-remover-api.onrender.com/health
```

Expected response:
```json
{"status": "ok"}
```

---

## Common Issues & Solutions

### Issue: "Build failed" error
- Check `requirements.txt` is in the backend folder
- Make sure all dependencies are listed

### Issue: "Port binding error"
- The `Procfile` command must use `$PORT` environment variable
- ✅ Currently set correctly: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### Issue: "Module not found" errors
- Ensure `python-3.11.10` in `runtime.txt` is compatible with your dependencies
- Run locally first: `uvicorn api.main:app` to verify it works

### Issue: CORS errors from frontend
- Your backend already has CORS enabled for all origins ✅
- Make sure frontend URL is correct in [app.js](../../app.js)

---

## Optional: Environment Variables

If you add authentication or API keys later:

1. In Render dashboard, go to **Environment**
2. Add key-value pairs (e.g., `API_KEY=xxx`)
3. Access in Python: `import os; api_key = os.getenv("API_KEY")`

---

## Monitoring & Logs

- View logs: Dashboard → Logs tab
- Monitor performance: Dashboard → Metrics tab
- Free tier gets ~750 hours/month

---

## Next Steps

After successful deployment:
1. Update frontend to use production API URL
2. Test the complete workflow (upload image, remove background)
3. Share your deployed app!

**Render URL**: `https://your-app-name.onrender.com`

---

**Need help?** Check [Render Documentation](https://render.com/docs) or [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
