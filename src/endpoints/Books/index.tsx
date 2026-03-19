import { callAPI } from "utils";
import { APIPaginatedResponse, Book, Publisher, APICallOptions } from "types";

export const listBooks = async (
    filter = {},
    pagination = { limit: 10, page: 1 },
    options: APICallOptions
): Promise<APIPaginatedResponse<Book>> => {
    const response = await callAPI({
        method: "POST",
        url: `/public/books`,
        data: { filter: filter, pagination: pagination },
        // ToDo: tratar a tipagem
        signal: options.signal
    });

    return (
        response?.body?.book || {
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

export const listPublishers = async (
    filter = {},
    pagination = { limit: 10, page: 1 }
): Promise<APIPaginatedResponse<Publisher>> => {
    const response = await callAPI({
        method: "POST",
        url: `/public/publishers`,
        data: { filter: filter, pagination: pagination }
    });

    return (
        response?.body?.publisher || {
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
