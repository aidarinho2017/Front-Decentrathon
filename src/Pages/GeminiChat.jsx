import { useState } from "react";
import "../styles/GeminiChat.css"; // Import your CSS styles
import { ACCESS_TOKEN } from "../constants";

function GeminiChat() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function sendMessage(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const res = await fetch("http://127.0.0.1:8000/api/talk-to-gemini/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ message }),
            });

            const contentType = res.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (res.ok) {
                    setResponse(data.reply);
                    setMessage("");
                } else {
                    // Handle detailed error messages
                    const errorDetail = data.error || "Something went wrong";
                    throw new Error(errorDetail);
                }
            } else {
                const errorText = await res.text();
                throw new Error(`Unexpected response: ${errorText}`);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="chat-container">
            <h1>Gemini Chat</h1>
            <form onSubmit={sendMessage} className="chat-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                    required
                />
                <button type="submit" className="chat-button" disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </button>
            </form>

            {response && (
                <div className="chat-response">
                    <strong>Gemini:</strong> {response}
                </div>
            )}

            {error && <div className="chat-error">{error}</div>}
        </div>
    );
}

export default GeminiChat;
