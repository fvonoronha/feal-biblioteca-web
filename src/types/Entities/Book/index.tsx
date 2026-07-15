export interface Book {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    summary?: string;
    description?: string;
    recommended_for?: string;
    keywords?: string[];
    last_month_access_count: number;
    all_time_access_count: number;
}

export interface BookLoan {
    due_date: string;
    loan_date: string;
}

// export interface BookAuthor {
//     description?: string;
//     author: Author;
// }

// export interface BookContextType {
//     book: Book;
//     setBook: (book: Book) => void;
// }

// interface PublisherCount {
//     books: number;
// }
// export interface Publisher {
//     name: string;
//     _count: PublisherCount;
// }
