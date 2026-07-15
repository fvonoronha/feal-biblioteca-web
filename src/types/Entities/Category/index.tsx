export interface Category {
    id: number;
    slug: string;
    name: string;

    books_count?: number;
    volumes_count?: number;
}
