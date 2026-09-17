"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listAuthors, listCategories, listPublishers, listTags, listVolumes } from "endpoints";
import { APICallOptions, APIPaginatedResponse, Author, Category, Publisher, SortOption, Tag } from "types";
import {
    DEFAULT_VOLUME_SORT_OPTION,
    PAGINATION_DEFAULT_VOLUMES_PER_PAGE,
    PAGINATION_UNLIMITED_PER_PAGE,
    RELEVANCE_VOLUME_SORT_OPTION,
    createEmptyPaginatedResponse,
    isAbortError
} from "utils";
import { usePaginatedResource } from "./usePaginatedResource";
import { useCollectionFilters } from "./useCollectionFilters";

const UNLIMITED_PAGINATION = { limit: PAGINATION_UNLIMITED_PER_PAGE, page: 1 };

// Depois dessas páginas carregarem sozinhas via scroll, o carregamento passa a ser manual
// (botão "Carregar mais") - do contrário uma lista longa o suficiente nunca deixa o rodapé
// da página ser alcançado por scroll.
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;

const slugsToIds = (slugs: string[], elements: { slug: string; id: number }[]): string[] =>
    slugs.map((slug) => elements.find((element) => element.slug === slug)?.id.toString()).filter(Boolean) as string[];

type FilterOptionListState<TElement> = {
    data: APIPaginatedResponse<TElement>;
    isLoading: boolean;
    hasFailed: boolean;
};

const initialFilterOptionListState = <TElement,>(): FilterOptionListState<TElement> => ({
    data: createEmptyPaginatedResponse<TElement>(),
    isLoading: true,
    hasFailed: false
});

/**
 * Owns every piece of state behind the public collection page: the URL-backed
 * filters, the filter-option lists (categories/tags/authors/publishers - used
 * both to render the checkboxes and to translate the URL's slugs into the ids
 * the API expects), the sort, and the paginated volumes list itself.
 */
export function useVolumesCollection() {
    const filters = useCollectionFilters();
    const {
        search,
        categories: categorySlugs,
        tags: tagSlugs,
        authors: authorSlugs,
        spiritAuthors: spiritAuthorSlugs,
        publishers: publisherSlugs,
        setAuthors: setAuthorSlugs,
        setSpiritAuthors: setSpiritAuthorSlugs
    } = filters;

    const [sort, setSort] = useState<SortOption>(DEFAULT_VOLUME_SORT_OPTION);

    const [categoriesState, setCategoriesState] = useState(initialFilterOptionListState<Category>);
    const [tagsState, setTagsState] = useState(initialFilterOptionListState<Tag>);
    const [authorsState, setAuthorsState] = useState(initialFilterOptionListState<Author>);
    const [publishersState, setPublishersState] = useState(initialFilterOptionListState<Publisher>);

    // Search results are always ranked by relevance, overriding any manual sort choice.
    useEffect(() => {
        if (search.trim() !== "") setSort(RELEVANCE_VOLUME_SORT_OPTION);
    }, [search]);

    // Translate the URL's human-readable slugs into the ids the API filters by.
    const categoryIds = useMemo(
        () => slugsToIds(categorySlugs, categoriesState.data.elements),
        [categorySlugs, categoriesState.data.elements]
    );
    const tagIds = useMemo(
        () => slugsToIds(tagSlugs, tagsState.data.elements),
        [tagSlugs, tagsState.data.elements]
    );
    const authorIds = useMemo(
        () => slugsToIds(authorSlugs, authorsState.data.elements),
        [authorSlugs, authorsState.data.elements]
    );
    const spiritAuthorIds = useMemo(
        () => slugsToIds(spiritAuthorSlugs, authorsState.data.elements),
        [spiritAuthorSlugs, authorsState.data.elements]
    );
    const publisherIds = useMemo(
        () => slugsToIds(publisherSlugs, publishersState.data.elements),
        [publisherSlugs, publishersState.data.elements]
    );

    const combinedFilters = useMemo(
        () => ({
            search,
            author: [...authorIds, ...spiritAuthorIds],
            publisher: publisherIds,
            tag: tagIds,
            category: categoryIds
        }),
        [search, authorIds, spiritAuthorIds, publisherIds, tagIds, categoryIds]
    );

    // Stable primitive key: re-fetch only when the *resolved* id sets actually change,
    // not on every render's new (but equal) array/object references.
    const filtersKey = [
        search,
        categoryIds.join(","),
        tagIds.join(","),
        authorIds.join(","),
        spiritAuthorIds.join(","),
        publisherIds.join(",")
    ].join("|");

    useEffect(() => {
        const controller = new AbortController();
        const requestOptions: APICallOptions = { signal: controller.signal };

        setCategoriesState((prev) => ({ ...prev, isLoading: true, hasFailed: false }));
        listCategories(combinedFilters, UNLIMITED_PAGINATION, requestOptions)
            .then((data) => setCategoriesState({ data, isLoading: false, hasFailed: false }))
            .catch((error) => {
                if (isAbortError(error)) return;
                setCategoriesState((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
            });

        setTagsState((prev) => ({ ...prev, isLoading: true, hasFailed: false }));
        listTags(combinedFilters, UNLIMITED_PAGINATION, requestOptions)
            .then((data) => setTagsState({ data, isLoading: false, hasFailed: false }))
            .catch((error) => {
                if (isAbortError(error)) return;
                setTagsState((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
            });

        setAuthorsState((prev) => ({ ...prev, isLoading: true, hasFailed: false }));
        listAuthors(combinedFilters, UNLIMITED_PAGINATION, requestOptions)
            .then((data) => setAuthorsState({ data, isLoading: false, hasFailed: false }))
            .catch((error) => {
                if (isAbortError(error)) return;
                setAuthorsState((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
            });

        setPublishersState((prev) => ({ ...prev, isLoading: true, hasFailed: false }));
        listPublishers(combinedFilters, UNLIMITED_PAGINATION, requestOptions)
            .then((data) => setPublishersState({ data, isLoading: false, hasFailed: false }))
            .catch((error) => {
                if (isAbortError(error)) return;
                setPublishersState((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
            });

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersKey]);

    const fetchVolumesPage = useCallback(
        (page: number, options: APICallOptions) =>
            listVolumes(
                combinedFilters,
                {
                    limit: PAGINATION_DEFAULT_VOLUMES_PER_PAGE,
                    page,
                    sort: [
                        { by: sort.field, order: sort.direction },
                        { by: DEFAULT_VOLUME_SORT_OPTION.field, order: DEFAULT_VOLUME_SORT_OPTION.direction }
                    ]
                },
                options
            ),
        [combinedFilters, sort]
    );

    const {
        elements: volumes,
        pagination: volumesPagination,
        isLoading: isVolumesLoading,
        isLoadingFirstPage: isVolumesLoadingFirstTime,
        isReloading: isVolumesLoadingFirstFilter,
        hasFailed: isVolumesLoadingFailed,
        loadMoreRef,
        canAutoLoad: canAutoLoadMoreVolumes,
        loadMore: loadMoreVolumes
    } = usePaginatedResource(fetchVolumesPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    // Legacy links may put a spirit author's slug under the regular "author" param; move it over.
    useEffect(() => {
        if (authorsState.data.elements.length === 0) return;

        const misplacedSpiritSlugs = authorSlugs.filter(
            (slug) => authorsState.data.elements.find((author) => author.slug === slug)?.is_spirit
        );
        if (misplacedSpiritSlugs.length === 0) return;

        setAuthorSlugs((prev) => prev.filter((slug) => !misplacedSpiritSlugs.includes(slug)));
        setSpiritAuthorSlugs((prev) => Array.from(new Set([...prev, ...misplacedSpiritSlugs])));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorsState.data.elements, authorSlugs]);

    return {
        filters,
        sort,
        setSort,
        volumes,
        volumesPagination,
        isVolumesLoading,
        isVolumesLoadingFirstTime,
        isVolumesLoadingFirstFilter,
        isVolumesLoadingFailed,
        loadMoreRef,
        canAutoLoadMoreVolumes,
        loadMoreVolumes,
        categories: categoriesState.data.elements,
        isCategoriesLoading: categoriesState.isLoading,
        isCategoriesLoadFailed: categoriesState.hasFailed,
        tags: tagsState.data.elements,
        isTagsLoading: tagsState.isLoading,
        isTagsLoadFailed: tagsState.hasFailed,
        authors: authorsState.data.elements,
        isAuthorsLoading: authorsState.isLoading,
        isAuthorsLoadFailed: authorsState.hasFailed,
        publishers: publishersState.data.elements,
        isPublishersLoading: publishersState.isLoading,
        isPublishersLoadFailed: publishersState.hasFailed
    };
}

export type VolumesCollection = ReturnType<typeof useVolumesCollection>;
