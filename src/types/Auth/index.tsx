export interface User {
    id: bigint;
    slug: string;
    created_at: Date;
    name: string;
    sex?: string;
    login: string;
    status: string;
    email: string;
    role: string;
}

export interface AuthToken {
    jwt_token?: string;
    jwt_secret: Date;
    keep: boolean;
}

export interface AuthResponse {
    user: User;
    token: AuthToken;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}
