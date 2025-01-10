from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import os
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

# Configure Gemini API
api_key = os.getenv("api_key")
genai.configure(api_key=api_key)  # Use your GCP API key here
model = genai.GenerativeModel("gemini-1.5-flash")

# Endpoint to generate a coding challenge
@app.route('/generate-challenge', methods=['POST'])
def generate_challenge():
    difficulty = request.json.get('difficulty', 'easy')
    
    # Prompts for challenge generation based on difficulty
    prompts = {
        'easy': "Generate a simple data structure coding problem for beginners.",
        'medium': "Generate an intermediate-level data structure coding problem for a developer.",
        'hard': "Generate a challenging data structure coding problem for an experienced programmer."
    }
    
    prompt = prompts.get(difficulty, "Generate a coding problem.")
    
    try:
        # Generate the challenge using Gemini API
        response = model.generate_content(prompt)
        challenge = response.text
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({
        'title': f'{difficulty.capitalize()} Challenge',
        'description': challenge
    })

# Endpoint to evaluate user's code
@app.route('/grade-code', methods=['POST'])
def grade_code():
    user_code = request.json.get('userCode', '')  # Code submitted by the user
    question = request.json.get('question', '')  # Question description

    # Prompt for grading
    grading_prompt = f"""
    Evaluate the following code submission for the given question:
    
    Question:
    {question}

    User's Code:
    {user_code}

    Provide detailed feedback on whether the user's code is correct. 
    If incorrect, mention the issues and areas of improvement.
    """

    try:
        # Generate grading feedback using Gemini API
        response = model.generate_content(grading_prompt)
        feedback = response.text
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({
        'feedback': feedback
    })

if __name__ == '__main__':
    app.run(port=5001)
