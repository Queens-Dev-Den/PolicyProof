import os
import json
import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from schema import REPORT_TOOL, ASSISTANT_RESPONSE_TOOL

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS - origins can be set via CORS_ORIGINS env variable (comma-separated)
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, resources={r"/*": {"origins": cors_origins}})

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

def analyze_document_with_bedrock(pdf_content, frameworks=None):
    """Send document to AWS Bedrock Claude for analysis."""
    
    # Construct the full document text
    full_text = "\n\n".join([
        f"=== Page {page['page']} ===\n{page['content']}" 
        for page in pdf_content
    ])
    
    # Build the prompt with selected frameworks
    if frameworks and len(frameworks) > 0:
        frameworks_list = ", ".join(frameworks)
        framework_text = f" against the following compliance frameworks: {frameworks_list}"
    else:
        framework_text = ""
    
    prompt = f"""You are a compliance expert analyzing a policy document{framework_text}.

Review the following document and identify BOTH violations AND compliant sections. You must report:
1. VIOLATIONS - Any non-compliant sections, missing requirements, or policy gaps
2. COMPLIANCE - Any sections that properly implement the required controls and meet standards

For EACH finding (both violations and compliances):
- Clearly state whether it's a VIOLATION or COMPLIANCE
- Provide a clear title
- Identify the specific section
- Explain the issue or compliance in detail
- Reference the specific policy/regulation from the frameworks you're checking against
- Include the page number and exact quote from the document

IMPORTANT: You MUST include BOTH types of findings. Do not only report violations - also report what the document does well and where it is compliant.

{"IMPORTANT: Only check against these specific frameworks: " + frameworks_list + ". Do not check against any other compliance standards." if frameworks and len(frameworks) > 0 else ""}

Document to analyze:

{full_text}

Please analyze this document thoroughly and use the generate_policy_report tool to return ALL your findings (both violations and compliances)."""

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
        
        # Get selected frameworks from request
        frameworks = None
        frameworks_json = request.form.get('frameworks', None)
        if frameworks_json:
            try:
                frameworks = json.loads(frameworks_json)
            except json.JSONDecodeError:
                frameworks = None
        
        # Extract text from PDF
        pdf_content = extract_text_from_pdf(file)
        
        # Analyze with Bedrock
        analysis_result = analyze_document_with_bedrock(pdf_content, frameworks)
        
        # Return the findings
        return jsonify(analysis_result), 200
    
    except Exception as e:
        print(f"Error analyzing document: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/assistant/chat', methods=['POST'])
def assistant_chat():
    """Endpoint for live assistant chat with Claude AI."""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        selected_frameworks = data.get('frameworks', [])
        
        # Build the prompt with selected frameworks
        if selected_frameworks and len(selected_frameworks) > 0:
            frameworks_list = ", ".join(selected_frameworks)
            framework_context = f"The user has selected these compliance frameworks: {frameworks_list}. Focus your answer on these specific frameworks."
        else:
            framework_context = "Answer based on general compliance and policy frameworks."
        
        prompt = f"""You are a compliance and policy expert assistant. Answer the user's question about policy frameworks and compliance requirements.

{framework_context}

User question: {user_message}

Provide a detailed, accurate answer. Use the provide_policy_guidance tool to structure your response with:
1. A comprehensive answer to the question
2. The frameworks you referenced in your answer
3. Specific articles, clauses, or sections you cited

Be professional, accurate, and cite specific regulations or standards where appropriate."""

        # Prepare the API request
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2048,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "tools": [ASSISTANT_RESPONSE_TOOL],
            "tool_choice": {
                "type": "tool",
                "name": "provide_policy_guidance"
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
            if content.get('type') == 'tool_use' and content.get('name') == 'provide_policy_guidance':
                return jsonify(content.get('input', {})), 200
        
        return jsonify({'error': 'No response generated'}), 500
    
    except Exception as e:
        print(f"Error in assistant chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('BACKEND_PORT', 5000))
    app.run(debug=True, port=port)
