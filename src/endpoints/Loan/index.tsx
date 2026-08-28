import { callAPI } from "utils";
import { APIPaginatedResponse, Loan, APICallOptions } from "types";

export const listLoans = async (
    filter = {},
    pagination = { limit: 10, page: 1 },
    options: APICallOptions
): Promise<APIPaginatedResponse<Loan>> => {
    const response = await callAPI({
        method: "POST",
        url: `/loans`,
        data: { filter: filter, pagination: pagination },
        signal: options.signal
    });

    return (
        response?.body?.loan || {
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

export const returnLoan = async (loanId: number): Promise<APIPaginatedResponse<Loan>> => {
    const response = await callAPI({
        method: "POST",
        url: `/loan/${loanId}/return`,
        data: {}
    });

    return response?.body?.loan || {};
};
