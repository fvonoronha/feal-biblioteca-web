interface CategoryCount {
    books: number;
}
export interface Category {
    id: number;
    slug: string;
    name: string;
    description?: string;
    _count?: CategoryCount;
}

// export interface BookContextType {
//     book: Book;
//     setBook: (book: Book) => void;
// }
