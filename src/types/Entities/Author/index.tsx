export interface AuthorVolume {
    id: number;
    slug: string;
    year?: number;
    cover_url?: string;
    label?: string;
    role?: string;
    is_available?: boolean;
    loaned_to_current_user?: boolean;
    loan_due_date?: string | null;
    book: {
        id: number;
        slug: string;
        title: string;
    };
    category?: {
        id: number;
        slug: string;
        name: string;
    } | null;
}

export interface Author {
    id: number;
    slug: string;
    name: string;
    role?: string;
    description?: string;
    avatar_url?: string;
    is_spirit: boolean;
    birth_date?: string | null;
    death_date?: string | null;
    status?: string;

    books_count?: number;
    volumes_count?: number;

    // Só vem preenchido em getAuthor (a página/modal de detalhes de um autor).
    volumes?: AuthorVolume[];
}
