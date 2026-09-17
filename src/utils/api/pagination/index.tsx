import { APIPaginatedResponse, Pagination } from "types";

export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_LIMIT = 10;

export const createEmptyPagination = (overrides: Partial<Pagination> = {}): Pagination => ({
    page: DEFAULT_PAGINATION_PAGE,
    limit: DEFAULT_PAGINATION_LIMIT,
    total_elements: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
    ...overrides
});

export const createEmptyPaginatedResponse = <TElement,>(
    overrides: Partial<Pagination> = {}
): APIPaginatedResponse<TElement> => ({
    elements: [],
    pagination: createEmptyPagination(overrides)
});
