import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, Category, APICallOptions, PaginationRequest } from "types";

export const listCategories = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Category>> => {
    const response = await callAPI<{ category?: APIPaginatedResponse<Category> }>({
        method: "POST",
        url: `/categories`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.category || createEmptyPaginatedResponse<Category>();
};

export const listCategoriesAdmin = async (
    filter = {},
    pagination: PaginationRequest = { limit: 20, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Category>> => {
    const response = await callAPI<{ category?: APIPaginatedResponse<Category> }>({
        method: "POST",
        url: `/categories/admin`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.category || createEmptyPaginatedResponse<Category>();
};

export type CategoryPayload = { name: string; description?: string; status?: string };

export const createCategory = async (payload: CategoryPayload): Promise<Category | undefined> => {
    const response = await callAPI<{ category?: Category }>({ method: "POST", url: `/category`, data: payload });
    return response?.body?.category;
};

export const updateCategory = async (categoryId: number, payload: Partial<CategoryPayload>): Promise<Category | undefined> => {
    const response = await callAPI<{ category?: Category }>({ method: "PUT", url: `/category/${categoryId}`, data: payload });
    return response?.body?.category;
};

export const deleteCategory = async (categoryId: number): Promise<boolean> => {
    const response = await callAPI<{ category?: { deleted?: boolean } }>({ method: "DELETE", url: `/category/${categoryId}` });
    return !!response?.body?.category?.deleted;
};

export const listCategoriesToExplore = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Category>> => {
    const response = await callAPI<{ category?: APIPaginatedResponse<Category> }>({
        method: "POST",
        url: `/categories-to-explore`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.category || createEmptyPaginatedResponse<Category>();
};
