"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APICallOptions, APIPaginatedResponse, Pagination } from "types";
import { createEmptyPagination, isAbortError } from "utils";

const INTERSECTION_ROOT_MARGIN_IN_PX = 200;

type PageFetcher<TElement> = (page: number, options: APICallOptions) => Promise<APIPaginatedResponse<TElement>>;

/**
 * Loads a paginated list. Re-fetches from page 1 whenever `fetchPage` changes
 * identity, so callers reset the list by memoizing a new fetcher (e.g. with
 * `useCallback` keyed to their filters/sort).
 *
 * `autoLoadPages` caps how many pages load themselves via scroll (infinite
 * scroll) before handing control over to `loadMore` - the caller is expected
 * to render a "load more" button once `canAutoLoad` turns false, so users can
 * still reach content (e.g. a footer) below an otherwise-endless list.
 * Defaults to unlimited, i.e. pure infinite scroll.
 */
export function usePaginatedResource<TElement>(
    fetchPage: PageFetcher<TElement>,
    initialElements: TElement[] = [],
    autoLoadPages: number = Infinity
) {
    const pageRef = useRef(1);
    const abortControllerRef = useRef<AbortController | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const [elements, setElements] = useState<TElement[]>(initialElements);
    const [pagination, setPagination] = useState<Pagination>(createEmptyPagination());
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(true);
    // True for the very first load and for any reset caused by new filters/sort - as opposed to
    // an infinite-scroll "load more", which must not re-trigger a loading skeleton on existing items.
    const [isReloading, setIsReloading] = useState(true);
    const [hasFailed, setHasFailed] = useState(false);
    // How many pages have loaded since the last reset - drives `canAutoLoad` below. A state
    // (not just the pageRef) on purpose: the UI needs to re-render once auto-load runs out.
    const [pagesLoaded, setPagesLoaded] = useState(0);

    const loadPage = useCallback(
        async (reset: boolean) => {
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            if (reset) {
                pageRef.current = 1;
                setPagesLoaded(0);
            }

            setIsLoading(true);
            if (reset) setIsReloading(true);
            setHasFailed(false);

            try {
                const response = await fetchPage(pageRef.current, { signal: controller.signal });
                if (abortControllerRef.current !== controller) return;

                setElements((prev) => (reset ? response.elements : [...prev, ...response.elements]));
                setPagination(response.pagination);
                pageRef.current += 1;
                setPagesLoaded((prev) => (reset ? 1 : prev + 1));
            } catch (error) {
                if (abortControllerRef.current !== controller || isAbortError(error)) return;
                setHasFailed(true);
            } finally {
                if (abortControllerRef.current === controller) {
                    setIsLoading(false);
                    setIsLoadingFirstPage(false);
                    if (reset) setIsReloading(false);
                }
            }
        },
        [fetchPage]
    );

    const reload = useCallback(() => loadPage(true), [loadPage]);
    const loadMore = useCallback(() => loadPage(false), [loadPage]);

    // Reset (filters/sort changing) always re-opens auto-load, so a new search starts back at
    // "the first pages load themselves" instead of staying stuck in manual mode.
    const canAutoLoad = pagesLoaded < autoLoadPages;

    useEffect(() => {
        reload();
    }, [reload]);

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el || !canAutoLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && pagination.has_next && !isLoading) {
                    loadPage(false);
                }
            },
            { rootMargin: `${INTERSECTION_ROOT_MARGIN_IN_PX}px` }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [pagination.has_next, isLoading, loadPage, canAutoLoad]);

    return {
        elements,
        setElements,
        pagination,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        loadMoreRef,
        canAutoLoad,
        loadMore,
        reload
    };
}
