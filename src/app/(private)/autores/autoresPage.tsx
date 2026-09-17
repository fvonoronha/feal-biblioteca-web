"use client";

import { useTranslations } from "next-intl";
import { Badge, Box, Center, Flex, Image, Input, InputGroup, Skeleton, Spinner, Text, VStack } from "@chakra-ui/react";
import { LuSearch, LuUserPlus, LuPencil, LuSparkles, LuCalendarDays } from "react-icons/lu";
import {
    Body,
    PageHeading,
    SimpleButton,
    GhostButton,
    AdminListRow,
    AdminSortSelect,
    AuthorFormDialog,
    GeminiAuthorSuggestDialog
} from "components";
import { useAdminAuthors } from "hooks";
import { authorCover } from "assets";
import { Author } from "types";

function formatLifeSpan(birthDate?: string | null, deathDate?: string | null): string | null {
    const birthYear = birthDate ? new Date(birthDate).getUTCFullYear() : null;
    const deathYear = deathDate ? new Date(deathDate).getUTCFullYear() : null;

    if (birthYear && deathYear) return `${birthYear} — ${deathYear}`;
    if (birthYear) return `${birthYear}`;
    if (deathYear) return `— ${deathYear}`;
    return null;
}

export default function AutoresPage() {
    const t = useTranslations("AdminAuthors");
    const {
        search,
        setSearch,
        sort,
        setSort,
        sortOptions,
        authors,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,

        editingAuthor,
        openCreateForm,
        openEditForm,
        closeForm,
        isSaving,
        formErrors,
        saveAuthor,

        isUploadingAvatar,
        avatarError,
        uploadAuthorAvatarForOpenForm,
        clearAuthorAvatarForOpenForm,

        geminiAuthor,
        isLoadingSuggestion,
        suggestion,
        suggestionError,
        isApplyingSuggestion,
        openGeminiSuggest,
        closeGeminiSuggest,
        applyGeminiSuggestion
    } = useAdminAuthors();

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
                    <LuUserPlus /> {t("newAuthorButton")}
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
            ) : authors.length === 0 ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("nothingFound")}</Text>
                </Center>
            ) : (
                <Skeleton loading={isReloading}>
                    <VStack align="stretch" gap={2} w="100%">
                        {authors.map((author: Author) => {
                            const lifeSpan = formatLifeSpan(author.birth_date, author.death_date);

                            return (
                                <AdminListRow
                                    key={author.id}
                                    avatar={
                                        <Image
                                            src={author.avatar_url || authorCover.default.src}
                                            alt=""
                                            boxSize="44px"
                                            borderRadius="md"
                                            objectFit="cover"
                                            flexShrink={0}
                                        />
                                    }
                                    title={<Text fontWeight="bold">{author.name}</Text>}
                                    badges={
                                        <>
                                            {author.is_spirit && (
                                                <Badge colorPalette="purple" size="sm">
                                                    <LuSparkles size={10} /> {t("spiritBadge")}
                                                </Badge>
                                            )}
                                            {lifeSpan && (
                                                <Badge colorPalette="gray" size="sm">
                                                    <LuCalendarDays size={10} /> {lifeSpan}
                                                </Badge>
                                            )}
                                            <Badge colorPalette="gray" size="sm">
                                                {t("volumesCount", { count: author.volumes_count ?? 0 })}
                                            </Badge>
                                        </>
                                    }
                                    subtitle={
                                        author.description ? (
                                            <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                                                {author.description}
                                            </Text>
                                        ) : undefined
                                    }
                                    actions={
                                        <>
                                            <GhostButton
                                                size="sm"
                                                p={2}
                                                onClick={() => openGeminiSuggest(author)}
                                                title={t("geminiButton")}
                                            >
                                                <LuSparkles size={16} />
                                            </GhostButton>
                                            <GhostButton size="sm" p={2} onClick={() => openEditForm(author)}>
                                                <LuPencil size={16} />
                                            </GhostButton>
                                        </>
                                    }
                                />
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

            <AuthorFormDialog
                editingAuthor={editingAuthor}
                onClose={closeForm}
                onSave={saveAuthor}
                isSaving={isSaving}
                errors={formErrors}
                onUploadImage={uploadAuthorAvatarForOpenForm}
                onClearImage={clearAuthorAvatarForOpenForm}
                isUploadingImage={isUploadingAvatar}
                imageError={avatarError}
            />

            <GeminiAuthorSuggestDialog
                author={geminiAuthor}
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
