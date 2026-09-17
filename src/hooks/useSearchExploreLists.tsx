"use client";

import { useCallback, useRef, useState } from "react";
import { listAuthorsToExplore, listCategoriesToExplore, listTagsToExplore } from "endpoints";
import { Author, Category, Tag } from "types";
import {
    PAGINATION_DEFAULT_AUTHORS_TO_EXPLORE,
    PAGINATION_DEFAULT_CATEGORIES_TO_EXPLORE,
    PAGINATION_DEFAULT_TAGS_TO_EXPLORE
} from "utils";

type ExploreListState<TElement> = {
    elements: TElement[];
    isLoading: boolean;
    hasFailed: boolean;
};

const initialExploreListState = <TElement,>(): ExploreListState<TElement> => ({
    elements: [],
    isLoading: false,
    hasFailed: false
});

type LoadStatus = "idle" | "loading" | "loaded";

/**
 * Loads the search dialog's "explore" lists (categories/authors/tags) lazily -
 * only once the dialog first opens - retrying on the next open if a load
 * failed, and never re-fetching once a list has loaded successfully.
 */
export function useSearchExploreLists() {
    const statusRef = useRef<{ categories: LoadStatus; authors: LoadStatus; tags: LoadStatus }>({
        categories: "idle",
        authors: "idle",
        tags: "idle"
    });

    const [categories, setCategories] = useState(initialExploreListState<Category>);
    const [authors, setAuthors] = useState(initialExploreListState<Author>);
    const [tags, setTags] = useState(initialExploreListState<Tag>);

    const loadIfNeeded = useCallback(() => {
        if (statusRef.current.categories === "idle") {
            statusRef.current.categories = "loading";
            setCategories({ elements: [], isLoading: true, hasFailed: false });

            listCategoriesToExplore({}, { limit: PAGINATION_DEFAULT_CATEGORIES_TO_EXPLORE, page: 1 })
                .then((response) => {
                    statusRef.current.categories = "loaded";
                    setCategories({ elements: response.elements, isLoading: false, hasFailed: false });
                })
                .catch(() => {
                    statusRef.current.categories = "idle";
                    setCategories((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
                });
        }

        if (statusRef.current.authors === "idle") {
            statusRef.current.authors = "loading";
            setAuthors({ elements: [], isLoading: true, hasFailed: false });

            listAuthorsToExplore(
                {},
                { limit: PAGINATION_DEFAULT_AUTHORS_TO_EXPLORE, page: 1, sort: { by: "volumes_count", order: "desc" } }
            )
                .then((response) => {
                    statusRef.current.authors = "loaded";
                    setAuthors({ elements: response.elements, isLoading: false, hasFailed: false });
                })
                .catch(() => {
                    statusRef.current.authors = "idle";
                    setAuthors((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
                });
        }

        if (statusRef.current.tags === "idle") {
            statusRef.current.tags = "loading";
            setTags({ elements: [], isLoading: true, hasFailed: false });

            listTagsToExplore({}, { limit: PAGINATION_DEFAULT_TAGS_TO_EXPLORE, page: 1 })
                .then((response) => {
                    statusRef.current.tags = "loaded";
                    setTags({ elements: response.elements, isLoading: false, hasFailed: false });
                })
                .catch(() => {
                    statusRef.current.tags = "idle";
                    setTags((prev) => ({ ...prev, isLoading: false, hasFailed: true }));
                });
        }
    }, []);

    return { categories, authors, tags, loadIfNeeded };
}
