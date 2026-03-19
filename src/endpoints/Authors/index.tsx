import { callAPI } from "utils";
import { APIPaginatedResponse, Author } from "types";

export const listAuthors = async (
    filter = {},
    pagination = { limit: 10, page: 1 }
): Promise<APIPaginatedResponse<Author>> => {
    const response = await callAPI({
        method: "POST",
        url: `/public/authors`,
        data: { filter: filter, pagination: pagination }
    });
   
    return (
        response?.body?.author || {
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
