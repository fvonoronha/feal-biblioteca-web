"use client";

import { useTranslations } from "next-intl";
import {
    Badge,
    Box,
    Center,
    Collapsible,
    HStack,
    Input,
    InputGroup,
    Flex,
    NativeSelect,
    Skeleton,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import {
    LuSearch,
    LuBookPlus,
    LuPencil,
    LuSparkles,
    LuLayers,
    LuChevronDown,
    LuChevronUp,
    LuCopyPlus
} from "react-icons/lu";
import {
    Body,
    PageHeading,
    SimpleButton,
    GhostButton,
    AdminListRow,
    AdminSortSelect,
    BookCoverFlip,
    CatalogBookFormDialog,
    CatalogVolumeFormDialog,
    GeminiSuggestDialog
} from "components";
import { useAdminBooks } from "hooks";
import { Book } from "types";

export default function AcervoPage() {
    const t = useTranslations("AdminCatalog");
    const {
        search,
        setSearch,
        sort,
        setSort,
        sortOptions,
        categoryFilter,
        setCategoryFilter,
        publisherFilter,
        setPublisherFilter,
        books,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,

        categories,
        publishers,

        editingBook,
        openCreateBookForm,
        openEditBookForm,
        closeBookForm,
        isSavingBook,
        bookFormErrors,
        saveBookForm,

        expandedBookIds,
        volumesByBookId,
        loadingVolumesBookIds,
        toggleBookVolumes,

        volumeFormTarget,
        openAddVolumeForm,
        openEditVolumeForm,
        closeVolumeForm,
        isSavingVolume,
        volumeFormErrors,
        saveVolumeForm,

        isUploadingVolumeImage,
        volumeImageError,
        uploadVolumeImageForOpenForm,
        selectExistingVolumeImageForOpenForm,
        clearVolumeImageForOpenForm,
        removeAuxImageForOpenForm,

        geminiBook,
        isLoadingSuggestion,
        suggestion,
        suggestionError,
        isApplyingSuggestion,
        openGeminiSuggest,
        closeGeminiSuggest,
        applyGeminiSuggestion
    } = useAdminBooks();

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

                <SimpleButton flexShrink={0} onClick={openCreateBookForm}>
                    <LuBookPlus /> {t("newBookButton")}
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

                <NativeSelect.Root size="sm" w={{ base: "full", md: "180px" }}>
                    <NativeSelect.Field
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                    >
                        <option value="">{t("categoryFilterAll")}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>

                <NativeSelect.Root size="sm" w={{ base: "full", md: "180px" }}>
                    <NativeSelect.Field
                        value={publisherFilter}
                        onChange={(event) => setPublisherFilter(event.target.value)}
                    >
                        <option value="">{t("publisherFilterAll")}</option>
                        {publishers.map((publisher) => (
                            <option key={publisher.id} value={publisher.id}>
                                {publisher.name}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>

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
            ) : books.length === 0 ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("nothingFound")}</Text>
                </Center>
            ) : (
                <Skeleton loading={isReloading}>
                    <VStack align="stretch" gap={2} w="100%">
                        {books.map((book: Book) => {
                            const isExpanded = expandedBookIds.has(book.id);
                            const volumes = volumesByBookId[book.id] || [];
                            const isLoadingVolumes = loadingVolumesBookIds.has(book.id);

                            return (
                                <VStack key={book.id} align="stretch" gap={0} w="100%">
                                    <AdminListRow
                                        avatar={<BookCoverFlip coverUrl={book.cover_url} alt={book.title} w="44px" />}
                                        title={<Text fontWeight="bold">{book.title}</Text>}
                                        badges={
                                            <>
                                                {book.category?.name && (
                                                    <Badge colorPalette="gray" size="sm">
                                                        {book.category.name}
                                                    </Badge>
                                                )}
                                                <Badge colorPalette={book.volumes_count ? "green" : "yellow"} size="sm">
                                                    <LuLayers size={10} />{" "}
                                                    {t("volumesCount", { count: book.volumes_count ?? 0 })}
                                                </Badge>
                                            </>
                                        }
                                        subtitle={
                                            <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                                                {[book.subtitle, book.publisher?.name].filter(Boolean).join(" • ")}
                                            </Text>
                                        }
                                        actions={
                                            <>
                                                <SimpleButton
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleBookVolumes(book)}
                                                >
                                                    {isExpanded ? (
                                                        <LuChevronUp size={14} />
                                                    ) : (
                                                        <LuChevronDown size={14} />
                                                    )}
                                                    {t("manageVolumesButton")}
                                                </SimpleButton>
                                                <GhostButton
                                                    size="sm"
                                                    p={2}
                                                    onClick={() => openGeminiSuggest(book)}
                                                    title={t("geminiButton")}
                                                >
                                                    <LuSparkles size={16} />
                                                </GhostButton>
                                                <GhostButton size="sm" p={2} onClick={() => openEditBookForm(book)}>
                                                    <LuPencil size={16} />
                                                </GhostButton>
                                            </>
                                        }
                                    />

                                    <Collapsible.Root open={isExpanded}>
                                        <Collapsible.Content>
                                            <Box
                                                ml={{ base: 2, md: 6 }}
                                                mt={1}
                                                mb={2}
                                                pl={{ base: 3, md: 5 }}
                                                py={3}
                                                borderLeftWidth="2px"
                                                borderColor={{ base: "gray.200", _dark: "gray.700" }}
                                            >
                                                <HStack justify="space-between" mb={3}>
                                                    <Text fontWeight="bold" fontSize="sm" color="fg.muted">
                                                        {t("volumesManagerTitle")}
                                                    </Text>
                                                    <SimpleButton size="xs" onClick={() => openAddVolumeForm(book)}>
                                                        <LuCopyPlus size={14} /> {t("newEditionButton")}
                                                    </SimpleButton>
                                                </HStack>

                                                {isLoadingVolumes ? (
                                                    <Center py={6}>
                                                        <Spinner size="md" color="fealRed.solid" />
                                                    </Center>
                                                ) : volumes.length === 0 ? (
                                                    <Text fontSize="sm" color="fg.muted">
                                                        {t("noVolumesYet")}
                                                    </Text>
                                                ) : (
                                                    <VStack align="stretch" gap={2}>
                                                        {volumes.map((volume) => (
                                                            <AdminListRow
                                                                key={volume.id}
                                                                avatar={
                                                                    <BookCoverFlip
                                                                        coverUrl={volume.cover_url}
                                                                        alt={volume.label || book.title}
                                                                        w="36px"
                                                                    />
                                                                }
                                                                title={
                                                                    <Text fontSize="sm" fontWeight="bold">
                                                                        {volume.label || t("unlabeledVolume")}
                                                                    </Text>
                                                                }
                                                                badges={
                                                                    volume.is_available === false ? (
                                                                        <Badge colorPalette="red" size="sm">
                                                                            {t("loanedBadge")}
                                                                        </Badge>
                                                                    ) : undefined
                                                                }
                                                                subtitle={
                                                                    <Text fontSize="xs" color="fg.muted">
                                                                        {[
                                                                            volume.publisher?.name,
                                                                            volume.year,
                                                                            volume.edition
                                                                        ]
                                                                            .filter(Boolean)
                                                                            .join(" • ")}
                                                                    </Text>
                                                                }
                                                                actions={
                                                                    <GhostButton
                                                                        size="sm"
                                                                        p={2}
                                                                        onClick={() =>
                                                                            openEditVolumeForm(volume, book.title)
                                                                        }
                                                                    >
                                                                        <LuPencil size={14} />
                                                                    </GhostButton>
                                                                }
                                                            />
                                                        ))}
                                                    </VStack>
                                                )}
                                            </Box>
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                </VStack>
                            );
                        })}

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

            <CatalogBookFormDialog
                editingBook={editingBook}
                categories={categories}
                onClose={closeBookForm}
                onSave={saveBookForm}
                isSaving={isSavingBook}
                errors={bookFormErrors}
            />

            <CatalogVolumeFormDialog
                target={volumeFormTarget}
                publishers={publishers}
                siblingVolumes={
                    volumeFormTarget?.mode === "edit" ? volumesByBookId[volumeFormTarget.volume.book.id] || [] : []
                }
                onClose={closeVolumeForm}
                onSave={saveVolumeForm}
                isSaving={isSavingVolume}
                errors={volumeFormErrors}
                onUploadVolumeImage={uploadVolumeImageForOpenForm}
                onSelectExistingVolumeImage={selectExistingVolumeImageForOpenForm}
                onClearVolumeImage={clearVolumeImageForOpenForm}
                onRemoveVolumeAuxImage={removeAuxImageForOpenForm}
                isUploadingVolumeImage={isUploadingVolumeImage}
                volumeImageError={volumeImageError}
            />

            <GeminiSuggestDialog
                book={geminiBook}
                suggestion={suggestion}
                isLoading={isLoadingSuggestion}
                error={suggestionError}
                isApplying={isApplyingSuggestion}
                onClose={closeGeminiSuggest}
                onApply={applyGeminiSuggestion}
            />
        </Body>
    );
}
