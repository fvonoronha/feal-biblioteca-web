"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { listVolumes, listAuthors, listTags, listPublishers, listCategories } from "endpoints";
import { APIPaginatedResponse, Volume, Author, Tag, Publisher, SortOption, Category } from "types";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    Body,
    EntityGrid,
    VolumeGridCard,
    SimpleIconButton,
    SimpleCheckBoxGroup,
    SortSelect,
    GhostButton,
    ActiveFilterBadge,
    PageHeading,
    SimpleButton
} from "components";
import { LoadingIcons } from "assets";
import {
    Spacer,
    HStack,
    Box,
    useBreakpointValue,
    VStack,
    Text,
    Drawer,
    Portal,
    useDisclosure,
    Heading,
    Wrap,
    WrapItem,
    Skeleton,
    Image,
    Flex
} from "@chakra-ui/react";

import { LuSlidersHorizontal } from "react-icons/lu";
import {
    PAGINATION_DEFAULT_VOLUMES_PER_PAGE,
    PAGINATION_UNLIMITED_PER_PAGE,
    DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON,
    QUERY_PARAMS_FOR_AUTHOR,
    QUERY_PARAMS_FOR_SPIRIT_AUTHOR,
    QUERY_PARAMS_FOR_CATEGORY,
    QUERY_PARAMS_FOR_TAG,
    QUERY_PARAMS_FOR_SEARCH,
    QUERY_PARAMS_FOR_PUBLISHER,
    DEFAULT_VOLUME_SORT_OPTION,
    RELEVANCE_VOLUME_SORT_OPTION
} from "utils";

const RESET_BOOKS_PAGINATION = true;
const INTERSECTION_ROOT_MARGIN_IN_PX = 200;
const CATEGORY_FILTERS_MAX_ELEMENTS_BEFORE_COLLAPSE = 15;

export default function Collection() {
    const t = useTranslations("Collection");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isMobile = useBreakpointValue({ base: true, md: false });
    const { open, onOpen, onClose } = useDisclosure();

    // Helper central para atualizar a URL
    const updateUrlParams = (updates: Record<string, string | string[] | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        Object.entries(updates).forEach(([key, values]) => {
            if (
                values === null ||
                values === undefined ||
                (Array.isArray(values) && values.length === 0) ||
                values === ""
            ) {
                current.delete(key);
            } else if (Array.isArray(values)) {
                current.set(key, values.join(","));
            } else {
                current.set(key, values);
            }
        });

        const searchString = current.toString();
        const query = searchString ? `?${searchString}` : "";
        router.push(`${pathname}${query}`, { scroll: false });
    };

    const search = searchParams.get(QUERY_PARAMS_FOR_SEARCH) || "";
    const setSearch = (val: string) => updateUrlParams({ [QUERY_PARAMS_FOR_SEARCH]: val });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const categoriesSlugs = searchParams.get(QUERY_PARAMS_FOR_CATEGORY)?.split(",").filter(Boolean) || [];
    const setCategoriesSlugs = (val: string[] | ((prev: string[]) => string[])) => {
        updateUrlParams({ [QUERY_PARAMS_FOR_CATEGORY]: typeof val === "function" ? val(categoriesSlugs) : val });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tagsSlugs = searchParams.get(QUERY_PARAMS_FOR_TAG)?.split(",").filter(Boolean) || [];
    const setTagsSlugs = (val: string[] | ((prev: string[]) => string[])) => {
        updateUrlParams({ [QUERY_PARAMS_FOR_TAG]: typeof val === "function" ? val(tagsSlugs) : val });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const authorsSlugs = searchParams.get(QUERY_PARAMS_FOR_AUTHOR)?.split(",").filter(Boolean) || [];
    const setAuthorsSlugs = (val: string[] | ((prev: string[]) => string[])) => {
        updateUrlParams({ [QUERY_PARAMS_FOR_AUTHOR]: typeof val === "function" ? val(authorsSlugs) : val });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const spiritAuthorsSlugs = searchParams.get(QUERY_PARAMS_FOR_SPIRIT_AUTHOR)?.split(",").filter(Boolean) || [];
    const setSpiritAuthorsSlugs = (val: string[] | ((prev: string[]) => string[])) => {
        updateUrlParams({
            [QUERY_PARAMS_FOR_SPIRIT_AUTHOR]: typeof val === "function" ? val(spiritAuthorsSlugs) : val
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const publishersSlugs = searchParams.get(QUERY_PARAMS_FOR_PUBLISHER)?.split(",").filter(Boolean) || [];
    const setPublishersSlugs = (val: string[] | ((prev: string[]) => string[])) => {
        updateUrlParams({ [QUERY_PARAMS_FOR_PUBLISHER]: typeof val === "function" ? val(publishersSlugs) : val });
    };

    // STATES ORIGINAIS MANTIDOS PARA O LAYOUT/PAGINAÇÃO
    const pageRef = useRef(1);
    const [hasNext, setHasNext] = useState(true);
    const loadMoreVolumesRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [isVolumesLoadingFirstFilter, setIsVolumesLoadingFirstFilter] = useState(true);
    const [isVolumesLoadingFirstTime, setIsVolumesLoadingFirstTime] = useState(true);
    const [isVolumesLoading, setIsVolumesLoading] = useState(true);
    const [isVolumesLoadingFailed, setIsVolumesLoadingFailed] = useState(false);

    const [volumes, setVolumes] = useState<APIPaginatedResponse<Volume>>({
        elements: Array.from({ length: 29 }, () => ({ ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() })),
        pagination: {
            page: 1,
            limit: PAGINATION_DEFAULT_VOLUMES_PER_PAGE,
            total_elements: PAGINATION_DEFAULT_VOLUMES_PER_PAGE,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [isAuthorsLoading, setIsAuthorsLoading] = useState(false);
    const [isAuthorsLoadFailed, setIsAuthorsLoadFailed] = useState(false);
    const [filterAuthors, setFilterAuthors] = useState<APIPaginatedResponse<Author>>({
        elements: [],
        pagination: { page: 1, limit: 10, total_elements: 0, total_pages: 0, has_next: false, has_previous: false }
    });

    const [, setIsTagsLoading] = useState(false);
    const [isTagsLoadFailed, setIsTagsLoadFailed] = useState(false);
    const [filterTags, setFilterTags] = useState<APIPaginatedResponse<Tag>>({
        elements: [],
        pagination: { page: 1, limit: 10, total_elements: 0, total_pages: 0, has_next: false, has_previous: false }
    });

    const [, setIsCategoriesLoading] = useState(false);
    const [isCategoriesLoadFailed, setIsCategoriesLoadFailed] = useState(false);
    const [filterCategories, setFilterCategories] = useState<APIPaginatedResponse<Category>>({
        elements: [],
        pagination: { page: 1, limit: 10, total_elements: 0, total_pages: 0, has_next: false, has_previous: false }
    });

    const [, setIsPublishersLoading] = useState(false);
    const [isPublishersLoadFailed, setIsPublishersLoadFailed] = useState(false);
    const [filterPublishers, setFilterPublishers] = useState<APIPaginatedResponse<Publisher>>({
        elements: [],
        pagination: { page: 1, limit: 10, total_elements: 0, total_pages: 0, has_next: false, has_previous: false }
    });

    const [sort, setSort] = useState<SortOption>(DEFAULT_VOLUME_SORT_OPTION);

    // 2. TRADUÇÃO DE SLUGS PARA IDs PARA A API
    // Isso garante que se a URL tem `?category=espiritismo`, a API vai receber `{ category_id: ['123'] }`
    const categoryIds = useMemo(
        () =>
            categoriesSlugs
                .map((slug) => filterCategories.elements.find((c) => c.slug === slug)?.id.toString())
                .filter(Boolean) as string[],
        [categoriesSlugs, filterCategories.elements]
    );
    const publishersIds = useMemo(
        () =>
            publishersSlugs
                .map((slug) => filterPublishers.elements.find((p) => p.slug === slug)?.id.toString())
                .filter(Boolean) as string[],
        [publishersSlugs, filterPublishers.elements]
    );
    const tagIds = useMemo(
        () =>
            tagsSlugs
                .map((slug) => filterTags.elements.find((t) => t.slug === slug)?.id.toString())
                .filter(Boolean) as string[],
        [tagsSlugs, filterTags.elements]
    );
    const authorIds = useMemo(
        () =>
            authorsSlugs
                .map((slug) => filterAuthors.elements.find((a) => a.slug === slug)?.id.toString())
                .filter(Boolean) as string[],
        [authorsSlugs, filterAuthors.elements]
    );
    const spiritAuthorIds = useMemo(
        () =>
            spiritAuthorsSlugs
                .map((slug) => filterAuthors.elements.find((a) => a.slug === slug)?.id.toString())
                .filter(Boolean) as string[],
        [spiritAuthorsSlugs, filterAuthors.elements]
    );

    const getCombinedFilters = () => {
        return {
            search: search,
            author: [...authorIds, ...spiritAuthorIds],
            publisher: publishersIds,
            tag: tagIds,
            category: categoryIds
        };
    };

    // 3. SEPARAÇÃO INTELIGENTE DE AUTORES (Tratamento de URL legada)
    // Se entrar um link antigo com um autor espiritual na chave comum de autores, movemos para a chave correta
    useEffect(() => {
        if (filterAuthors.elements.length === 0) return;
        let needsUrlUpdate = false;
        const newAuthorSlugs = [...authorsSlugs];
        const newSpiritAuthorSlugs = [...spiritAuthorsSlugs];

        authorsSlugs.forEach((slug) => {
            const author = filterAuthors.elements.find((a) => a.slug === slug);
            if (author && author.is_spirit) {
                newAuthorSlugs.splice(newAuthorSlugs.indexOf(slug), 1);
                if (!newSpiritAuthorSlugs.includes(slug)) newSpiritAuthorSlugs.push(slug);
                needsUrlUpdate = true;
            }
        });

        if (needsUrlUpdate) {
            updateUrlParams({ [QUERY_PARAMS_FOR_AUTHOR]: newAuthorSlugs, spirit_author: newSpiritAuthorSlugs });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterAuthors.elements, authorsSlugs, spiritAuthorsSlugs]);

    const loadVolumes = async (reset: boolean = false) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsVolumesLoading(true);
        setIsVolumesLoadingFailed(false);

        try {
            if (reset) pageRef.current = 1;

            if (search.trim() !== "") {
                setSort(RELEVANCE_VOLUME_SORT_OPTION);
            }

            const pagination = {
                limit: PAGINATION_DEFAULT_VOLUMES_PER_PAGE,
                page: pageRef.current,
                sort: [
                    { by: sort.field, order: sort.direction },
                    { by: DEFAULT_VOLUME_SORT_OPTION.field, order: DEFAULT_VOLUME_SORT_OPTION.direction }
                ]
            };
            const response = await listVolumes(getCombinedFilters(), pagination, { signal: controller.signal });

            setVolumes((prev) => ({
                elements: reset ? response.elements : [...prev.elements, ...response.elements],
                pagination: response.pagination
            }));

            setHasNext(response.pagination.has_next);
            pageRef.current += 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setIsVolumesLoadingFailed(true);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsVolumesLoading(false);
                setIsVolumesLoadingFirstTime(false);
                setIsVolumesLoadingFirstFilter(false);
            }
        }
    };

    const loadAuthors = async () => {
        setIsAuthorsLoading(true);
        try {
            const objs = await listAuthors(getCombinedFilters(), {
                limit: PAGINATION_UNLIMITED_PER_PAGE,
                page: 1
            });
            setFilterAuthors(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsAuthorsLoadFailed(true);
        } finally {
            setIsAuthorsLoading(false);
        }
    };

    const loadTags = async () => {
        setIsTagsLoading(true);
        try {
            const objs = await listTags(getCombinedFilters(), { limit: PAGINATION_UNLIMITED_PER_PAGE, page: 1 });
            setFilterTags(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsTagsLoadFailed(true);
        } finally {
            setIsTagsLoading(false);
        }
    };

    const loadCategories = async () => {
        setIsCategoriesLoading(true);
        try {
            const objs = await listCategories(getCombinedFilters(), {
                limit: PAGINATION_UNLIMITED_PER_PAGE,
                page: 1
            });
            setFilterCategories(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsCategoriesLoadFailed(true);
        } finally {
            setIsCategoriesLoading(false);
        }
    };

    const loadPublishers = async () => {
        setIsPublishersLoading(true);
        try {
            const objs = await listPublishers(getCombinedFilters(), {
                limit: PAGINATION_UNLIMITED_PER_PAGE,
                page: 1
            });
            setFilterPublishers(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsPublishersLoadFailed(true);
        } finally {
            setIsPublishersLoading(false);
        }
    };

    const changedFilters = async () => {
        setIsVolumesLoadingFirstFilter(true);
        loadVolumes(RESET_BOOKS_PAGINATION);
        loadAuthors();
        loadTags();
        loadCategories();
        loadPublishers();
    };

    const clearFilters = async () => {
        router.push(pathname, { scroll: false });
        setIsVolumesLoadingFirstTime(true);
    };

    // Observa os IDs já traduzidos para garantir que as buscas ocorram na ordem certa
    useEffect(() => {
        changedFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        categoryIds.join(","),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tagIds.join(","),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        authorIds.join(","),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        spiritAuthorIds.join(","),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        publishersIds.join(","),
        sort.value,
        search
    ]);

    useEffect(() => {
        const el = loadMoreVolumesRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNext && !isVolumesLoading) {
                    loadVolumes();
                }
            },
            { rootMargin: `${INTERSECTION_ROOT_MARGIN_IN_PX}px` }
        );

        observer.observe(el);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNext, isVolumesLoading]);

    // RENDERIZAÇÃO DOS BADGES
    const activeFiltersBadges = (
        <Wrap>
            {search !== "" && (
                <WrapItem>
                    <ActiveFilterBadge
                        label={`${t("search")}: ${search}`}
                        value={search}
                        cancelFilter={() => setSearch("")}
                    />
                </WrapItem>
            )}

            {/* Agora filtramos usando o Slug para exibir as badges ativas */}
            {filterCategories.elements
                .filter((c) => categoriesSlugs.includes(c.slug))
                .map((category) => (
                    <WrapItem key={`category#${category.id}`}>
                        <ActiveFilterBadge
                            label={`${t("category")}: ${category.name}`}
                            value={category.slug}
                            cancelFilter={(val) => setCategoriesSlugs(categoriesSlugs.filter((s) => s !== val))}
                        />
                    </WrapItem>
                ))}

            {filterAuthors.elements
                .filter((a) => authorsSlugs.includes(a.slug) || spiritAuthorsSlugs.includes(a.slug))
                .map((author) => (
                    <WrapItem key={`author#${author.id}`}>
                        <ActiveFilterBadge
                            label={`${t("author")}: ${author.name}`}
                            value={author.slug}
                            cancelFilter={(val) => {
                                setAuthorsSlugs(authorsSlugs.filter((s) => s !== val));
                                setSpiritAuthorsSlugs(spiritAuthorsSlugs.filter((s) => s !== val));
                            }}
                        />
                    </WrapItem>
                ))}

            {filterTags.elements
                .filter((t) => tagsSlugs.includes(t.slug))
                .map((tag) => (
                    <WrapItem key={`tag#${tag.id}`}>
                        <ActiveFilterBadge
                            label={`${t("tag")}: ${tag.name}`}
                            value={tag.slug}
                            cancelFilter={(val) => setTagsSlugs(tagsSlugs.filter((s) => s !== val))}
                        />
                    </WrapItem>
                ))}

            {filterPublishers.elements
                .filter((p) => publishersSlugs.includes(p.slug))
                .map((publisher) => (
                    <WrapItem key={`publisher#${publisher.name}`}>
                        <ActiveFilterBadge
                            label={`${t("publisher")}: ${publisher.abbreviation ? publisher.abbreviation : publisher.name}`}
                            value={publisher.name}
                            cancelFilter={(val) => setPublishersSlugs(publishersSlugs.filter((n) => n !== val))}
                        />
                    </WrapItem>
                ))}
        </Wrap>
    );

    const clearFiltersContent = (search !== "" ||
        categoriesSlugs.length > 0 ||
        authorsSlugs.length > 0 ||
        spiritAuthorsSlugs.length > 0 ||
        tagsSlugs.length > 0 ||
        publishersSlugs.length > 0) && <GhostButton onClick={clearFilters}>{t("removeFilters")}</GhostButton>;

    const filtersContent = (
        <Skeleton loading={isVolumesLoadingFirstTime}>
            <VStack align="start" w="100%">
                <HStack w="100%">
                    <Heading fontSize={"xl"}>{t("filter")}</Heading>
                    <Spacer />
                    {clearFiltersContent}
                </HStack>

                {activeFiltersBadges}

                {isMobile && <SortSelect label={t("sortBy")} labelPosition="top" value={sort} onChange={setSort} />}

                {/* Mudança chave: values agora recebem o array de slugs, e 'value' nas options é a.slug */}
                <SimpleCheckBoxGroup
                    maxElementsBeforeCollapse={CATEGORY_FILTERS_MAX_ELEMENTS_BEFORE_COLLAPSE}
                    label={t("category")}
                    hide={isCategoriesLoadFailed}
                    options={filterCategories.elements.map((category) => ({
                        label: `${category.name} (${category.volumes_count || "0"})`,
                        value: category.slug
                    }))}
                    values={categoriesSlugs}
                    setValues={setCategoriesSlugs}
                />

                <SimpleCheckBoxGroup
                    label={t("tag")}
                    hide={isTagsLoadFailed}
                    options={filterTags.elements.map((tag) => ({
                        label: `${tag.name} (${tag.volumes_count || "0"})`,
                        value: tag.slug
                    }))}
                    values={tagsSlugs}
                    setValues={setTagsSlugs}
                />

                <SimpleCheckBoxGroup
                    label={t("author")}
                    isLoading={isAuthorsLoading}
                    hide={isAuthorsLoadFailed}
                    options={filterAuthors.elements
                        .filter((author) => !author.is_spirit)
                        .map((author) => ({
                            label: `${author.name} (${author.volumes_count || "0"})`,
                            value: author.slug
                        }))}
                    values={authorsSlugs}
                    setValues={setAuthorsSlugs}
                />

                <SimpleCheckBoxGroup
                    label={t("spiritAuthor")}
                    hide={isAuthorsLoadFailed}
                    options={filterAuthors.elements
                        .filter((author) => author.is_spirit)
                        .map((author) => ({
                            label: `${author.name} (${author.volumes_count || "0"})`,
                            value: author.slug
                        }))}
                    values={spiritAuthorsSlugs}
                    setValues={setSpiritAuthorsSlugs}
                />

                <SimpleCheckBoxGroup
                    label={t("publisher")}
                    hide={isPublishersLoadFailed}
                    options={filterPublishers.elements.map((publisher) => ({
                        label: `${publisher.abbreviation ? publisher.abbreviation : publisher.name} (${publisher.volumes_count || "0"})`,
                        value: publisher.slug
                    }))}
                    values={publishersSlugs}
                    setValues={setPublishersSlugs}
                />
            </VStack>
        </Skeleton>
    );

    return (
        <>
            <Body>
                <VStack pb={"24px"}>
                    <PageHeading header={t("title")} description={t("description")} />
                </VStack>

                {isMobile && (
                    <>
                        <HStack w="100%" cursor={"pointer"} onClick={onOpen}>
                            <SimpleIconButton>
                                <LuSlidersHorizontal />
                            </SimpleIconButton>
                            <Text>{t("filterAndSort")}</Text>
                            <Spacer />
                            <Text>
                                {volumes.elements.length > 0 &&
                                    t("showingXFromYVolumes", {
                                        count: volumes.elements.length,
                                        total: volumes.pagination.total_elements
                                    })}
                            </Text>
                        </HStack>

                        <HStack>
                            {activeFiltersBadges}
                            {clearFiltersContent}
                        </HStack>

                        <Drawer.Root open={open} onOpenChange={(e) => (e.open ? onOpen() : onClose())}>
                            <Portal>
                                <Drawer.Backdrop />
                                <Drawer.Positioner>
                                    <Drawer.Content>
                                        <Drawer.Body pt={"12px"}>{filtersContent}</Drawer.Body>
                                    </Drawer.Content>
                                </Drawer.Positioner>
                            </Portal>
                        </Drawer.Root>
                    </>
                )}

                <HStack align="start" gap="0">
                    {!isMobile && (
                        <Box w="320px" py={1} position="sticky" top="0" maxH="100vh" overflowY="auto">
                            {filtersContent}
                        </Box>
                    )}

                    <Box flex="1">
                        {!isMobile && (
                            <Flex
                                pl={4}
                                direction={{ base: "column", md: "row" }}
                                justify="space-between"
                                align={{ base: "center", md: "center" }}
                                gap="6"
                            >
                                <Skeleton loading={isVolumesLoading}>
                                    <Text>
                                        {volumes.elements.length > 0 &&
                                            t("showingXFromYVolumes", { total: volumes.pagination.total_elements })}
                                    </Text>
                                </Skeleton>
                                <Spacer flex={1} />
                                <Skeleton loading={isVolumesLoadingFirstTime}>
                                    <HStack minW="230px">
                                        <SortSelect
                                            label={`${t("sortBy")}:`}
                                            labelPosition="left"
                                            value={sort}
                                            onChange={setSort}
                                        />
                                    </HStack>
                                </Skeleton>
                            </Flex>
                        )}

                        {volumes.elements.length == 0 && !isVolumesLoading && !isVolumesLoadingFirstTime ? (
                            <VStack align={"center"}>
                                <HStack align={"center"} pt="50px">
                                    <VStack align={"center"}>
                                        <Image w="300px" src={LoadingIcons.empty.src} alt={t("somethingIsWrong")} />
                                        <Heading textAlign={"center"}>{t("nothingFound")}</Heading>
                                        <SimpleButton onClick={clearFilters}>{t("removeFilters")}</SimpleButton>
                                    </VStack>
                                </HStack>
                            </VStack>
                        ) : (
                            <EntityGrid
                                pl={4}
                                variant="grid"
                                loadingFailed={isVolumesLoadingFailed}
                                isLoadingMore={isVolumesLoading}
                                isEmpty={volumes.elements.length == 0}
                                eWidth={"180px"}
                                pt={2}
                            >
                                {volumes.elements.map((obj: Volume) => (
                                    <Skeleton
                                        key={`volumeCard#${obj.id}`}
                                        loading={isVolumesLoadingFirstTime || isVolumesLoadingFirstFilter}
                                    >
                                        <VolumeGridCard volume={obj} search={search} />
                                    </Skeleton>
                                ))}
                            </EntityGrid>
                        )}

                        <Box ref={loadMoreVolumesRef} h="40px" />
                    </Box>
                </HStack>
            </Body>
        </>
    );
}
