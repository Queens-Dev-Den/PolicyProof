# PolicyProof

AI-Powered Policy Compliance Analysis Tool

## Overview

PolicyProof is a web application that helps organizations analyze their policy documents for compliance against 15+ regulatory frameworks including GDPR, HIPAA, SOC 2, ISO 27001, and more. Using AWS Bedrock's Claude AI, it provides instant compliance analysis with detailed findings and recommendations.

## Features

- 📄 **PDF Document Analysis** - Upload and analyze policy documents
- 🔍 **Multi-Framework Compliance** - Check against 15+ regulatory frameworks
- 🤖 **AI-Powered Insights** - Leverages Claude AI for intelligent analysis
- 🔐 **Secure Authentication** - Clerk authentication for user management
- 💬 **Live Assistant** - Interactive policy guidance
- ⚙️ **Governance Settings** - Manage policy directories and frameworks

## Tech Stack

### Development
- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS, Framer Motion
- **Authentication**: Clerk
- **PDF Rendering**: react-pdf
- **AI Analysis**: AWS Bedrock (Claude 3.5 Sonnet)
- **Backend**: Flask (Python)
- **Routing**: React Router

### Hosting & Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Domain**: GoDaddy (DNS)
- **Authentication**: Clerk (Production)
- **AI Processing**: AWS Bedrock (us-east-1)
- **SSL**: Vercel (Auto-provisioned)

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.8+ (for backend)
- AWS Account with Bedrock access
- Clerk account for authentication

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd PolicyProof

# Install frontend dependencies
npm i

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### Configuration

1. Create a `.env` file in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

2. Configure AWS credentials for Bedrock access

### Running the Application

```sh
# Start the frontend development server
npm run dev

# In a separate terminal, start the backend server
cd backend
python app.py
```

The application will be available at `http://localhost:5173`

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy Summary

1. **Backend (Render)**: Deploy Flask API with AWS Bedrock integration
2. **Frontend (Vercel)**: Deploy React app with Clerk authentication
3. **Domain (GoDaddy)**: Configure DNS to point to Vercel
4. **SSL**: Automatically provisioned by Vercel

**Production Stack:**
- Frontend: Vercel (https://policyproof.com)
- Backend: Render (https://policyproof-backend.onrender.com)
- Auth: Clerk Production
- AI: AWS Bedrock (us-east-1)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.
