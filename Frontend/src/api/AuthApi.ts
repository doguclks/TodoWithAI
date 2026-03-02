import { apiClient } from "./api";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    userName: string;
}

export const AuthApi = {
    login: async (request: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>("/account/login", request);
        return response.data;
    },
    register: async (request: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>("/account/register", request);
        return response.data;
    }
};
