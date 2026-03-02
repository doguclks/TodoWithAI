import { Todo } from "../models/todo";
import { apiClient } from "./api";

export const TodoApi = {
    getTodos: async (search?: string): Promise<Todo[]> => {
        const response = await apiClient.get("/todos", {
            params: { search }
        });
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

    pinTodo: async (id: number): Promise<void> => {
        await apiClient.patch(`/todos/${id}/pin`);
    },

    unpinTodo: async (id: number): Promise<void> => {
        await apiClient.patch(`/todos/${id}/unpin`);
    },

    updateOrder: async (orders: { id: number, order: number }[]): Promise<void> => {
        await apiClient.put('/todos/order', orders);
    },
};
