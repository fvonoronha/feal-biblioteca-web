export interface User {
    id: bigint;
    slug: string;
    created_at?: Date;
    name: string;
    display_name?: string;
    sex?: string;
    login?: string;
    status?: string;
    email?: string;
    phone?: string;
    document?: string;
    role?: string;
    has_overdue_loan?: boolean;

    // Só vêm preenchidos na listagem administrativa de usuários (listUsersAdmin).
    last_used_at?: Date | null;
    loan_count?: number;
    overdue_loan_count?: number;
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
