export type APICallOptions = {
    signal?: AbortSignal;
};

export type APIResponseType<TBody = unknown> = {
    header?: Record<string, unknown>;
    body: TBody;
};

export type Pagination = {
    page: number;
    limit: number;
    total_elements: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
};

export type APIPaginatedResponse<T> = {
    elements: T[];
    pagination: Pagination;
};

export type SortCriterion = {
    by: string;
    order: string;
};

// The backend is called with either a single sort criterion or a list of
// them (fallback sort), depending on the endpoint - both shapes are kept
// here to reflect that rather than narrowing to just one.
export type PaginationRequest = {
    page: number;
    limit: number;
    sort?: SortCriterion | SortCriterion[];
};
