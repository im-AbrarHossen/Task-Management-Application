import axios from "axios";

const API_URL = "https://task-management-app-server-gules.vercel.app/"; // Update with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Fetch tasks
export const fetchTasks = async (token) => {
  const response = await api.get("/tasks", { headers: { Authorization: token } });
  return response.data;
};

// Add task
export const addTask = async (task, token) => {
  const response = await api.post("/tasks", task, { headers: { Authorization: token } });
  return response.data;
};

// Update task
export const updateTask = async (id, updates, token) => {
  await api.put(`/tasks/${id}`, updates, { headers: { Authorization: token } });
};

// Delete task
export const deleteTask = async (id, token) => {
  await api.delete(`/tasks/${id}`, { headers: { Authorization: token } });
};

// WebSocket Connection
export const connectWebSocket = (setTasks) => {
  const ws = new WebSocket(API_URL.replace(/^http/, "ws"));

  ws.onmessage = (event) => {
    const updatedTasks = JSON.parse(event.data);
    setTasks(updatedTasks);
  };

  return ws;
};