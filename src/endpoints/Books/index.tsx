import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, Book, Publisher, APICallOptions, PaginationRequest } from "types";

export const listBooks = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Book>> => {
    const response = await callAPI<{ book?: APIPaginatedResponse<Book> }>({
        method: "POST",
        url: `/public/books`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.book || createEmptyPaginatedResponse<Book>();
};

export const listRelatedBooks = async (
    bookId: number,
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Book>> => {
    const response = await callAPI<{ book?: APIPaginatedResponse<Book> }>({
        method: "POST",
        url: `/public/book/${bookId}/related-books`,
        data: { pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.book || createEmptyPaginatedResponse<Book>();
};

export const getBook = async (slug: string, options?: APICallOptions): Promise<Book | undefined> => {
    const response = await callAPI<{ book?: Book }>({
        method: "GET",
        url: `/public/book/${slug}`,
        signal: options?.signal
    });

    return response?.body?.book;
};

// --- Gerenciamento administrativo do acervo (livros) ---

export type BookPayload = {
    title: string;
    subtitle?: string;
    summary?: string;
    description?: string;
    recommended_for?: string;
    keywords?: string[];
    category_id?: number;
};

type CreateBookVolumePayload = {
    publisher_id?: number;
    year?: number;
    edition?: string;
    isbn?: string;
    isbn_old?: string;
    pages?: number;
    description?: string;
    pdf_url?: string;
    cover_url?: string;
    back_url?: string;
    images_url?: string[];
    keywords?: string[];
    label?: string;
    shelf?: string;
};

// Cria o Book e seu primeiro Volume juntos - um livro sem nenhum exemplar não serve pra nada
// na biblioteca.
export const createBook = async (payload: {
    book: BookPayload;
    volume?: CreateBookVolumePayload;
}): Promise<{ book: Book; volume: { id: number; slug: string } } | undefined> => {
    const response = await callAPI<{ book?: { book: Book; volume: { id: number; slug: string } } }>({
        method: "POST",
        url: `/book`,
        data: payload
    });

    return response?.body?.book;
};

export const updateBook = async (bookId: number, payload: Partial<BookPayload>): Promise<Book | undefined> => {
    const response = await callAPI<{ book?: Book }>({
        method: "PUT",
        url: `/book/${bookId}`,
        data: payload
    });

    return response?.body?.book;
};

export const deleteBook = async (bookId: number): Promise<boolean> => {
    const response = await callAPI<{ book?: { deleted?: boolean } }>({
        method: "DELETE",
        url: `/book/${bookId}`
    });

    return !!response?.body?.book?.deleted;
};

// Listagem/detalhe administrativos (ADMIN/LIBRARIAN) - distintos de listBooks/getBook acima,
// que usam as rotas públicas.
export type GeminiBookSuggestion = {
    summary?: string;
    description?: string;
    recommended_for?: string;
    keywords: string[];
    category: { id: number; slug: string; name: string } | null;
    tags: { id: number; slug: string; name: string }[];
};

// Só CONSULTA a IA e devolve a sugestão para revisão - não grava nada. O operador decide o
// que aplicar (ver updateBook/setBookTags) depois de revisar/editar na tela.
export const suggestBookEnhancement = async (
    bookSlug: string
): Promise<{ book: Book; suggestion: GeminiBookSuggestion } | undefined> => {
    const response = await callAPI<{ book?: Book; suggestion?: GeminiBookSuggestion }>({
        method: "POST",
        url: `/gemini/book/${bookSlug}/suggest`
    });

    if (!response?.body?.book || !response?.body?.suggestion) return undefined;
    return { book: response.body.book, suggestion: response.body.suggestion };
};

export const setBookTags = async (bookId: number, tagIds: number[]): Promise<boolean> => {
    const response = await callAPI<{ book?: { updated?: boolean } }>({
        method: "PUT",
        url: `/book/${bookId}/tags`,
        data: { tag_ids: tagIds }
    });

    return !!response?.body?.book?.updated;
};

export const listBooksAdmin = async (
    filter = {},
    pagination: PaginationRequest = { limit: 20, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Book>> => {
    const response = await callAPI<{ book?: APIPaginatedResponse<Book> }>({
        method: "POST",
        url: `/books`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.book || createEmptyPaginatedResponse<Book>();
};

export const getBookAdmin = async (slug: string, options?: APICallOptions): Promise<Book | undefined> => {
    const response = await callAPI<{ book?: Book }>({
        method: "GET",
        url: `/book/${slug}`,
        signal: options?.signal
    });

    return response?.body?.book;
};

export const listPublishersAdmin = async (
    filter = {},
    pagination: PaginationRequest = { limit: 20, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Publisher>> => {
    const response = await callAPI<{ publisher?: APIPaginatedResponse<Publisher> }>({
        method: "POST",
        url: `/publishers/admin`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.publisher || createEmptyPaginatedResponse<Publisher>();
};

export type PublisherPayload = { name: string; abbreviation?: string; description?: string; avatar_url?: string; status?: string };

export const createPublisher = async (payload: PublisherPayload): Promise<Publisher | undefined> => {
    const response = await callAPI<{ publisher?: Publisher }>({ method: "POST", url: `/publisher`, data: payload });
    return response?.body?.publisher;
};

export const updatePublisher = async (publisherId: number, payload: Partial<PublisherPayload>): Promise<Publisher | undefined> => {
    const response = await callAPI<{ publisher?: Publisher }>({ method: "PUT", url: `/publisher/${publisherId}`, data: payload });
    return response?.body?.publisher;
};

export const deletePublisher = async (publisherId: number): Promise<boolean> => {
    const response = await callAPI<{ publisher?: { deleted?: boolean } }>({ method: "DELETE", url: `/publisher/${publisherId}` });
    return !!response?.body?.publisher?.deleted;
};

export const listPublishers = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Publisher>> => {
    const response = await callAPI<{ publisher?: APIPaginatedResponse<Publisher> }>({
        method: "POST",
        url: `/publishers`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.publisher || createEmptyPaginatedResponse<Publisher>();
};
