// const API_URL = "http://localhost:8000/api";
const API_URL = "https://codementor-ai-h66o.onrender.com/api";

export const fetchQuizzes = async () => {
    try {
        const response = await fetch(`${API_URL}/quizzes`);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return [];
    }
};