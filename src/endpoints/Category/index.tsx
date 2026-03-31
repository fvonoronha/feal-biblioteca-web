import { callAPI } from "utils";
import { APIPaginatedResponse, Category } from "types";

export const listCategories = async (
    filter = {},
    pagination = { limit: 10, page: 1 }
): Promise<APIPaginatedResponse<Category>> => {
    const response = await callAPI({
        method: "POST",
        url: `/public/categories`,
        data: { filter: filter, pagination: pagination }
    });

    return (
        response?.body?.category || {
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
