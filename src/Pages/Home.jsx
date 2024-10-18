import { useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import axios from "axios";
import "../styles/Home.css";  // Assuming you store the CSS here

const API_URL = "http://localhost:8000/api/habits/";  // Adjust this to your Django API URL

function Home() {
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState("");
    const [loading] = useState(false);

    // Fetch habits from the API on component mount
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN); // Get JWT token from local storage
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
                    },
                });
                setHabits(response.data);
            } catch (error) {
                console.error("Error fetching habits:", error);
            }
        };

        fetchHabits();
    }, []);

    // Handle habit increment
    const handleIncrement = async (habitId) => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);  // Get JWT token

            // Send the increment request
            const response = await axios.post(
                `${API_URL}${habitId}/increment/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include the token in headers
                    },
                }
            );

            // After increment, update the habit count locally in the state
            const updatedHabits = habits.map((habit) =>
                habit.id === habitId ? { ...habit, count: response.data.count } : habit
            );

            setHabits(updatedHabits);
        } catch (error) {
            console.error("Error incrementing habit:", error);
        }
    };

    // Handle adding new habit
    const handleAddHabit = async (e) => {
        e.preventDefault(); // Prevent page refresh on form submit
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);  // Get JWT token
            const response = await axios.post(
                API_URL,
                { name: newHabit },  // Send the new habit in request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include the token in headers
                    },
                }
            );
            setHabits([...habits, response.data]);  // Update the habits list with the new habit
            setNewHabit("");  // Clear the input field
        } catch (error) {
            console.error("Error creating habit:", error);
        }
    };

    return (
        <div className="home-container">
            <h1 className="write">Bad Habit Breaker</h1>
            <h2 className="write">Common Bad Habits</h2>
            <form onSubmit={handleAddHabit} className="add-habit-form">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Enter a new bad habit"
                    className="habit-input"
                />
                <button type="submit" disabled={loading} className="add-habit-button">
                    {loading ? "Adding..." : "Add Habit"}
                </button>
            </form>
            <ul className="habit-list">
                {habits.map((habit) => (
                    <li key={habit.id} className="habit-item">
                        <p>{habit.name} - Count: {habit.count}</p>
                        <button onClick={() => handleIncrement(habit.id)} className="increment-button">
                            Increment
                        </button>
                    </li>
                ))}
            </ul>

            {/* Form to add new habit */}
        </div>
    );
}

export default Home;

