"use client";

import { Box, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";

type Props<TItem> = {
    title: string;
    items: TItem[];
    isLoading: boolean;
    hide?: boolean;
    itemKey: (item: TItem) => string | number;
    formatLabel: (item: TItem) => string;
    onSelectItem: (item: TItem) => void;
};

/**
 * A row of clickable filter chips, shared by the search dialog's "explore by
 * category" and "explore by tag" sections.
 */
export default function SearchExploreChipList<TItem>({
    title,
    items,
    isLoading,
    hide = false,
    itemKey,
    formatLabel,
    onSelectItem
}: Props<TItem>) {
    if (hide) return null;

    return (
        <Stack gap="2">
            <Text fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="wider" pt="4" pb="2">
                {title.toUpperCase()}
            </Text>

            <HStack gap="2" wrap="wrap">
                {items.map((item) => (
                    <Skeleton key={itemKey(item)} loading={isLoading}>
                        <Box
                            as="button"
                            px="4"
                            py="1.5"
                            bg={{ base: "gray.50", _dark: "gray.700" }}
                            borderRadius="sm"
                            fontSize="sm"
                            fontWeight="medium"
                            transition="all 0.2s"
                            _hover={{ bg: "fealRed.solid", color: "white", cursor: "pointer" }}
                            onClick={() => onSelectItem(item)}
                        >
                            {formatLabel(item)}
                        </Box>
                    </Skeleton>
                ))}
            </HStack>
        </Stack>
    );
}
