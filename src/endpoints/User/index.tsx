import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, User, APICallOptions, PaginationRequest } from "types";

export const searchUsers = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<User>> => {
    const response = await callAPI<{ user?: APIPaginatedResponse<User> }>({
        method: "POST",
        url: `/users/search`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.user || createEmptyPaginatedResponse<User>();
};

// Listagem administrativa completa (tela "gerenciar usuários") - funciona com filtro vazio,
// mostra todo mundo paginado, com último acesso e total de empréstimos de cada um.
export const listUsersAdmin = async (
    filter = {},
    pagination: PaginationRequest = { limit: 20, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<User>> => {
    const response = await callAPI<{ user?: APIPaginatedResponse<User> }>({
        method: "POST",
        url: `/users/admin`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.user || createEmptyPaginatedResponse<User>();
};

type PreRegisterUserPayload = {
    name: string;
    phone: string;
    document: string;
};

export const preRegisterUser = async (payload: PreRegisterUserPayload): Promise<User | undefined> => {
    const response = await callAPI<{ user?: User }>({
        method: "POST",
        url: `/users/pre-register`,
        data: payload
    });

    return response?.body?.user;
};

export const updateUserRole = async (userId: number | bigint, role: string): Promise<User | undefined> => {
    const response = await callAPI<{ user?: User }>({
        method: "PUT",
        url: `/user/${userId}/role`,
        data: { role }
    });

    return response?.body?.user;
};

export type UpdateUserInfoPayload = {
    name?: string;
    display_name?: string;
    email?: string;
    phone?: string;
};

// ADMIN/LIBRARIAN atualizando os dados de contato de OUTRO usuário (completude cadastral) -
// diferente de updateProfile (endpoints/Account), que só edita o próprio usuário logado.
export const updateUserInfo = async (userId: number | bigint, payload: UpdateUserInfoPayload): Promise<User | undefined> => {
    const response = await callAPI<{ user?: User }>({
        method: "PUT",
        url: `/user/${userId}/info`,
        data: payload
    });

    return response?.body?.user;
};

export const updateUserStatus = async (userId: number | bigint, status: string): Promise<User | undefined> => {
    const response = await callAPI<{ user?: User }>({
        method: "PUT",
        url: `/user/${userId}/status`,
        data: { status }
    });

    return response?.body?.user;
};
