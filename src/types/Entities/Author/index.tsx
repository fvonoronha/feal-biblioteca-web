export interface Author {
    id: number;
    slug: string;
    name: string;
    role?: string;
    description?: string;
    avatar_url?: string;
    is_spirit: boolean;

    books_count?: number;
    volumes_count?: number;
}
