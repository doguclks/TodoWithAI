import { TodoItem } from "../models/todo";
import { apiClient } from "./api";

export const TodoItemApi = {
    getItems: async (todoId: number): Promise<TodoItem[]> => {
        const response = await apiClient.get(`/todoitems?todoId=${todoId}`);
        return response.data;
    },

    getItem: async (id: number): Promise<TodoItem> => {
        const response = await apiClient.get(`/todoitems/${id}`);
        return response.data;
    },

    createItem: async (item: Omit<TodoItem, "id">): Promise<TodoItem> => {
        const response = await apiClient.post("/todoitems", item);
        return response.data;
    },

    updateItem: async (id: number, item: TodoItem): Promise<void> => {
        await apiClient.put(`/todoitems/${id}`, item);
    },

    deleteItem: async (id: number): Promise<void> => {
        await apiClient.delete(`/todoitems/${id}`);
    },
};
