"use client";

import { Flex, HStack, Skeleton, Spacer, Text } from "@chakra-ui/react";
import { SortSelect } from "components";
import { VolumesCollection } from "hooks";
import { useTranslations } from "next-intl";

type Props = {
    collection: VolumesCollection;
};

export default function CollectionResultsHeader({ collection }: Props) {
    const t = useTranslations("Collection");
    const { volumes, volumesPagination, isVolumesLoading, isVolumesLoadingFirstTime, sort, setSort } = collection;

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "center" }}
            gap="6"
            pb={4}
        >
            <Skeleton loading={isVolumesLoading}>
                <Text>
                    {volumes.length > 0 && t("showingXFromYVolumes", { total: volumesPagination.total_elements })}
                </Text>
            </Skeleton>
            <Spacer flex={1} />
            <Skeleton loading={isVolumesLoadingFirstTime}>
                <HStack minW="230px">
                    <SortSelect label={`${t("sortBy")}:`} labelPosition="left" value={sort} onChange={setSort} />
                </HStack>
            </Skeleton>
        </Flex>
    );
}
