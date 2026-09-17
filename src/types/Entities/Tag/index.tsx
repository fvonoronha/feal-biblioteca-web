export interface Tag {
    id: number;
    slug: string;
    name: string;
    description?: string;
    status?: string;

    books_count?: number;
    volumes_count?: number;
}
