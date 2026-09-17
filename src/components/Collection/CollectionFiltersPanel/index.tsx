"use client";

import { Accordion, Badge, HStack, Heading, Skeleton, Spacer, Text, VStack } from "@chakra-ui/react";
import { GhostButton, SimpleCheckBoxGroup, SortSelect } from "components";
import { VolumesCollection } from "hooks";
import { useTranslations } from "next-intl";
import CollectionActiveFilterBadges from "../CollectionActiveFilterBadges";

const CATEGORY_FILTERS_MAX_ELEMENTS_BEFORE_COLLAPSE = 15;

type Props = {
    collection: VolumesCollection;
    showSortSelect?: boolean;
    hideTitle?: boolean;
};

export default function CollectionFiltersPanel({ collection, showSortSelect = false, hideTitle = false }: Props) {
    const t = useTranslations("Collection");
    const {
        sort,
        setSort,
        categories,
        isCategoriesLoading,
        isCategoriesLoadFailed,
        tags,
        isTagsLoading,
        isTagsLoadFailed,
        authors,
        isAuthorsLoading,
        isAuthorsLoadFailed,
        publishers,
        isPublishersLoading,
        isPublishersLoadFailed,
        isVolumesLoadingFirstTime,
        filters
    } = collection;
    const {
        categories: categorySlugs,
        setCategories,
        tags: tagSlugs,
        setTags,
        authors: authorSlugs,
        setAuthors,
        spiritAuthors: spiritAuthorSlugs,
        setSpiritAuthors,
        publishers: publisherSlugs,
        setPublishers,
        hasActiveFilters,
        clearFilters
    } = filters;

    const regularAuthors = authors.filter((author) => !author.is_spirit);
    const spiritAuthors = authors.filter((author) => author.is_spirit);

    // Cada grupo só vira uma seção do acordeão se tiver opções pra mostrar (ou ainda estiver
    // carregando a primeira vez) - do contrário sobraria um cabeçalho clicável que abre para
    // uma lista vazia. Manter o grupo visível enquanto carrega (em vez de só aparecer quando
    // os dados chegam) é o que garante que ele já esteja presente no acordeão desde a
    // primeira renderização, para o `defaultValue` abaixo conseguir abri-lo por padrão.
    const groups = [
        {
            value: "category",
            label: t("category"),
            activeCount: categorySlugs.length,
            show: !isCategoriesLoadFailed && (isCategoriesLoading || categories.length > 0),
            content: (
                <SimpleCheckBoxGroup
                    maxElementsBeforeCollapse={CATEGORY_FILTERS_MAX_ELEMENTS_BEFORE_COLLAPSE}
                    isLoading={isCategoriesLoading}
                    options={categories.map((category) => ({
                        label: `${category.name} (${category.volumes_count || "0"})`,
                        value: category.slug
                    }))}
                    values={categorySlugs}
                    setValues={setCategories}
                />
            )
        },
        {
            value: "tag",
            label: t("tag"),
            activeCount: tagSlugs.length,
            show: !isTagsLoadFailed && (isTagsLoading || tags.length > 0),
            content: (
                <SimpleCheckBoxGroup
                    isLoading={isTagsLoading}
                    options={tags.map((tag) => ({
                        label: `${tag.name} (${tag.volumes_count || "0"})`,
                        value: tag.slug
                    }))}
                    values={tagSlugs}
                    setValues={setTags}
                />
            )
        },
        {
            value: "author",
            label: t("author"),
            activeCount: authorSlugs.length,
            show: !isAuthorsLoadFailed && (isAuthorsLoading || regularAuthors.length > 0),
            content: (
                <SimpleCheckBoxGroup
                    isLoading={isAuthorsLoading}
                    options={regularAuthors.map((author) => ({
                        label: `${author.name} (${author.volumes_count || "0"})`,
                        value: author.slug
                    }))}
                    values={authorSlugs}
                    setValues={setAuthors}
                />
            )
        },
        {
            value: "spiritAuthor",
            label: t("spiritAuthor"),
            activeCount: spiritAuthorSlugs.length,
            show: !isAuthorsLoadFailed && (isAuthorsLoading || spiritAuthors.length > 0),
            content: (
                <SimpleCheckBoxGroup
                    isLoading={isAuthorsLoading}
                    options={spiritAuthors.map((author) => ({
                        label: `${author.name} (${author.volumes_count || "0"})`,
                        value: author.slug
                    }))}
                    values={spiritAuthorSlugs}
                    setValues={setSpiritAuthors}
                />
            )
        },
        {
            value: "publisher",
            label: t("publisher"),
            activeCount: publisherSlugs.length,
            show: !isPublishersLoadFailed && (isPublishersLoading || publishers.length > 0),
            content: (
                <SimpleCheckBoxGroup
                    isLoading={isPublishersLoading}
                    options={publishers.map((publisher) => ({
                        label: `${publisher.abbreviation ? publisher.abbreviation : publisher.name} (${publisher.volumes_count || "0"})`,
                        value: publisher.slug
                    }))}
                    values={publisherSlugs}
                    setValues={setPublishers}
                />
            )
        }
    ].filter((group) => group.show);

    return (
        <Skeleton loading={isVolumesLoadingFirstTime}>
            <VStack align="start" w="100%" gap={4}>
                <HStack w="100%">
                    {!hideTitle && <Heading fontSize="xl">{t("filter")}</Heading>}
                    <Spacer />
                    {hasActiveFilters && <GhostButton onClick={clearFilters}>{t("removeFilters")}</GhostButton>}
                </HStack>

                <CollectionActiveFilterBadges collection={collection} />

                {showSortSelect && (
                    <SortSelect label={t("sortBy")} labelPosition="top" value={sort} onChange={setSort} />
                )}

                <Accordion.Root multiple collapsible defaultValue={groups.map((group) => group.value)} w="100%">
                    {groups.map((group) => (
                        <Accordion.Item key={group.value} value={group.value} borderColor={{ base: "gray.muted", _dark: "gray.700" }}>
                            <Accordion.ItemTrigger cursor="pointer" py={3}>
                                <HStack flex="1" gap={2}>
                                    <Text fontWeight="bold">{group.label}</Text>
                                    {group.activeCount > 0 && (
                                        <Badge colorPalette="fealRed" borderRadius="full" px={2}>
                                            {group.activeCount}
                                        </Badge>
                                    )}
                                </HStack>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>

                            <Accordion.ItemContent>
                                <Accordion.ItemBody pb={4}>{group.content}</Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </VStack>
        </Skeleton>
    );
}
