"use client";

import { ReactNode } from "react";
import { Box, HStack, Skeleton, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LuBarcode, LuBlocks, LuBookCopy, LuBookOpen, LuBuilding2, LuCalendar, LuLibraryBig } from "react-icons/lu";
import { Volume } from "types";
import { QUERY_PARAMS_FOR_CATEGORY, QUERY_PARAMS_FOR_PUBLISHER } from "utils";

type InfoItem = {
    key: string;
    icon: ReactNode;
    label: string;
    value: string;
    onClick?: () => void;
};

type Props = {
    volume: Volume;
    isLoading: boolean;
};

/**
 * A compact "spec sheet" grid: where to find the physical copy (shelf) first, then the
 * bibliographic facts (publisher, category, edition, year, pages, ISBN). The label (the
 * copy's own accession code) stays on the cover image instead, matching how it's shown
 * everywhere else in the app (grid cards, related volumes, ...).
 */
export default function VolumeInfoGrid({ volume, isLoading }: Props) {
    const t = useTranslations("VolumeDetails");
    const router = useRouter();

    const items: InfoItem[] = [];

    if (volume.shelf) {
        items.push({ key: "shelf", icon: <LuLibraryBig size={16} />, label: t("shelf"), value: volume.shelf });
    }

    if (volume.publisher) {
        items.push({
            key: "publisher",
            icon: <LuBuilding2 size={16} />,
            label: t("publisher"),
            value: `${volume.publisher.abbreviation ? `${volume.publisher.abbreviation} - ` : ""}${volume.publisher.name}`,
            onClick: () => router.push(`/?${QUERY_PARAMS_FOR_PUBLISHER}=${encodeURIComponent(volume.publisher?.slug || "")}`)
        });
    }

    if (volume.category) {
        items.push({
            key: "category",
            icon: <LuBlocks size={16} />,
            label: t("category"),
            value: volume.category.name,
            onClick: () => router.push(`/?${QUERY_PARAMS_FOR_CATEGORY}=${encodeURIComponent(volume.category?.slug || "")}`)
        });
    }

    if (volume.edition) {
        items.push({ key: "edition", icon: <LuBookCopy size={16} />, label: t("edition"), value: `${volume.edition}ª` });
    }

    if (volume.year) {
        items.push({ key: "year", icon: <LuCalendar size={16} />, label: t("publishedAt"), value: `${volume.year}` });
    }

    if (volume.pages) {
        items.push({ key: "pages", icon: <LuBookOpen size={16} />, label: t("pages"), value: `${volume.pages}` });
    }

    if (volume.isbn) {
        items.push({ key: "isbn", icon: <LuBarcode size={16} />, label: t("isbn"), value: volume.isbn });
    }

    if (volume.isbn_old) {
        items.push({ key: "isbn_old", icon: <LuBarcode size={16} />, label: t("isbnOld"), value: volume.isbn_old });
    }

    if (items.length === 0) return null;

    return (
        <Skeleton loading={isLoading} w="100%">
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2} w="100%">
                {items.map((item) => (
                    <HStack
                        key={item.key}
                        p={2}
                        gap={3}
                        align="start"
                        borderRadius="md"
                        cursor={item.onClick ? "pointer" : "default"}
                        transition="background 0.2s"
                        _hover={item.onClick ? { bg: "gray.subtle" } : undefined}
                        onClick={item.onClick}
                    >
                        <Box
                            flexShrink={0}
                            p={2}
                            borderRadius="full"
                            bg={{ base: "gray.100", _dark: "gray.700" }}
                            color="fealRed.solid"
                        >
                            {item.icon}
                        </Box>

                        <VStack align="start" gap={0}>
                            <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                                {item.label}
                            </Text>
                            <Text fontWeight="semibold" _hover={item.onClick ? { color: "fealRedHover" } : undefined}>
                                {item.value}
                            </Text>
                        </VStack>
                    </HStack>
                ))}
            </SimpleGrid>
        </Skeleton>
    );
}
