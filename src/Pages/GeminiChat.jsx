import { useState, useEffect } from "react";
import "../styles/GeminiChat.css";
import { ACCESS_TOKEN } from "../constants";

function MicrocourseQuiz() {
    const [microcourse, setMicrocourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userScore, setUserScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    async function fetchMicrocourse() {
        setLoading(true);
        setError("");
        setMicrocourse(null);

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const res = await fetch("http://127.0.0.1:8000/api/generate-microcourse/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setMicrocourse({
                    ...data,
                    content: data.content.replace(/[#*]/g, "") // Remove unwanted symbols
                });
            } else {
                throw new Error(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchUserScore() {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const res = await fetch("http://127.0.0.1:8000/api/user-score/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUserScore(data.score);
            }
        } catch (error) {
            console.error("Error fetching user score:", error);
        }
    }

    async function submitAnswer(option) {
        setSelectedAnswer(option);
        setShowAnswer(true);
        if (option === microcourse.quiz.correct_option) {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                await fetch("http://127.0.0.1:8000/api/increment-user-score/", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setUserScore((prev) => prev + 10);
            } catch (error) {
                console.error("Error updating score:", error);
            }
        }
    }

    useEffect(() => {
        fetchMicrocourse();
        fetchUserScore();
    }, []);

    return (
        <div className="chat-container">
            <h1>Mini Course</h1>
            <div className="user-score">User Score: {userScore}</div>
            {loading && <p>Loading microcourse...</p>}
            {error && <div className="chat-error">{error}</div>}
            {microcourse && (
                <div className="microcourse-content">
                    <h2>{microcourse.title}</h2>
                    <p className={"micro-text"}>{microcourse.content}</p>
                    <h3>Quiz</h3>
                    <p><strong>{microcourse.quiz.question_text}</strong></p>
                    <ul>
                        {microcourse.quiz.options.map((option, index) => (
                            <li key={index}>
                                <button onClick={() => submitAnswer(option)} disabled={showAnswer}>
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {showAnswer && (
                        <p>
                            {selectedAnswer === microcourse.quiz.correct_option
                                ? "Correct! You earned 10 points."
                                : `Wrong! The correct answer was ${microcourse.quiz.correct_option}.`}
                        </p>
                    )}
                    <button onClick={fetchMicrocourse} className="next-button">Next Microcourse</button>
                </div>
            )}
        </div>
    );
}

export default MicrocourseQuiz;

