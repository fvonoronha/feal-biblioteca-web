import { callAPI } from "utils";
import { APIPaginatedResponse, Tag } from "types";

export const listTags = async (
    filter = {},
    pagination = { limit: 10, page: 1 }
): Promise<APIPaginatedResponse<Tag>> => {
    const response = await callAPI({
        method: "POST",
        url: `/public/tags`,
        data: { filter: filter, pagination: pagination }
    });

    return (
        response?.body?.tag || {
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
