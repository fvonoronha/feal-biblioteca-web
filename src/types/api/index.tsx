/* eslint-disable */

import { type AxiosResponse } from "axios";

export type APICallOptions = {
    signal?: AbortSignal;
};

export interface APIResponseType extends AxiosResponse {
    header: any;
    body: any;
}

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
