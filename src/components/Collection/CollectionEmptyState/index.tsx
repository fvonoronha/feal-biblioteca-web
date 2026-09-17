"use client";

import { HStack, Heading, Image, VStack } from "@chakra-ui/react";
import { SimpleButton } from "components";
import { LoadingIcons } from "assets";
import { VolumesCollection } from "hooks";
import { useTranslations } from "next-intl";

type Props = {
    collection: VolumesCollection;
};

export default function CollectionEmptyState({ collection }: Props) {
    const t = useTranslations("Collection");

    return (
        <VStack align="center">
            <HStack align="center" pt="50px">
                <VStack align="center">
                    <Image w="300px" src={LoadingIcons.empty.src} alt={t("emptyStateAlt")} />
                    <Heading textAlign="center">{t("nothingFound")}</Heading>
                    <SimpleButton onClick={collection.filters.clearFilters}>{t("removeFilters")}</SimpleButton>
                </VStack>
            </HStack>
        </VStack>
    );
}
