"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getVolume, listRelatedVolumes } from "endpoints";
import { APICallOptions, Volume } from "types";
import {
    DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON,
    PAGINATION_DEFAULT_RELATED_VOLUMES_PER_PAGE,
    createSkeletonPlaceholders,
    isAbortError
} from "utils";
import { useAsyncResource } from "./useAsyncResource";

const RELATED_VOLUMES_SKELETON_COUNT = 12;

/**
 * Loads a volume by slug plus its related volumes. Related volumes are only
 * fetched once the volume itself has resolved, since the request needs its id.
 */
export function useVolumeDetails(volumeSlug: string) {
    const fetchVolume = useCallback(async (options: APICallOptions) => {
        const result = await getVolume(volumeSlug, options);
        if (!result) throw new Error(`Volume not found for slug "${volumeSlug}"`);
        return result;
    }, [volumeSlug]);
    const {
        data: volume,
        isLoading: isVolumeLoading,
        hasFailed: isVolumeLoadFailed
    } = useAsyncResource<Volume>(fetchVolume, DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON);

    const [relatedVolumes, setRelatedVolumes] = useState<Volume[]>(() =>
        createSkeletonPlaceholders(DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, RELATED_VOLUMES_SKELETON_COUNT)
    );
    const [isRelatedVolumesLoading, setIsRelatedVolumesLoading] = useState(true);
    const [isRelatedVolumesLoadFailed, setIsRelatedVolumesLoadFailed] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (isVolumeLoading || isVolumeLoadFailed) return;

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsRelatedVolumesLoading(true);
        setIsRelatedVolumesLoadFailed(false);

        listRelatedVolumes(volume.id, { limit: PAGINATION_DEFAULT_RELATED_VOLUMES_PER_PAGE, page: 1 }, { signal: controller.signal })
            .then((response) => {
                if (abortControllerRef.current !== controller) return;
                setRelatedVolumes(response.elements);
                setIsRelatedVolumesLoading(false);
            })
            .catch((error) => {
                if (abortControllerRef.current !== controller || isAbortError(error)) return;
                setIsRelatedVolumesLoadFailed(true);
                setIsRelatedVolumesLoading(false);
            });

        return () => controller.abort();
    }, [volume.id, isVolumeLoading, isVolumeLoadFailed]);

    return {
        volume,
        isVolumeLoading,
        isVolumeLoadFailed,
        relatedVolumes,
        isRelatedVolumesLoading,
        isRelatedVolumesLoadFailed
    };
}
