import google.generativeai as genai
import sys
import json

# Configure API key
genai.configure(api_key="AIzaSyAtD5JtVI2xF1TK5b-eQMSULaLPSbUyth0")

# Get arguments from the command line
pdf_path = sys.argv[1]  # First argument: PDF file path
prompt = sys.argv[2]  # Second argument: Prompt text

# Read the PDF file
with open(pdf_path, "rb") as pdf_file:
    pdf_data = pdf_file.read()

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Generate content
response = model.generate_content([
    {"mime_type": "application/pdf", "data": pdf_data},
    prompt
])

# Output the result as JSON
print(json.dumps({"text": response.text}))
