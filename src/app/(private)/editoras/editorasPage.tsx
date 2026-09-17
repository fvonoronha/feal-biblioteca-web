"use client";

import { useTranslations } from "next-intl";
import { Badge, Box, Center, Flex, Image, Input, InputGroup, Skeleton, Spinner, Text, VStack } from "@chakra-ui/react";
import { LuSearch, LuPlus, LuPencil } from "react-icons/lu";
import {
    Body,
    PageHeading,
    SimpleButton,
    GhostButton,
    AdminListRow,
    AdminSortSelect,
    PublisherFormDialog
} from "components";
import { useAdminPublishers } from "hooks";
import { Publisher } from "types";
import { volumeCover } from "assets";

export default function EditorasPage() {
    const t = useTranslations("AdminPublishers");
    const {
        search,
        setSearch,
        sort,
        setSort,
        sortOptions,
        publishers,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,
        editingItem,
        openCreateForm,
        openEditForm,
        closeForm,
        isSaving,
        formErrors,
        saveItem
    } = useAdminPublishers();

    return (
        <Body>
            <Flex
                pb="24px"
                w="100%"
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "flex-end" }}
                justify="space-between"
                gap={4}
            >
                <PageHeading header={t("title")} description={t("description")} />

                <SimpleButton flexShrink={0} onClick={openCreateForm}>
                    <LuPlus /> {t("newButton")}
                </SimpleButton>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} gap={3} mb={5}>
                <InputGroup flex={1} startElement={<LuSearch size={16} />}>
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        size="sm"
                        borderRadius="md"
                    />
                </InputGroup>

                <AdminSortSelect value={sort} options={sortOptions} onChange={setSort} />
            </Flex>

            {isLoadingFirstPage ? (
                <Center py={16}>
                    <Spinner size="lg" color="fealRed.solid" />
                </Center>
            ) : hasFailed ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("loadingError")}</Text>
                </Center>
            ) : publishers.length === 0 ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("nothingFound")}</Text>
                </Center>
            ) : (
                <Skeleton loading={isReloading}>
                    <VStack align="stretch" gap={2} w="100%">
                        {publishers.map((publisher: Publisher) => (
                            <AdminListRow
                                key={publisher.id}
                                avatar={
                                    <Image
                                        src={publisher.avatar_url || volumeCover.default.src}
                                        alt=""
                                        boxSize="44px"
                                        borderRadius="md"
                                        objectFit="cover"
                                        flexShrink={0}
                                    />
                                }
                                title={
                                    <Text fontWeight="bold">
                                        {publisher.abbreviation ? `${publisher.abbreviation} - ` : ""}
                                        {publisher.name}
                                    </Text>
                                }
                                badges={
                                    <Badge colorPalette="gray" size="sm">
                                        {t("volumesCount", { count: publisher.volumes_count ?? 0 })}
                                    </Badge>
                                }
                                subtitle={
                                    publisher.description ? (
                                        <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                                            {publisher.description}
                                        </Text>
                                    ) : undefined
                                }
                                actions={
                                    <GhostButton size="sm" p={2} onClick={() => openEditForm(publisher)}>
                                        <LuPencil size={16} />
                                    </GhostButton>
                                }
                            />
                        ))}

                        {canAutoLoad ? (
                            <Box ref={loadMoreRef} h="40px">
                                {isLoading && (
                                    <Center h="full">
                                        <Spinner size="md" />
                                    </Center>
                                )}
                            </Box>
                        ) : (
                            pagination.has_next && (
                                <Center py={4}>
                                    <SimpleButton onClick={loadMore} disabled={isLoading}>
                                        {isLoading ? <Spinner size="sm" /> : t("loadMoreButton")}
                                    </SimpleButton>
                                </Center>
                            )
                        )}
                    </VStack>
                </Skeleton>
            )}

            <PublisherFormDialog
                editingItem={editingItem}
                onClose={closeForm}
                onSave={saveItem}
                isSaving={isSaving}
                errors={formErrors}
            />
        </Body>
    );
}
