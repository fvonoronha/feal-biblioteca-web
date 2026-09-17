"use client";

import { useCallback } from "react";
import { listAuthors, listVolumes } from "endpoints";
import { APICallOptions, APIPaginatedResponse, Author, Volume } from "types";
import {
    DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON,
    DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON,
    PAGINATION_DEFAULT_VOLUMES_TO_EXPLORE,
    createEmptyPagination,
    createSkeletonPlaceholders
} from "utils";
import { useAsyncResource } from "./useAsyncResource";

const SEARCH_RESULTS_SKELETON_COUNT = 6;
const SEARCH_RESULT_SORT = { by: "search_score", order: "desc" };

const emptyVolumesPlaceholder = (): APIPaginatedResponse<Volume> => ({
    elements: createSkeletonPlaceholders(DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, SEARCH_RESULTS_SKELETON_COUNT),
    pagination: createEmptyPagination()
});

const emptyAuthorsPlaceholder = (): APIPaginatedResponse<Author> => ({
    elements: createSkeletonPlaceholders(DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, SEARCH_RESULTS_SKELETON_COUNT),
    pagination: createEmptyPagination()
});

/**
 * Runs the search dialog's "fast search" (volumes + authors) against a
 * debounced query, showing placeholder skeleton rows while the query is empty.
 */
export function useSearchResults(debouncedQuery: string) {
    const fetchVolumes = useCallback(
        (options: APICallOptions) => {
            if (debouncedQuery.trim() === "") return Promise.resolve(emptyVolumesPlaceholder());
            return listVolumes(
                { search: debouncedQuery },
                { limit: PAGINATION_DEFAULT_VOLUMES_TO_EXPLORE, page: 1, sort: SEARCH_RESULT_SORT },
                options
            );
        },
        [debouncedQuery]
    );
    const volumes = useAsyncResource(fetchVolumes, emptyVolumesPlaceholder());

    const fetchAuthors = useCallback(
        (options: APICallOptions) => {
            if (debouncedQuery.trim() === "") return Promise.resolve(emptyAuthorsPlaceholder());
            return listAuthors(
                { search: debouncedQuery },
                { limit: PAGINATION_DEFAULT_VOLUMES_TO_EXPLORE, page: 1, sort: SEARCH_RESULT_SORT },
                options
            );
        },
        [debouncedQuery]
    );
    const authors = useAsyncResource(fetchAuthors, emptyAuthorsPlaceholder());

    return {
        volumes: volumes.data.elements,
        volumesTotal: volumes.data.pagination.total_elements,
        isVolumesLoading: volumes.isLoading,
        isVolumesLoadFailed: volumes.hasFailed,
        authors: authors.data.elements,
        authorsTotal: authors.data.pagination.total_elements,
        isAuthorsLoading: authors.isLoading,
        isAuthorsLoadFailed: authors.hasFailed
    };
}
