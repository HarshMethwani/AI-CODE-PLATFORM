import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import CodeEditor from '../components/CodeEditor';

const Home = () => {
    const [difficulty, setDifficulty] = useState('easy');
    const [challenge, setChallenge] = useState(''); // Challenge description
    const [userCode, setUserCode] = useState(''); // User's code
    const [feedback, setFeedback] = useState(''); // Feedback after grading
    const [loading, setLoading] = useState(false); // Loading state for buttons

    // Generate a coding challenge
    const generateChallenge = async () => {
        setLoading(true); // Show loading for the Generate button
        try {
            const response = await axios.post('http://localhost:5001/generate-challenge', { difficulty });
            console.log('Generated Challenge:', response.data); // Debug lo
            const generatedChallenge = response.data.description;
            setChallenge(generatedChallenge); // Set the challenge description
            setFeedback(''); // Clear any previous feedback
        } catch (error) {
            alert('Error generating challenge. Please try again.');
        } finally {
            setLoading(false); // Hide loading
        }
    };

    // Grade the user's code
    const gradeCode = async () => {
        setLoading(true); // Show loading for the Submit button
        try {
            const response = await axios.post('http://localhost:5001/grade-code', {
                userCode, // User's code
                question: challenge, // Challenge description
            });
            setFeedback(response.data.feedback); // Set the feedback from the backend
        } catch (error) {
            alert('Error grading code. Please try again.');
        } finally {
            setLoading(false); // Hide loading
        }
    };

    return (
        <div className="home">
            <h2>Generate a Coding Challenge</h2>
            <div className="controls">
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button onClick={generateChallenge} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Challenge'}
                </button>
            </div>

            {/* Show challenge and code editor if a challenge has been generated */}
            {challenge && (
                <>
                    <h3>Challenge Description</h3>
                    <div className="challenge">
                        <ReactMarkdown>{challenge}</ReactMarkdown>
                    </div>
                    <h3>Your Code</h3>
                    <button className="submit-button" onClick={gradeCode} disabled={loading} >
                        {loading ? 'Submitting...' : 'Submit Code'}
                    </button>
                    <CodeEditor code={userCode} setCode={setUserCode}></CodeEditor>
                    {feedback && (
                        <>
                            <h3>Feedback</h3>
                            <p className="feedback">{feedback}</p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
