"use client";

import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { SimpleButton } from "components";
import { LuChevronDown } from "react-icons/lu";
import { VolumesCollection } from "hooks";
import { useTranslations } from "next-intl";

type Props = {
    collection: VolumesCollection;
};

/**
 * Bridges infinite scroll and a reachable footer: the first couple of pages load themselves
 * via the `loadMoreRef` sentinel, and once `canAutoLoadMoreVolumes` runs out, this renders an
 * explicit "load more" button instead - so a catalog large enough to scroll forever no longer
 * traps the page footer below an endless auto-loading list. Resets back to auto-load whenever
 * the filters change, since that's a fresh `usePaginatedResource` reset under the hood.
 */
export default function CollectionLoadMore({ collection }: Props) {
    const t = useTranslations("Collection");
    const tUtils = useTranslations("Utils");
    const { volumes, volumesPagination, isVolumesLoading, loadMoreRef, canAutoLoadMoreVolumes, loadMoreVolumes } =
        collection;

    if (canAutoLoadMoreVolumes) {
        return <Box ref={loadMoreRef} h="40px" />;
    }

    if (volumesPagination.has_next) {
        return (
            <Center py={8}>
                <SimpleButton onClick={loadMoreVolumes} disabled={isVolumesLoading}>
                    {isVolumesLoading ? (
                        <>
                            <Spinner size="sm" />
                            {tUtils("loadingMore")}
                        </>
                    ) : (
                        <>
                            <LuChevronDown />
                            {t("loadMoreButtonWithCount", {
                                shown: volumes.length,
                                total: volumesPagination.total_elements
                            })}
                        </>
                    )}
                </SimpleButton>
            </Center>
        );
    }

    if (volumes.length > 0) {
        return (
            <VStack py={8}>
                <Text color="fg.muted" fontSize="sm">
                    {t("endOfResults", { total: volumesPagination.total_elements })}
                </Text>
            </VStack>
        );
    }

    return null;
}
