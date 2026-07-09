"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface SortOption {
    field: string;
    direction: string;
}

const DEFAULT_SORT_FIELD = "label";
const DEFAULT_SORT_DIRECTION = "desc";
const DEBOUNCE_DELAY = 300;

export function useCollectionFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Extract filter values from URL
    const urlSearch = searchParams.get("search") ?? "";
    const urlSortField = searchParams.get("sortField") ?? DEFAULT_SORT_FIELD;
    const urlSortDirection = searchParams.get("sortDirection") ?? DEFAULT_SORT_DIRECTION;
    const urlAuthors = searchParams.getAll("authors");
    const urlSpiritAuthors = searchParams.getAll("spiritAuthors");
    const urlTags = searchParams.getAll("tags");
    const urlCategories = searchParams.getAll("categories");
    const urlPublishers = searchParams.getAll("publishers");

    // Immediate search input state (for controlled input)
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Sync search input when URL search changes externally
    useEffect(() => {
        setSearchInput(urlSearch);
    }, [urlSearch]);

    // Helper to build query string and push
    const pushQueryString = useCallback(
        (updates: Record<string, string | string[] | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
                    params.delete(key);
                } else if (Array.isArray(value)) {
                    params.delete(key);
                    value.forEach((v) => v && params.append(key, v));
                } else {
                    params.set(key, value);
                }
            });
            const queryString = params.toString();
            router.push(pathname + (queryString ? `?${queryString}` : ""));
        },
        [searchParams, pathname, router]
    );

    // Debounced search update
    const handleSearchChange = useCallback(
        (newValue: string) => {
            setSearchInput(newValue);
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
                pushQueryString({ search: newValue || null });
            }, DEBOUNCE_DELAY);
        },
        [pushQueryString]
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    // Direct filter setters
    const setSort = useCallback(
        (field: string, direction: string) => {
            pushQueryString({ sortField: field, sortDirection: direction });
        },
        [pushQueryString]
    );

    const setAuthors = useCallback(
        (ids: string[]) => {
            pushQueryString({ authors: ids });
        },
        [pushQueryString]
    );

    const setSpiritAuthors = useCallback(
        (ids: string[]) => {
            pushQueryString({ spiritAuthors: ids });
        },
        [pushQueryString]
    );

    const setTags = useCallback(
        (ids: string[]) => {
            pushQueryString({ tags: ids });
        },
        [pushQueryString]
    );

    const setCategories = useCallback(
        (ids: string[]) => {
            pushQueryString({ categories: ids });
        },
        [pushQueryString]
    );

    const setPublishers = useCallback(
        (ids: string[]) => {
            pushQueryString({ publishers: ids });
        },
        [pushQueryString]
    );

    const clearFilters = useCallback(() => {
        router.push(pathname);
    }, [router, pathname]);

    // Assemble the sort option
    const sort: SortOption = {
        field: urlSortField,
        direction: urlSortDirection
    };

    return {
        // Effective filter values (from URL, used for data fetching)
        search: urlSearch,
        sort,
        authors: urlAuthors,
        spiritAuthors: urlSpiritAuthors,
        tags: urlTags,
        categories: urlCategories,
        publishers: urlPublishers,
        // Immediate search input for controlled field
        searchInput,
        // Update functions
        setSearch: handleSearchChange,
        setSort,
        setAuthors,
        setSpiritAuthors,
        setTags,
        setCategories,
        setPublishers,
        clearFilters
    };
}
