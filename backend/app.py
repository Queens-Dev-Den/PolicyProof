import os
import json
import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from schema import REPORT_TOOL

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize AWS Bedrock client
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.getenv('AWS_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

def extract_text_from_pdf(pdf_file):
    """Extract text content from PDF file."""
    reader = PdfReader(pdf_file)
    text_content = []
    
    for page_num, page in enumerate(reader.pages, start=1):
        text = page.extract_text()
        text_content.append({
            'page': page_num,
            'content': text
        })
    
    return text_content

def analyze_document_with_bedrock(pdf_content, compliance_framework=None):
    """Send document to AWS Bedrock Claude for analysis."""
    
    # Construct the full document text
    full_text = "\n\n".join([
        f"=== Page {page['page']} ===\n{page['content']}" 
        for page in pdf_content
    ])
    
    # Build the prompt
    framework_text = f" against {compliance_framework}" if compliance_framework else ""
    prompt = f"""You are a compliance expert analyzing a policy document{framework_text}.

Review the following document and identify all violations and compliant sections. For each finding:
- Clearly state whether it's a VIOLATION or COMPLIANCE
- Provide a clear title
- Identify the specific section
- Explain the issue or compliance in detail
- Reference the specific policy/regulation
- Include the page number and exact quote from the document

Document to analyze:

{full_text}

Please analyze this document thoroughly and use the generate_policy_report tool to return your findings."""

    # Prepare the API request
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "tools": [REPORT_TOOL],
        "tool_choice": {
            "type": "tool",
            "name": "generate_policy_report"
        }
    }
    
    # Call Bedrock API
    response = bedrock_runtime.invoke_model(
        modelId='us.anthropic.claude-3-5-sonnet-20241022-v2:0',
        body=json.dumps(request_body)
    )
    
    # Parse the response
    response_body = json.loads(response['body'].read())
    
    # Extract tool use result
    for content in response_body.get('content', []):
        if content.get('type') == 'tool_use' and content.get('name') == 'generate_policy_report':
            return content.get('input', {})
    
    return {"findings": []}

@app.route('/api/analyze-document', methods=['POST'])
def analyze_document():
    """Endpoint to receive PDF and return compliance findings."""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        # Get optional compliance framework parameter
        compliance_framework = request.form.get('framework', None)
        
        # Extract text from PDF
        pdf_content = extract_text_from_pdf(file)
        
        # Analyze with Bedrock
        analysis_result = analyze_document_with_bedrock(pdf_content, compliance_framework)
        
        # Return the findings
        return jsonify(analysis_result), 200
    
    except Exception as e:
        print(f"Error analyzing document: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.getenv('BACKEND_PORT', 5000))
    app.run(debug=True, port=port)
