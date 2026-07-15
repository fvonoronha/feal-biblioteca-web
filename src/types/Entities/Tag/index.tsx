export interface Tag {
    id: number;
    slug: string;
    name: string;
    description?: string;

    books_count?: number;
    volumes_count?: number;
}

// export interface BookContextType {
//     book: Book;
//     setBook: (book: Book) => void;
// }
