"use client";

import { useCallback } from "react";
import { getAuthor } from "endpoints";
import { APICallOptions, Author } from "types";
import { useAsyncResource } from "./useAsyncResource";

const SKELETON_AUTHOR: Author = {
    id: 1,
    slug: "slug",
    name: "Nome do Autor",
    description:
        "Uma biografia de exemplo, só para o skeleton de carregamento ficar com um tamanho visualmente parecido com o conteúdo real.",
    is_spirit: false,
    volumes: []
};

export function useAuthorDetails(authorSlug: string) {
    const fetchAuthor = useCallback(
        async (options: APICallOptions) => {
            const result = await getAuthor(authorSlug, options);
            if (!result) throw new Error(`Author not found for slug "${authorSlug}"`);
            return result;
        },
        [authorSlug]
    );

    const {
        data: author,
        isLoading: isAuthorLoading,
        hasFailed: isAuthorLoadFailed
    } = useAsyncResource<Author>(fetchAuthor, SKELETON_AUTHOR);

    return { author, isAuthorLoading, isAuthorLoadFailed };
}
