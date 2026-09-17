"use client";

import { useTranslations } from "next-intl";
import {
    Body,
    PageHeading,
    CollectionFiltersPanel,
    CollectionMobileToolbar,
    CollectionActiveFilterBadges,
    CollectionResultsHeader,
    CollectionEmptyState,
    CollectionVolumesGrid,
    CollectionLoadMore,
    SimpleButton,
    SimpleIconButton
} from "components";
import { Box, Card, Drawer, Portal, Stack, useBreakpointValue, useDisclosure, VStack } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { useVolumesCollection } from "hooks";

export default function Collection() {
    const t = useTranslations("Collection");
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { open, onOpen, onClose } = useDisclosure();

    const collection = useVolumesCollection();
    const { volumes, volumesPagination, isVolumesLoading, isVolumesLoadingFirstTime } = collection;

    return (
        <Body>
            <VStack pb="24px" align="start">
                <PageHeading header={t("title")} description={t("description")} />
            </VStack>

            {isMobile && (
                <>
                    <VStack align="start" gap={3} pb={4} w="100%">
                        <CollectionMobileToolbar collection={collection} onOpenFilters={onOpen} />
                        <CollectionActiveFilterBadges collection={collection} />
                    </VStack>

                    <Drawer.Root open={open} onOpenChange={(e) => (e.open ? onOpen() : onClose())} placement="bottom">
                        <Portal>
                            <Drawer.Backdrop />
                            <Drawer.Positioner>
                                <Drawer.Content maxH="85vh" borderTopRadius="xl">
                                    <Drawer.Header borderBottomWidth="1px" borderColor={{ base: "gray.muted", _dark: "gray.700" }}>
                                        <Drawer.Title>{t("filterAndSort")}</Drawer.Title>
                                        <Drawer.CloseTrigger asChild>
                                            <SimpleIconButton aria-label={t("removeFilters")}>
                                                <LuX />
                                            </SimpleIconButton>
                                        </Drawer.CloseTrigger>
                                    </Drawer.Header>

                                    <Drawer.Body pt="16px" pb="0">
                                        <CollectionFiltersPanel collection={collection} showSortSelect hideTitle />
                                    </Drawer.Body>

                                    <Drawer.Footer borderTopWidth="1px" borderColor={{ base: "gray.muted", _dark: "gray.700" }}>
                                        <SimpleButton w="100%" onClick={onClose}>
                                            {volumes.length > 0
                                                ? t("showingXFromYVolumes", { total: volumesPagination.total_elements })
                                                : t("filterAndSort")}
                                        </SimpleButton>
                                    </Drawer.Footer>
                                </Drawer.Content>
                            </Drawer.Positioner>
                        </Portal>
                    </Drawer.Root>
                </>
            )}

            <Stack direction={{ base: "column", md: "row" }} align="start" gap={{ md: 6, lg: 8 }}>
                {!isMobile && (
                    <Box
                        w={{ md: "260px", lg: "300px" }}
                        flexShrink={0}
                        position="sticky"
                        top="66px"
                        maxH="calc(100vh - 82px)"
                        overflowY="auto"
                    >
                        <Card.Root variant="outline">
                            <Card.Body p={4}>
                                <CollectionFiltersPanel collection={collection} />
                            </Card.Body>
                        </Card.Root>
                    </Box>
                )}

                <Box flex="1" w="100%" minW="0">
                    {!isMobile && <CollectionResultsHeader collection={collection} />}

                    {volumes.length === 0 && !isVolumesLoading && !isVolumesLoadingFirstTime ? (
                        <CollectionEmptyState collection={collection} />
                    ) : (
                        <>
                            <CollectionVolumesGrid collection={collection} />
                            <CollectionLoadMore collection={collection} />
                        </>
                    )}
                </Box>
            </Stack>
        </Body>
    );
}
