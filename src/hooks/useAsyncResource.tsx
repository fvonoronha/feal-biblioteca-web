"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APICallOptions } from "types";
import { isAbortError } from "utils";

type AsyncResourceFetcher<TData> = (options: APICallOptions) => Promise<TData>;

/**
 * Loads a single async resource (no pagination), cancelling any in-flight
 * request whenever `fetcher` changes identity or the component unmounts.
 * Pass a `useCallback`-memoized fetcher so reloads only happen on purpose.
 */
export function useAsyncResource<TData>(fetcher: AsyncResourceFetcher<TData>, initialData: TData) {
    const [data, setData] = useState<TData>(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFailed, setHasFailed] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const load = useCallback(() => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        setHasFailed(false);

        fetcher({ signal: controller.signal })
            .then((result) => {
                if (abortControllerRef.current !== controller) return;
                setData(result);
                setIsLoading(false);
            })
            .catch((error) => {
                if (abortControllerRef.current !== controller || isAbortError(error)) return;
                setHasFailed(true);
                setIsLoading(false);
            });
    }, [fetcher]);

    useEffect(() => {
        load();
        return () => abortControllerRef.current?.abort();
    }, [load]);

    return { data, isLoading, hasFailed, reload: load };
}
