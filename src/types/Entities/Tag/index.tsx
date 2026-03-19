interface TagCount {
    books: number;
}
export interface Tag {
    id: number;
    slug: string;
    name: string;
    description: string;
    _count: TagCount;
}

// export interface BookContextType {
//     book: Book;
//     setBook: (book: Book) => void;
// }
