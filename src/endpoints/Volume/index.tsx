import { callAPI } from "utils";
import { APIPaginatedResponse, Volume, APICallOptions } from "types";

export const listVolumes = async (
    filter = {},
    pagination = { limit: 10, page: 1 },
    options: APICallOptions
): Promise<APIPaginatedResponse<Volume>> => {
    const response = await callAPI({
        method: "POST",
        url: `/volumes`,
        data: { filter: filter, pagination: pagination },
        signal: options.signal
    });

    return (
        response?.body?.volume || {
            elements: [],
            pagination: {
                page: 1,
                limit: 10,
                total_elements: 0,
                total_pages: 0,
                has_next: false,
                has_previous: false
            }
        }
    );
};

export const getVolume = async (slug: string): Promise<Volume> => {
    console.log("SLUG: ", slug);
    const response = await callAPI({
        method: "GET",
        url: `/volume/${slug}`,
        data: {}
    });

    return response?.body?.volume || {};
};

export const listRelatedVolumes = async (
    volumeId: number,
    pagination = { limit: 10, page: 1 }
): Promise<APIPaginatedResponse<Volume>> => {
    const response = await callAPI({
        method: "POST",
        url: `/volume/${volumeId}/related-volumes`,
        data: { pagination: pagination }
    });

    return (
        response?.body?.volume || {
            elements: [],
            pagination: {
                page: 1,
                limit: 10,
                total_elements: 0,
                total_pages: 0,
                has_next: false,
                has_previous: false
            }
        }
    );
};
