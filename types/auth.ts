export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
}

export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
}