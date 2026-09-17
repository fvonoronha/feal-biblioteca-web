"use client";

import { Badge, HStack, Spacer, Text } from "@chakra-ui/react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { VolumesCollection } from "hooks";
import { useTranslations } from "next-intl";

type Props = {
    collection: VolumesCollection;
    onOpenFilters: () => void;
};

export default function CollectionMobileToolbar({ collection, onOpenFilters }: Props) {
    const t = useTranslations("Collection");
    const { volumes, volumesPagination, filters } = collection;

    const activeFilterCount =
        filters.categories.length +
        filters.tags.length +
        filters.authors.length +
        filters.spiritAuthors.length +
        filters.publishers.length +
        (filters.search ? 1 : 0);

    return (
        <HStack
            w="100%"
            cursor="pointer"
            onClick={onOpenFilters}
            p={3}
            borderWidth="1px"
            borderColor={{ base: "gray.muted", _dark: "gray.700" }}
            borderRadius="lg"
            bg={{ base: "white", _dark: "gray.800" }}
            _hover={{ borderColor: "fealRed.solid" }}
            transition="border-color 0.2s"
        >
            <LuSlidersHorizontal />
            <Text fontWeight="semibold">{t("filterAndSort")}</Text>
            {activeFilterCount > 0 && (
                <Badge colorPalette="fealRed" borderRadius="full" px={2}>
                    {activeFilterCount}
                </Badge>
            )}
            <Spacer />
            <Text fontSize="sm" color="fg.muted">
                {volumes.length > 0 &&
                    t("showingXFromYVolumes", {
                        count: volumes.length,
                        total: volumesPagination.total_elements
                    })}
            </Text>
        </HStack>
    );
}
