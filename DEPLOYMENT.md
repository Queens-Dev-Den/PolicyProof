# PolicyProof Deployment Guide

Complete guide for deploying PolicyProof to production using Vercel, GoDaddy, Clerk, Render, and AWS.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [1. AWS Bedrock Setup](#1-aws-bedrock-setup)
- [2. Clerk Authentication Setup](#2-clerk-authentication-setup)
- [3. Backend Deployment (Render)](#3-backend-deployment-render)
- [4. Frontend Deployment (Vercel)](#4-frontend-deployment-vercel)
- [5. Custom Domain Setup (GoDaddy)](#5-custom-domain-setup-godaddy)
- [6. Testing & Verification](#6-testing--verification)
- [7. Troubleshooting](#7-troubleshooting)

## Architecture Overview

```
┌─────────────┐
│   GoDaddy   │ (Domain: policyproof.com)
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌─────────────┐                   ┌─────────────┐
│   Vercel    │                   │    Render   │
│  (Frontend) │◄──────────────────│  (Backend)  │
│   React     │    API Calls      │    Flask    │
└──────┬──────┘                   └──────┬──────┘
       │                                  │
       │                                  │
       ▼                                  ▼
┌─────────────┐                   ┌─────────────┐
│    Clerk    │                   │ AWS Bedrock │
│    (Auth)   │                   │   (Claude)  │
└─────────────┘                   └─────────────┘
```

## Prerequisites

Before starting, ensure you have:

- ✅ AWS Account with Bedrock access
- ✅ Clerk account (free tier available)
- ✅ Vercel account (free tier available)
- ✅ Render account (free tier available)
- ✅ GoDaddy domain (or any DNS provider)
- ✅ Git repository (GitHub/GitLab/Bitbucket)

## 1. AWS Bedrock Setup

### Enable Bedrock Access

1. **Login to AWS Console**
   - Navigate to AWS Bedrock service
   - Region: `us-east-1` (recommended for Claude availability)

2. **Request Model Access**
   - Go to Bedrock → Model access
   - Request access to **Anthropic Claude 3.5 Sonnet**
   - Wait for approval (usually instant)

3. **Create IAM User for Backend**
   ```bash
   # Create IAM user with Bedrock permissions
   - User name: policyproof-backend
   - Access type: Programmatic access
   ```

4. **Attach Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

5. **Save Credentials**
   - Access Key ID: `AKIA...`
   - Secret Access Key: `...`
   - ⚠️ Keep these secure - needed for Render deployment

## 2. Clerk Authentication Setup

### Create Clerk Application

1. **Sign up at [clerk.com](https://clerk.com)**

2. **Create New Application**
   - Name: `PolicyProof`
   - Authentication methods: Enable Email, Google, GitHub
   - Sign-in page: Custom (we handle this)

3. **Configure Settings**
   - Navigate to: Configure → Paths
   - Sign-in URL: `/authentication`
   - Sign-up URL: `/authentication`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

4. **Get API Keys**
   - Go to: API Keys
   - Copy: **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - ⚠️ Save for later use

5. **Set Up Production Instance**
   - Go to: Domains
   - Add your production domain: `policyproof.com`
   - Update API keys to production keys (starts with `pk_live_`)

## 3. Backend Deployment (Render)

### Prepare Backend

1. **Create `render.yaml` in backend directory**
   ```yaml
   services:
     - type: web
       name: policyproof-backend
       runtime: python
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn app:app
       envVars:
         - key: AWS_ACCESS_KEY_ID
           sync: false
         - key: AWS_SECRET_ACCESS_KEY
           sync: false
         - key: AWS_REGION
           value: us-east-1
         - key: FLASK_ENV
           value: production
   ```

2. **Update `requirements.txt`**
   ```txt
   flask
   flask-cors
   boto3
   PyPDF2
   gunicorn
   ```

3. **Update `app.py` CORS settings**
   ```python
   from flask_cors import CORS
   
   app = Flask(__name__)
   CORS(app, origins=[
       "http://localhost:5173",
       "https://policyproof.com",
       "https://www.policyproof.com"
   ])
   ```

### Deploy to Render

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**
   - Connect your GitHub/GitLab repository
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

3. **Configure Environment Variables**
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: `us-east-1`
   - `FLASK_ENV`: `production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)
   - Copy the service URL: `https://policyproof-backend.onrender.com`

5. **Test Backend**
   ```bash
   curl https://policyproof-backend.onrender.com/health
   # Expected: {"status": "ok"}
   ```

## 4. Frontend Deployment (Vercel)

### Prepare Frontend

1. **Create `vercel.json` in root directory**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Update Environment Variables**
   - Production backend URL
   - Production Clerk keys

### Deploy to Vercel

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import Git Repository**
   - Click "New Project"
   - Import your repository
   - Framework Preset: Vite
   - Root Directory: `./`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
   VITE_BACKEND_URL=https://policyproof-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build completion (2-3 minutes)
   - Your site will be live at: `https://your-project.vercel.app`

## 5. Custom Domain Setup (GoDaddy)

### Configure DNS Records

1. **Login to GoDaddy**
   - Go to: My Products → DNS

2. **Add DNS Records for Vercel**
   
   **A Record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600 seconds
   ```

   **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600 seconds
   ```

3. **Add to Vercel**
   - Vercel Dashboard → Project Settings → Domains
   - Add domain: `policyproof.com`
   - Add domain: `www.policyproof.com`
   - Vercel will verify DNS automatically

4. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait 24-48 hours for DNS propagation
   - Verify at: `https://policyproof.com`

### Update Clerk Domain

1. **Clerk Dashboard**
   - Navigate to: Domains
   - Add production domain: `policyproof.com`
   - Update application URLs:
     - Home URL: `https://policyproof.com`
     - Sign-in redirect: `https://policyproof.com/dashboard`

## 6. Testing & Verification

### Pre-Launch Checklist

- [ ] Backend health check: `curl https://policyproof-backend.onrender.com/health`
- [ ] Frontend loads: Visit `https://policyproof.com`
- [ ] Authentication works: Sign up with test account
- [ ] PDF upload works: Upload test document
- [ ] Analysis runs: Check findings panel
- [ ] All frameworks selectable
- [ ] Re-analyze functionality works
- [ ] Responsive design (mobile/tablet)
- [ ] SSL certificate valid (green lock icon)

### Testing Commands

```bash
# Test backend API
curl -X POST https://policyproof-backend.onrender.com/analyze \
  -F "file=@test.pdf" \
  -F "frameworks=[\"GDPR\",\"HIPAA\"]"

# Check DNS propagation
nslookup policyproof.com
dig policyproof.com

# Test SSL
curl -I https://policyproof.com
```

## 7. Troubleshooting

### Common Issues

#### Backend Not Responding
- **Check Render logs**: Dashboard → Logs
- **Verify AWS credentials**: Environment variables set correctly
- **Check CORS**: Ensure frontend domain is allowed

#### Authentication Failing
- **Verify Clerk keys**: Must use production keys (`pk_live_`)
- **Check redirect URLs**: Must match production domain
- **Clear browser cache**: Ctrl+Shift+Delete

#### PDF Analysis Not Working
- **Check AWS Bedrock**: Model access approved
- **Verify IAM permissions**: Bedrock InvokeModel allowed
- **Check file size**: PDFs under 10MB recommended

#### Domain Not Resolving
- **Wait for DNS**: Can take 24-48 hours
- **Check nameservers**: Pointing to GoDaddy
- **Verify A record**: Points to Vercel IP

### Logs & Monitoring

**Vercel Logs:**
```bash
vercel logs policyproof-frontend
```

**Render Logs:**
- Dashboard → Service → Logs tab

**AWS CloudWatch:**
- Bedrock API calls and errors

## Environment Variables Reference

### Frontend (Vercel)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_BACKEND_URL=https://policyproof-backend.onrender.com
```

### Backend (Render)
```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
FLASK_ENV=production
```

## Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | Free |
| Render | Free | Free (with sleep) |
| Clerk | Free | Free (up to 10k users) |
| AWS Bedrock | Pay-as-you-go | ~$0.003/request |
| GoDaddy Domain | N/A | ~$12/year |

**Estimated Monthly Cost**: $0-5 (AWS usage only)

## Post-Deployment

### Monitoring
- Set up Vercel Analytics
- Enable Render auto-deploy on git push
- Configure AWS CloudWatch alarms

### Scaling
- Upgrade Render to paid plan (no sleep)
- Enable Vercel Edge Functions
- Consider Redis cache for findings

### Security
- Rotate AWS credentials quarterly
- Review Clerk security settings
- Enable rate limiting on backend
- Set up CORS properly

---

**Need Help?** Contact: support@policyproof.com
