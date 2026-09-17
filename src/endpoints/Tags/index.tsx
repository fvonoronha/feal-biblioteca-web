import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, Tag, APICallOptions, PaginationRequest } from "types";

export const listTags = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Tag>> => {
    const response = await callAPI<{ tag?: APIPaginatedResponse<Tag> }>({
        method: "POST",
        url: `/tags`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.tag || createEmptyPaginatedResponse<Tag>();
};

export const listTagsAdmin = async (
    filter = {},
    pagination: PaginationRequest = { limit: 20, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Tag>> => {
    const response = await callAPI<{ tag?: APIPaginatedResponse<Tag> }>({
        method: "POST",
        url: `/tags/admin`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.tag || createEmptyPaginatedResponse<Tag>();
};

export type TagPayload = { name: string; description?: string; status?: string };

export const createTag = async (payload: TagPayload): Promise<Tag | undefined> => {
    const response = await callAPI<{ tag?: Tag }>({ method: "POST", url: `/tag`, data: payload });
    return response?.body?.tag;
};

export const updateTag = async (tagId: number, payload: Partial<TagPayload>): Promise<Tag | undefined> => {
    const response = await callAPI<{ tag?: Tag }>({ method: "PUT", url: `/tag/${tagId}`, data: payload });
    return response?.body?.tag;
};

export const deleteTag = async (tagId: number): Promise<boolean> => {
    const response = await callAPI<{ tag?: { deleted?: boolean } }>({ method: "DELETE", url: `/tag/${tagId}` });
    return !!response?.body?.tag?.deleted;
};

export const listTagsToExplore = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Tag>> => {
    const response = await callAPI<{ tag?: APIPaginatedResponse<Tag> }>({
        method: "POST",
        url: `/tags-to-explore`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.tag || createEmptyPaginatedResponse<Tag>();
};
