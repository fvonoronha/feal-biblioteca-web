import { Tag, Author, Category, Book } from "types";

export interface Publisher {
    id: number;
    slug: string;
    name: string;
    abbreviation?: string;
    description?: string;
    avatar_url?: string;
    status?: string;

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

    // Disponibilidade calculada a partir do empréstimo ativo (se houver) - nunca expõe quem
    // está com o volume, só se está disponível, a previsão de devolução, e (só quando o
    // próprio interessado está autenticado) se é ele mesmo quem está com o exemplar.
    is_available?: boolean;
    loan_due_date?: string | null;
    loaned_to_current_user?: boolean;

    // Só vem preenchido no detalhe de um volume indisponível: outras edições/exemplares do
    // mesmo livro que o usuário pode pegar emprestado no lugar deste.
    sibling_volumes?: Volume[];

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
