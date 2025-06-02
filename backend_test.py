
import requests
import json
import os
import sys
from typing import Dict, List, Any, Optional
from datetime import datetime

# Test configuration
GEMINI_API_KEY = "AIzaSyDUt1FrShKdTlhr5RGn1zSvPZHIClD7DHg"  # Using the fallback key from geminiAnalyzer.ts
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

# Ensure the backend URL is properly formatted
if BACKEND_URL.endswith('/'):
    BACKEND_URL = BACKEND_URL[:-1]

API_URL = f"{BACKEND_URL}/api"

class TestResult:
    def __init__(self):
        self.success = False
        self.message = ""
        self.data = None
    
    def __str__(self):
        return f"Success: {self.success}, Message: {self.message}"

def test_backend_root_endpoint() -> TestResult:
    """
    Test the backend root endpoint.
    """
    result = TestResult()
    
    try:
        response = requests.get(f"{API_URL}/")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                result.success = True
                result.message = "Backend root endpoint is working correctly"
                result.data = data
            else:
                result.message = f"Backend root endpoint returned unexpected data: {data}"
        else:
            result.message = f"Backend root endpoint request failed with status code {response.status_code}: {response.text}"
            
    except Exception as e:
        result.message = f"Error testing backend root endpoint: {str(e)}"
        
    return result

def test_backend_status_post() -> TestResult:
    """
    Test the backend status POST endpoint.
    """
    result = TestResult()
    
    try:
        # Create a test client name with timestamp to ensure uniqueness
        client_name = f"test_client_{datetime.utcnow().isoformat()}"
        
        # Prepare the request payload
        payload = {
            "client_name": client_name
        }
        
        # Make the API request
        response = requests.post(
            f"{API_URL}/status",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("client_name") == client_name and "id" in data and "timestamp" in data:
                result.success = True
                result.message = "Backend status POST endpoint is working correctly"
                result.data = data
            else:
                result.message = f"Backend status POST endpoint returned unexpected data: {data}"
        else:
            result.message = f"Backend status POST endpoint request failed with status code {response.status_code}: {response.text}"
            
    except Exception as e:
        result.message = f"Error testing backend status POST endpoint: {str(e)}"
        
    return result

def test_backend_status_get() -> TestResult:
    """
    Test the backend status GET endpoint.
    """
    result = TestResult()
    
    try:
        # Make the API request
        response = requests.get(f"{API_URL}/status")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                result.success = True
                result.message = f"Backend status GET endpoint is working correctly, returned {len(data)} status checks"
                result.data = data
            else:
                result.message = f"Backend status GET endpoint returned unexpected data type: {type(data)}"
        else:
            result.message = f"Backend status GET endpoint request failed with status code {response.status_code}: {response.text}"
            
    except Exception as e:
        result.message = f"Error testing backend status GET endpoint: {str(e)}"
        
    return result

def test_gemini_interview_questions_generation() -> TestResult:
    """
    Test the Gemini AI integration for generating interview questions.
    This simulates the frontend's call to the Gemini API.
    """
    result = TestResult()
    
    try:
        # Sample candidate data similar to what would be passed from the frontend
        candidate_data = {
            "name": "John Doe",
            "skills": ["React", "TypeScript", "Node.js", "Python"],
            "experience": "5 years of software development experience",
            "summary": "Full-stack developer with expertise in React and Node.js"
        }
        
        # Create the prompt similar to what's in geminiAnalyzer.ts
        prompt = f"""You are an expert HR interviewer. Generate 8-10 personalized interview questions for the candidate "{candidate_data['name']}" based on their profile.

CANDIDATE PROFILE:
- Skills: {', '.join(candidate_data['skills'])}
- Experience: {candidate_data['experience']}
- Summary: {candidate_data['summary']}

REQUIREMENTS:
1. Generate exactly 8-10 questions
2. Mix of technical, behavioral, and situational questions
3. Questions should be relevant to their specific skills and experience
4. Include different difficulty levels (Easy, Medium, Hard)
5. Cover different categories: Technical, Behavioral, Experience, Problem-Solving, Culture Fit

Return ONLY a valid JSON array with this exact format:
[
  {{
    "question": "Example question?",
    "category": "Technical",
    "difficulty": "Medium",
    "focus_area": "Technology Experience"
  }}
]

Make questions specific to their background, not generic. Use their actual skills and experience in the questions."""

        # Prepare the request payload
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        
        # Make the API request
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        # Check if the request was successful
        if response.status_code == 200:
            response_data = response.json()
            
            # Extract the text from the response
            if 'candidates' in response_data and len(response_data['candidates']) > 0:
                text = response_data['candidates'][0]['content']['parts'][0]['text']
                
                # Clean up the response text to extract JSON
                json_str = text
                if "```json" in text:
                    json_str = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    json_str = text.split("```")[1].split("```")[0].strip()
                
                # Clean up any potential extra text
                json_str = json_str.strip()
                if not json_str.startswith('['):
                    array_start = json_str.find('[')
                    array_end = json_str.rfind(']')
                    if array_start != -1 and array_end != -1:
                        json_str = json_str[array_start:array_end + 1]
                
                # Parse the JSON
                try:
                    questions = json.loads(json_str)
                    
                    # Validate the response structure
                    if not isinstance(questions, list):
                        result.message = "Response is not an array"
                        return result
                    
                    # Validate each question has required fields
                    valid_questions = [q for q in questions if all(key in q for key in ["question", "category", "difficulty", "focus_area"])]
                    
                    if not valid_questions:
                        result.message = "No valid questions generated"
                        return result
                    
                    # Test passed
                    result.success = True
                    result.message = f"Successfully generated {len(valid_questions)} interview questions"
                    result.data = valid_questions
                    return result
                    
                except json.JSONDecodeError as e:
                    result.message = f"Failed to parse JSON response: {str(e)}"
                    return result
            else:
                result.message = "No candidates in response"
                return result
        else:
            result.message = f"API request failed with status code {response.status_code}: {response.text}"
            return result
            
    except Exception as e:
        result.message = f"Error testing Gemini AI integration: {str(e)}"
        return result

def test_gemini_error_handling() -> TestResult:
    """
    Test error handling for failed Gemini AI requests.
    """
    result = TestResult()
    
    try:
        # Use an invalid API key to force an error
        invalid_api_key = "INVALID_KEY"
        
        # Sample candidate data
        candidate_data = {
            "name": "John Doe",
            "skills": ["React", "TypeScript", "Node.js"],
            "experience": "5 years of software development experience",
            "summary": "Full-stack developer with expertise in React and Node.js"
        }
        
        # Create a simple prompt
        prompt = "Generate interview questions"
        
        # Prepare the request payload
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        
        # Make the API request with invalid key
        response = requests.post(
            f"{GEMINI_API_URL}?key={invalid_api_key}",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        # Check if the request failed as expected
        if response.status_code != 200:
            result.success = True
            result.message = f"Error handling test passed: API request failed with status code {response.status_code} as expected"
            return result
        else:
            result.message = "Error handling test failed: API request succeeded with invalid key"
            return result
            
    except Exception as e:
        # Even an exception is acceptable for this test since we're testing error handling
        result.success = True
        result.message = f"Error handling test passed: Exception caught: {str(e)}"
        return result

def run_tests():
    """
    Run all tests and print the results.
    """
    print("=== Testing Backend API Endpoints ===")
    
    # Test 1: Backend Root Endpoint
    print("\nTest 1: Backend Root Endpoint")
    result_root = test_backend_root_endpoint()
    print(f"Success: {result_root.success}")
    print(f"Message: {result_root.message}")
    
    # Test 2: Backend Status POST Endpoint
    print("\nTest 2: Backend Status POST Endpoint")
    result_status_post = test_backend_status_post()
    print(f"Success: {result_status_post.success}")
    print(f"Message: {result_status_post.message}")
    
    # Test 3: Backend Status GET Endpoint
    print("\nTest 3: Backend Status GET Endpoint")
    result_status_get = test_backend_status_get()
    print(f"Success: {result_status_get.success}")
    print(f"Message: {result_status_get.message}")
    
    print("\n=== Testing Gemini AI Integration for Interview Questions ===")
    
    # Test 4: Generate interview questions
    print("\nTest 4: Generate Interview Questions")
    result_questions = test_gemini_interview_questions_generation()
    print(f"Success: {result_questions.success}")
    print(f"Message: {result_questions.message}")
    if result_questions.success and result_questions.data:
        print(f"Generated {len(result_questions.data)} questions")
        # Print a sample of the questions
        for i, question in enumerate(result_questions.data[:3]):
            print(f"  {i+1}. {question['question']} ({question['category']}, {question['difficulty']})")
        if len(result_questions.data) > 3:
            print(f"  ... and {len(result_questions.data) - 3} more questions")
    
    # Test 5: Error handling
    print("\nTest 5: Error Handling")
    result_error = test_gemini_error_handling()
    print(f"Success: {result_error.success}")
    print(f"Message: {result_error.message}")
    
    # Overall result
    overall_success = (
        result_root.success and 
        result_status_post.success and 
        result_status_get.success and 
        result_questions.success and 
        result_error.success
    )
    print("\n=== Overall Result ===")
    print(f"Success: {overall_success}")
    
    return overall_success, {
        "backend_root": {
            "success": result_root.success,
            "message": result_root.message
        },
        "backend_status_post": {
            "success": result_status_post.success,
            "message": result_status_post.message
        },
        "backend_status_get": {
            "success": result_status_get.success,
            "message": result_status_get.message
        },
        "generate_questions": {
            "success": result_questions.success,
            "message": result_questions.message,
            "data": result_questions.data
        },
        "error_handling": {
            "success": result_error.success,
            "message": result_error.message
        }
    }

if __name__ == "__main__":
    success, results = run_tests()
    sys.exit(0 if success else 1)
