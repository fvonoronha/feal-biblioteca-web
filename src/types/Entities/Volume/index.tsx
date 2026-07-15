import { Tag, Author, Category, Book } from "types";

export interface Publisher {
    id: number;
    slug: string;
    name: string;
    abbreviation?: string;
    avatar_url?: string;

    books_count?: number;
    volumes_count?: number;
}

export interface Volume {
    search_score: number;

    id: number;
    slug: string;
    year: number;
    edition: string;
    isbn: string;
    isbn_old: string;
    pages: number;
    cover_url?: string;
    back_url?: string;
    images_url: string[];
    label: string;
    shelf: string;
    description: string;

    keywords?: string[];

    all_time_access_count: number;
    last_month_access_count: number;

    publisher?: Publisher;
    tags?: Tag[];
    authors?: Author[];
    book: Book;
    category?: Category;
}

export interface BookContextType {
    book: Book;
    setBook: (book: Book) => void;
}
