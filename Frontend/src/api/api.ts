import axios from "axios";
import { TodoApi } from "./TodoApi";
import { TodoItemApi } from "./TodoItemApi";

const API_URL = "http://localhost:5202/api";

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export { TodoApi, TodoItemApi };
