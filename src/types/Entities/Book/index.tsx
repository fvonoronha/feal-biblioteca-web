import { Author, Category, Publisher, Tag } from "types";

export interface Book {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    summary?: string;
    description?: string;
    recommended_for?: string;
    keywords?: string[];
    status?: string;
    last_month_access_count: number;
    all_time_access_count: number;

    // Presentes na listagem/edição administrativa e no comparativo de sugestão da IA -
    // ausentes nas listagens públicas mais leves.
    isbn?: string;
    isbn_old?: string;
    category?: Category | null;
    tags?: Tag[];
    authors?: Author[];

    // Só vêm em listBooksAdmin/getBookAdmin: dados do PRIMEIRO volume ativo do livro (o mais
    // antigo cadastrado), usados só como preview na listagem administrativa de livros - o
    // gerenciamento de fato dos volumes é feito à parte (ver acervoPage.tsx: seção expansível
    // de volumes por livro, com useAdminBooks#toggleBookVolumes).
    publisher?: Publisher | null;
    volumes_count?: number;
    primary_volume_id?: number;
    primary_volume_slug?: string;
    cover_url?: string;
    year?: number;
    edition?: string;
    pages?: number;
    pdf_url?: string;
}

export interface BookLoan {
    due_date: string;
    loan_date: string;
}
