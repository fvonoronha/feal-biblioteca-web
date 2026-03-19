interface AuthorCount {
    books: number;
}
export interface Author {
    id: number;
    slug: string;
    name: string;
    description: string;
    avatar_url: string;
    is_spirit: boolean;
    _count: AuthorCount;
}

// export interface BookContextType {
//     book: Book;
//     setBook: (book: Book) => void;
// }
