"use client";

import { useTranslations } from "next-intl";
import { Badge, Box, Center, Flex, Input, InputGroup, Skeleton, Spinner, Text, VStack } from "@chakra-ui/react";
import { LuSearch, LuPlus, LuPencil, LuTag } from "react-icons/lu";
import {
    Body,
    PageHeading,
    SimpleButton,
    GhostButton,
    AdminListRow,
    AdminSortSelect,
    SimpleEntityFormDialog
} from "components";
import { useAdminTags } from "hooks";
import { Tag } from "types";

export default function TemasPage() {
    const t = useTranslations("AdminTags");
    const {
        search,
        setSearch,
        sort,
        setSort,
        sortOptions,
        tags,
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
    } = useAdminTags();

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
            ) : tags.length === 0 ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("nothingFound")}</Text>
                </Center>
            ) : (
                <Skeleton loading={isReloading}>
                    <VStack align="stretch" gap={2} w="100%">
                        {tags.map((tag: Tag) => (
                            <AdminListRow
                                key={tag.id}
                                avatar={
                                    <Box
                                        p={2.5}
                                        borderRadius="full"
                                        bg={{ base: "gray.100", _dark: "gray.700" }}
                                        color="fealRed.solid"
                                        flexShrink={0}
                                    >
                                        <LuTag size={20} />
                                    </Box>
                                }
                                title={<Text fontWeight="bold">{tag.name}</Text>}
                                badges={
                                    <Badge colorPalette="gray" size="sm">
                                        {t("booksCount", { count: tag.books_count ?? 0 })}
                                    </Badge>
                                }
                                subtitle={
                                    tag.description ? (
                                        <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                                            {tag.description}
                                        </Text>
                                    ) : undefined
                                }
                                actions={
                                    <GhostButton size="sm" p={2} onClick={() => openEditForm(tag)}>
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

            <SimpleEntityFormDialog
                editingItem={editingItem}
                onClose={closeForm}
                onSave={saveItem}
                isSaving={isSaving}
                errors={formErrors}
                createTitle={t("createTitle")}
                editTitle={t("editTitle")}
                nameLabel={t("nameLabel")}
                namePlaceholder={t("namePlaceholder")}
                descriptionLabel={t("descriptionLabel")}
                descriptionPlaceholder={t("descriptionPlaceholder")}
                cancelLabel={t("cancelButton")}
                saveLabel={t("saveButton")}
            />
        </Body>
    );
}
