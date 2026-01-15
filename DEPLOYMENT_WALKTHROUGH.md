# PolicyProof Deployment Walkthrough

## Current Status: Pre-Deployment ✅

You've successfully set up the codebase! Now let's deploy it step by step.

---

## Phase 1: AWS Bedrock Setup (15 minutes)

### What you need:
- AWS Account (create at aws.amazon.com if you don't have one)
- Credit card (required for AWS, but we'll use free tier)

### Steps:

**1. Login to AWS Console**
   - Go to: https://console.aws.amazon.com/
   - Sign in with your AWS account

**2. Navigate to AWS Bedrock**
   - Search for "Bedrock" in the top search bar
   - Click on "Amazon Bedrock"
   - **Important**: Change region to **us-east-1** (top right dropdown)

**3. Request Model Access**
   - In the left sidebar, click "Model access"
   - Click "Manage model access" (orange button)
   - Find "Anthropic" section
   - Check the box for **"Claude 3.5 Sonnet"**
   - Scroll down, click "Request model access"
   - Wait 2-3 minutes for approval (usually instant)
   - Refresh page - status should show "Access granted" ✅

**4. Create IAM User**
   - Search for "IAM" in top search bar
   - Click "Users" in left sidebar
   - Click "Create user"
   - User name: `policyproof-backend`
   - Click "Next"
   - Select "Attach policies directly"
   - Click "Create policy" (opens new tab)

**5. Create Bedrock Policy**
   In the new tab:
   - Click "JSON" tab
   - Paste this:
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
   - Click "Next"
   - Policy name: `BedrockInvokePolicy`
   - Click "Create policy"
   - Close this tab, return to user creation tab

**6. Attach Policy to User**
   - Refresh the policy list
   - Search for "BedrockInvokePolicy"
   - Check the box
   - Click "Next"
   - Click "Create user"

**7. Get Access Keys**
   - Click on the user you just created
   - Click "Security credentials" tab
   - Scroll to "Access keys" section
   - Click "Create access key"
   - Select "Application running outside AWS"
   - Click "Next"
   - Add description: "PolicyProof Backend"
   - Click "Create access key"
   - **IMPORTANT**: Copy both keys NOW (you can't see them again)
     - Access key ID: `AKIA...` 
     - Secret access key: `...`
   - Save these in a secure location!

**✅ AWS Bedrock Setup Complete!**

---

## Phase 2: Clerk Authentication Setup (10 minutes)

### What you need:
- Email address
- No credit card required (free tier is generous)

### Steps:

**1. Create Clerk Account**
   - Go to: https://clerk.com
   - Click "Start building for free"
   - Sign up with email or GitHub

**2. Create Application**
   - After login, click "Create application"
   - Application name: `PolicyProof`
   - Select authentication methods:
     - ✅ Email
     - ✅ Google
     - ✅ GitHub (optional)
   - Click "Create application"

**3. Configure Paths**
   - In left sidebar, click "Paths"
   - Update these settings:
     - Sign-in URL: `/authentication`
     - Sign-up URL: `/authentication`
     - After sign-in URL: `/dashboard`
     - After sign-up URL: `/dashboard`
   - Click "Save"

**4. Get API Keys**
   - In left sidebar, click "API Keys"
   - Under "Development" section:
     - Copy **Publishable key** (starts with `pk_test_`)
     - Save this somewhere safe!

**✅ Clerk Setup Complete!** (We'll add production keys after deploying)

---

## Phase 3: Backend Deployment on Render (15 minutes)

### What you need:
- GitHub account
- Your AWS credentials from Phase 1

### Steps:

**1. Push Code to GitHub**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

**2. Create Render Account**
   - Go to: https://render.com
   - Click "Get Started"
   - Sign up with GitHub (recommended)
   - Authorize Render to access your repositories

**3. Create Web Service**
   - Click "New +" (top right)
   - Select "Web Service"
   - Find your PolicyProof repository
   - Click "Connect"

**4. Configure Service**
   - Name: `policyproof-backend`
   - Region: Oregon (US West) or closest to you
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Instance Type: **Free** (select this!)

**5. Add Environment Variables**
   Click "Advanced" → Add Environment Variables:
   
   ```
   AWS_ACCESS_KEY_ID = [Your AWS Access Key from Phase 1]
   AWS_SECRET_ACCESS_KEY = [Your AWS Secret Key from Phase 1]
   AWS_REGION = us-east-1
   FLASK_ENV = production
   ```

**6. Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Watch the logs - should see "Build successful" and "Starting server"
   - Once deployed, copy the service URL
     - Example: `https://policyproof-backend.onrender.com`
   - **Save this URL!**

**7. Test Backend**
   Open terminal and run:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Should return: `{"status": "ok"}`

**✅ Backend Deployed!**

**⚠️ Important Note**: Free tier on Render "sleeps" after 15 minutes of inactivity. First request after sleep takes 30-60 seconds. Upgrade to $7/month to eliminate sleep.

---

## Phase 4: Frontend Deployment on Vercel (10 minutes)

### What you need:
- GitHub account
- Your Render backend URL from Phase 3
- Your Clerk API key from Phase 2

### Steps:

**1. Update Environment Variables Locally**
   Create `.env` file in project root (if not exists):
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_[your_key_from_phase_2]
   VITE_BACKEND_URL=https://[your-render-url].onrender.com
   ```

**2. Test Locally**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:5173
   - Try signing up
   - Upload a test PDF
   - Verify analysis works
   - If everything works, continue!

**3. Create Vercel Account**
   - Go to: https://vercel.com
   - Click "Sign Up"
   - Sign up with GitHub (recommended)
   - Authorize Vercel

**4. Import Project**
   - Click "Add New" → "Project"
   - Find your PolicyProof repository
   - Click "Import"

**5. Configure Build**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**6. Add Environment Variables**
   Before deploying, add these:
   ```
   VITE_CLERK_PUBLISHABLE_KEY = pk_test_[your_key]
   VITE_BACKEND_URL = https://[your-render-url].onrender.com
   ```

**7. Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Once deployed, you'll get a URL like:
     - `https://policyproof-abc123.vercel.app`
   - **Save this URL!**

**8. Test Deployment**
   - Visit your Vercel URL
   - Try signing up with a test account
   - Upload a PDF
   - Check if analysis works
   - Test all features!

**✅ Frontend Deployed!**

---

## Phase 5: Custom Domain Setup (Optional - 30 minutes)

### What you need:
- Domain name from GoDaddy (or any registrar)
- Your Vercel deployment from Phase 4

### Steps:

**1. Configure DNS in GoDaddy**
   - Login to GoDaddy
   - Go to: My Products → DNS
   - Manage DNS for your domain

**2. Add DNS Records**
   
   **Delete existing A records for @ and www (if any)**
   
   **Add A Record:**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: `600 seconds`
   
   **Add CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `600 seconds`

**3. Add Domain to Vercel**
   - Vercel Dashboard → Your Project → Settings → Domains
   - Click "Add"
   - Enter your domain: `yourdomain.com`
   - Click "Add"
   - Also add: `www.yourdomain.com`

**4. Wait for Verification**
   - DNS propagation: 1-48 hours (usually 1-4 hours)
   - Vercel will automatically verify
   - SSL certificate automatically provisioned
   - Check status in Domains section

**5. Update Clerk Domain**
   - Clerk Dashboard → Domains
   - Add domain: `yourdomain.com`
   - Update redirect URLs to use your domain

**6. Update Clerk Production Keys**
   - Clerk Dashboard → API Keys
   - Switch from Development to Production
   - Copy production publishable key (starts with `pk_live_`)
   - Update Vercel environment variables:
     - Change `VITE_CLERK_PUBLISHABLE_KEY` to production key
   - Redeploy in Vercel

**✅ Custom Domain Setup Complete!**

---

## Phase 6: Update CORS (5 minutes)

Now that you have your production domain, update CORS in backend:

**1. Update app.py**
   In `backend/app.py`, update CORS configuration:
   ```python
   CORS(app, origins=[
       "http://localhost:5173",
       "https://your-vercel-url.vercel.app",
       "https://yourdomain.com",  # if using custom domain
       "https://www.yourdomain.com"  # if using custom domain
   ])
   ```

**2. Commit and Push**
   ```bash
   git add backend/app.py
   git commit -m "Update CORS for production"
   git push origin main
   ```

**3. Render Auto-Deploys**
   - Render detects the push
   - Automatically rebuilds (takes 2-3 minutes)
   - Check deployment logs in Render dashboard

**✅ CORS Updated!**

---

## Final Checklist

### Test Everything:

- [ ] Visit your production URL
- [ ] Sign up with a new account
- [ ] Check email verification (if enabled)
- [ ] Login with Google (if enabled)
- [ ] Upload a PDF document
- [ ] Select compliance frameworks
- [ ] Run analysis
- [ ] Check findings display correctly
- [ ] Click on findings to navigate PDF
- [ ] Test re-analyze with different frameworks
- [ ] Test live assistant (if implemented)
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate (green lock in browser)
- [ ] Test sign out
- [ ] Test sign back in

### Performance Check:

- [ ] First backend request (after sleep) < 60 seconds
- [ ] Subsequent requests < 5 seconds
- [ ] Frontend loads < 3 seconds
- [ ] PDF analysis completes < 30 seconds

---

## Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Hobby | **$0** |
| Render | Free | **$0** (with sleep) |
| Clerk | Free | **$0** (up to 10k MAU) |
| AWS Bedrock | Pay-per-use | **~$3-5** (estimated) |
| GoDaddy Domain | Yearly | **~$1/month** |

**Total Estimated Cost**: $4-6/month

To eliminate Render sleep: Upgrade to $7/month

---

## Troubleshooting

### Backend Issues:
```bash
# Check Render logs
# Dashboard → Service → Logs

# Common issue: AWS credentials not set
# Solution: Verify environment variables in Render

# Common issue: Module not found
# Solution: Check requirements.txt has all dependencies
```

### Frontend Issues:
```bash
# Check Vercel deployment logs
# Dashboard → Deployments → Latest → View Function Logs

# Common issue: Environment variables not set
# Solution: Add in Vercel → Settings → Environment Variables
# Then redeploy: Deployments → Latest → Redeploy

# Common issue: 404 on refresh
# Solution: Verify vercel.json has rewrites configuration
```

### CORS Issues:
```bash
# Error: "CORS policy: No 'Access-Control-Allow-Origin'"
# Solution: Add your frontend URL to CORS in backend/app.py
```

---

## Next Steps After Deployment

1. **Monitor Usage**
   - AWS CloudWatch for Bedrock usage
   - Vercel Analytics for traffic
   - Render metrics for backend performance

2. **Set Up Alerts**
   - AWS Budget alerts (spending over $10)
   - Render downtime notifications
   - Vercel deployment failure emails

3. **Backups**
   - Regularly backup AWS credentials
   - Document all environment variables
   - Keep copy of DNS records

4. **Security**
   - Rotate AWS keys every 90 days
   - Review Clerk security settings
   - Monitor failed login attempts

5. **Scaling Considerations**
   - Upgrade Render when traffic increases
   - Consider Vercel Pro for better performance
   - Implement caching for repeated analyses

---

**🎉 Congratulations! Your app is now live!**

Questions? Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides.
