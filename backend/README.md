# PolicyProof - Backend Setup Guide

## Prerequisites
- Python 3.8 or higher
- AWS Account with Bedrock access
- AWS CLI configured or API credentials

## Installation Steps

### 1. Install Python Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure AWS Credentials

Copy the example environment file and add your AWS credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your AWS credentials:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

**Important**: Make sure you have access to AWS Bedrock and specifically the Claude 3.5 Sonnet model (`anthropic.claude-3-5-sonnet-20241022-v2:0`)

### 3. Start the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 4. Start the Frontend

In a separate terminal, from the project root:

```bash
npm run dev
```

## API Endpoints

### POST /api/analyze-document
Analyzes a PDF document for compliance violations and compliant sections.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - `file`: PDF file
  - `framework` (optional): Compliance framework to check against

**Response:**
```json
{
  "findings": [
    {
      "type": "VIOLATION" | "COMPLIANCE",
      "title": "Finding title",
      "section": "Section identifier",
      "message": "Detailed explanation",
      "policy_reference": "GDPR Article 5(1)(e)",
      "location_metadata": {
        "page_number": 1,
        "exact_quote": "Text from document"
      }
    }
  ]
}
```

### GET /api/health
Health check endpoint

## How It Works

1. User uploads a PDF in the frontend
2. Frontend sends PDF to backend `/api/analyze-document` endpoint
3. Backend extracts text from PDF using PyPDF2
4. Backend sends document text to AWS Bedrock Claude with the schema from `schema.py`
5. Claude analyzes the document and returns structured findings using the tool specification
6. Backend returns findings to frontend
7. Frontend displays findings in the FindingsPanel component

## Troubleshooting

### "Failed to analyze document" error
- Ensure the backend server is running on port 5000
- Check that AWS credentials are correctly configured
- Verify you have access to AWS Bedrock

### AWS Permissions
Your AWS IAM user/role needs the following permission:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-*"
    }
  ]
}
```

### CORS Issues
If you encounter CORS errors, make sure the backend CORS configuration allows requests from your frontend origin (default: localhost:5173 for Vite).
