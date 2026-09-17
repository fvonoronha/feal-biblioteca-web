import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, APICallOptions, Author, PaginationRequest } from "types";

export const listAuthors = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Author>> => {
    const response = await callAPI<{ author?: APIPaginatedResponse<Author> }>({
        method: "POST",
        url: `/authors`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.author || createEmptyPaginatedResponse<Author>();
};

export const listAuthorsToExplore = async (
    filter = {},
    pagination: PaginationRequest = { limit: 12, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Author>> => {
    const response = await callAPI<{ author?: APIPaginatedResponse<Author> }>({
        method: "POST",
        url: `/authors-to-explore`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.author || createEmptyPaginatedResponse<Author>();
};

// Listagem administrativa (tela de gerenciamento de autores) - ao contrário de listAuthors,
// funciona com filtro vazio e mostra autores mesmo sem nenhum volume ainda vinculado.
export const listAuthorsAdmin = async (
    filter = {},
    pagination: PaginationRequest = { limit: 20, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Author>> => {
    const response = await callAPI<{ author?: APIPaginatedResponse<Author> }>({
        method: "POST",
        url: `/authors/admin`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.author || createEmptyPaginatedResponse<Author>();
};

export const getAuthor = async (slug: string, options?: APICallOptions): Promise<Author | undefined> => {
    const response = await callAPI<{ author?: Author }>({
        method: "GET",
        url: `/author/${slug}`,
        signal: options?.signal
    });

    return response?.body?.author;
};

export type AuthorPayload = {
    name: string;
    description?: string;
    avatar_url?: string;
    is_spirit?: boolean;
    birth_date?: string;
    death_date?: string;
    status?: string;
};

export const createAuthor = async (payload: AuthorPayload): Promise<Author | undefined> => {
    const response = await callAPI<{ author?: Author }>({
        method: "POST",
        url: `/author`,
        data: payload
    });

    return response?.body?.author;
};

export const updateAuthor = async (authorId: number, payload: Partial<AuthorPayload>): Promise<Author | undefined> => {
    const response = await callAPI<{ author?: Author }>({
        method: "PUT",
        url: `/author/${authorId}`,
        data: payload
    });

    return response?.body?.author;
};

export const deleteAuthor = async (authorId: number): Promise<boolean> => {
    const response = await callAPI<{ author?: { deleted?: boolean } }>({
        method: "DELETE",
        url: `/author/${authorId}`
    });

    return !!response?.body?.author?.deleted;
};

export type GeminiAuthorSuggestion = {
    description?: string;
    birth_date: string | null;
    death_date: string | null;
};

// Só CONSULTA a IA e devolve a sugestão para revisão - não grava nada. O operador decide o
// que aplicar (via updateAuthor) depois de revisar/editar na tela.
export const suggestAuthorEnhancement = async (
    authorSlug: string
): Promise<{ author: Author; suggestion: GeminiAuthorSuggestion } | undefined> => {
    const response = await callAPI<{ author?: Author; suggestion?: GeminiAuthorSuggestion }>({
        method: "POST",
        url: `/gemini/author/${authorSlug}/suggest`
    });

    if (!response?.body?.author || !response?.body?.suggestion) return undefined;
    return { author: response.body.author, suggestion: response.body.suggestion };
};
