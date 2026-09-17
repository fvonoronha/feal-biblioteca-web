"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    QUERY_PARAMS_FOR_AUTHOR,
    QUERY_PARAMS_FOR_SPIRIT_AUTHOR,
    QUERY_PARAMS_FOR_CATEGORY,
    QUERY_PARAMS_FOR_TAG,
    QUERY_PARAMS_FOR_SEARCH,
    QUERY_PARAMS_FOR_PUBLISHER
} from "utils";

export type SlugListUpdate = string[] | ((prev: string[]) => string[]);

const parseSlugList = (value: string | null): string[] => value?.split(",").filter(Boolean) ?? [];

/**
 * Reads/writes the volume collection's filters straight from the URL, so
 * filtered views stay bookmarkable and shareable. Each multi-value filter is
 * stored as a single comma-separated query param (e.g. `?c=poesia,romance`).
 */
export function useCollectionFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // `useSearchParams()` devolve uma instância NOVA a cada navegação - inclusive uma puramente
    // de pathname, tipo abrir o modal de busca (`/` -> `/buscar`), sem o menor query param
    // mudando. Se os `useMemo` abaixo dependessem do objeto `searchParams` em si, essa troca de
    // referência (mesmo com o MESMO conteúdo) recalcularia tudo, produzindo arrays novos a cada
    // vez - e como esses arrays alimentam `combinedFilters`/`fetchVolumesPage` na home
    // (useVolumesCollection), isso disparava uma busca de volumes inteira do nada só por abrir
    // um modal. Lendo o valor primitivo (string) de cada parâmetro ANTES do useMemo, a
    // comparação de dependência passa a ser por valor, não por referência do objeto.
    const searchParam = searchParams.get(QUERY_PARAMS_FOR_SEARCH);
    const categoryParam = searchParams.get(QUERY_PARAMS_FOR_CATEGORY);
    const tagParam = searchParams.get(QUERY_PARAMS_FOR_TAG);
    const authorParam = searchParams.get(QUERY_PARAMS_FOR_AUTHOR);
    const spiritAuthorParam = searchParams.get(QUERY_PARAMS_FOR_SPIRIT_AUTHOR);
    const publisherParam = searchParams.get(QUERY_PARAMS_FOR_PUBLISHER);

    const search = searchParam || "";
    const categories = useMemo(() => parseSlugList(categoryParam), [categoryParam]);
    const tags = useMemo(() => parseSlugList(tagParam), [tagParam]);
    const authors = useMemo(() => parseSlugList(authorParam), [authorParam]);
    const spiritAuthors = useMemo(() => parseSlugList(spiritAuthorParam), [spiritAuthorParam]);
    const publishers = useMemo(() => parseSlugList(publisherParam), [publisherParam]);

    const updateUrlParams = useCallback(
        (updates: Record<string, string | string[] | null>) => {
            const current = new URLSearchParams(Array.from(searchParams.entries()));

            Object.entries(updates).forEach(([key, value]) => {
                const isEmpty = value === null || value === "" || (Array.isArray(value) && value.length === 0);

                if (isEmpty) {
                    current.delete(key);
                } else if (Array.isArray(value)) {
                    current.set(key, value.join(","));
                } else {
                    current.set(key, value);
                }
            });

            const queryString = current.toString();
            router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
        },
        [searchParams, pathname, router]
    );

    const setSearch = useCallback((value: string) => updateUrlParams({ [QUERY_PARAMS_FOR_SEARCH]: value }), [
        updateUrlParams
    ]);

    const setCategories = useCallback(
        (update: SlugListUpdate) =>
            updateUrlParams({ [QUERY_PARAMS_FOR_CATEGORY]: typeof update === "function" ? update(categories) : update }),
        [updateUrlParams, categories]
    );

    const setTags = useCallback(
        (update: SlugListUpdate) =>
            updateUrlParams({ [QUERY_PARAMS_FOR_TAG]: typeof update === "function" ? update(tags) : update }),
        [updateUrlParams, tags]
    );

    const setAuthors = useCallback(
        (update: SlugListUpdate) =>
            updateUrlParams({ [QUERY_PARAMS_FOR_AUTHOR]: typeof update === "function" ? update(authors) : update }),
        [updateUrlParams, authors]
    );

    const setSpiritAuthors = useCallback(
        (update: SlugListUpdate) =>
            updateUrlParams({
                [QUERY_PARAMS_FOR_SPIRIT_AUTHOR]: typeof update === "function" ? update(spiritAuthors) : update
            }),
        [updateUrlParams, spiritAuthors]
    );

    const setPublishers = useCallback(
        (update: SlugListUpdate) =>
            updateUrlParams({
                [QUERY_PARAMS_FOR_PUBLISHER]: typeof update === "function" ? update(publishers) : update
            }),
        [updateUrlParams, publishers]
    );

    const clearFilters = useCallback(() => router.push(pathname, { scroll: false }), [router, pathname]);

    const hasActiveFilters =
        search !== "" ||
        categories.length > 0 ||
        tags.length > 0 ||
        authors.length > 0 ||
        spiritAuthors.length > 0 ||
        publishers.length > 0;

    return {
        search,
        categories,
        tags,
        authors,
        spiritAuthors,
        publishers,
        hasActiveFilters,
        setSearch,
        setCategories,
        setTags,
        setAuthors,
        setSpiritAuthors,
        setPublishers,
        clearFilters
    };
}
