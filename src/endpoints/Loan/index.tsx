import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, Loan, LoanFilter, APICallOptions, PaginationRequest } from "types";

export const listLoans = async (
    filter: LoanFilter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Loan>> => {
    const response = await callAPI<{ loan?: APIPaginatedResponse<Loan> }>({
        method: "POST",
        url: `/loans`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.loan || createEmptyPaginatedResponse<Loan>();
};

// Auto-serviço: histórico do próprio usuário logado (área "meus empréstimos" do perfil).
export const listMyLoans = async (
    filter: LoanFilter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Loan>> => {
    const response = await callAPI<{ loan?: APIPaginatedResponse<Loan> }>({
        method: "POST",
        url: `/loan/mine`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.loan || createEmptyPaginatedResponse<Loan>();
};

export const returnLoan = async (loanId: number, options?: APICallOptions): Promise<Loan | undefined> => {
    const response = await callAPI<{ loan?: Loan }>({
        method: "POST",
        url: `/loan/${loanId}/return`,
        signal: options?.signal
    });

    return response?.body?.loan;
};

export const renewLoan = async (loanId: number, options?: APICallOptions): Promise<Loan | undefined> => {
    const response = await callAPI<{ loan?: Loan }>({
        method: "POST",
        url: `/loan/${loanId}/renew`,
        signal: options?.signal
    });

    return response?.body?.loan;
};

type CreateLoanPayload = {
    user_id: number | bigint;
    volume_id: number | bigint;
    due_date?: string;
    description?: string;
};

export const createLoan = async (payload: CreateLoanPayload): Promise<Loan | undefined> => {
    const response = await callAPI<{ loan?: Loan }>({
        method: "POST",
        url: `/loan`,
        data: payload
    });

    return response?.body?.loan;
};
