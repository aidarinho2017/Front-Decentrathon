import { useState } from "react";
import "../styles/GeminiChat.css"; // Import the new CSS

function GeminiChat() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear previous error

        try {
            const res = await fetch("/api/talk-to-gemini/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(data.reply);
                setMessage("");
            } else {
                throw new Error(data.error || "Something went wrong");
            }
        } catch (error) {
            setError(error.message); // Log actual error message
        } finally {
            setLoading(false);
        }
    };

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
