# Deployment Guide for Render

## Quick Deploy to Render

1. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free (or upgrade as needed)

3. **Set Environment Variables**
   In Render dashboard, add these environment variables:
   ```
   NODE_ENV=production
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Health Check**
   - **Health Check Path**: `/api/health`

## Alternative: One-Click Deploy

If using the `render.yaml` file in this repository:

1. Fork this repository to your GitHub
2. Go to Render Dashboard
3. Click "New" → "Blueprint"
4. Connect your forked repository
5. Add your Supabase credentials in the environment variables section

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `production` |
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Post-Deployment Verification

After deployment, visit these endpoints to verify:
- `https://your-app.onrender.com/api/health` - Should return `{"status":"ok",...}`
- `https://your-app.onrender.com` - Should load the Telegram Mini App interface

## Telegram Bot Configuration

Update your Telegram bot's Mini App URL to point to your deployed Render URL:
- Old: `https://your-replit-app.replit.dev`
- New: `https://your-app-name.onrender.com`

## Notes

- Render free tier may have cold starts (slower initial response)
- Database connection will work the same as in development
- All Telegram WebApp features will function normally
- The app will automatically handle both desktop and mobile Telegram clients