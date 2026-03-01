import { Todo } from "../models/todo";
import { apiClient } from "./api";

export const TodoApi = {
    getTodos: async (): Promise<Todo[]> => {
        const response = await apiClient.get("/todos");
        return response.data;
    },

    getTodo: async (id: number): Promise<Todo> => {
        const response = await apiClient.get(`/todos/${id}`);
        return response.data;
    },

    createTodo: async (item: Omit<Todo, "id" | "items" | "date">): Promise<Todo> => {
        const response = await apiClient.post("/todos", item);
        return response.data;
    },

    updateTodo: async (id: number, item: Todo): Promise<void> => {
        await apiClient.put(`/todos/${id}`, item);
    },

    deleteTodo: async (id: number): Promise<void> => {
        await apiClient.delete(`/todos/${id}`);
    },
};
