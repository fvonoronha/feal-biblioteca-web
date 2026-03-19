export interface Book {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    publisher: string;
    year: number;
    edition: string;
    isbn: string;
    pages: number;
    summary: string;
    pdf_url: string;
    cover_url: string;
    images_url: string[];
    label: string;
    shelf: string;
    description: string;
}

export interface BookContextType {
    book: Book;
    setBook: (book: Book) => void;
}

interface PublisherCount {
    books: number;
}
export interface Publisher {
    name: string;
    _count: PublisherCount;
}