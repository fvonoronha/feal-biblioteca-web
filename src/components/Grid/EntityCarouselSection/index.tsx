"use client";

import { ReactNode } from "react";
import { Box, Skeleton, Spacer } from "@chakra-ui/react";
import EntityGrid from "../EntityGrid";
import { SectionHeading } from "components/Heading";

type Props<TItem> = {
    header: string;
    items: TItem[];
    isLoading: boolean;
    loadingFailed?: boolean;
    itemKey: (item: TItem) => string | number;
    renderItem: (item: TItem) => ReactNode;
};

/**
 * A horizontally-scrolling "see also"-style section (heading + EntityGrid),
 * shared by every entity carousel (related volumes, authors, ...). Hides
 * itself once loading has settled on an empty list.
 */
export default function EntityCarouselSection<TItem>({
    header,
    items,
    isLoading,
    loadingFailed = false,
    itemKey,
    renderItem
}: Props<TItem>) {
    if (items.length === 0) return null;

    return (
        <>
            <Spacer pt="24px" />

            <Skeleton loading={isLoading}>
                <SectionHeading header={header} />
            </Skeleton>

            <Spacer pt="24px" />

            <Box>
                <EntityGrid variant="scroll" loadingFailed={loadingFailed} eWidth="180px">
                    {items.map((item) => (
                        <Skeleton key={itemKey(item)} loading={isLoading}>
                            {renderItem(item)}
                        </Skeleton>
                    ))}
                </EntityGrid>
            </Box>
        </>
    );
}
