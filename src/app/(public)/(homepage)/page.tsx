"use client";

import { useState, useEffect, useRef } from "react";
import { listBooks, listAuthors, listTags, listPublishers, listCategories } from "endpoints";
import { APIPaginatedResponse, Book, Author, Tag, Publisher, SortOption, Category } from "types";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
    Body,
    BookGrid,
    BookGridCard,
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
    PAGINATION_DEFAULT_BOOKS_PER_PAGE,
    PAGINATION_UNLIMITED_BOOKS_PER_PAGE,
    DEFAULT_EXAMPLE_BOOK_FOR_SKELETON
} from "utils";

const RESET_BOOKS_PAGINATION = true;
const INTERSECTION_ROOT_MARGIN_IN_PX = 200;
const CATEGORY_FILTERS_MAX_ELEMENTS_BEFORE_COLLAPSE = 15;

export default function Collection() {
    const t = useTranslations("Collection");

    const isMobile = useBreakpointValue({ base: true, md: false });
    const { open, onOpen, onClose } = useDisclosure();
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get("q") || "";

    const pageRef = useRef(1);
    const [hasNext, setHasNext] = useState(true);
    const loadMoreBooksRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [isBooksLoadingFirstFilter, setIsBooksLoadingFirstFilter] = useState(true);
    const [isBooksLoadingFirstTime, setIsBooksLoadingFirstTime] = useState(true);
    const [isBooksLoading, setIsBooksLoading] = useState(true);
    const [isBooksLoadFailed, setIsBooksLoadFailed] = useState(false);
    const [books, setBooks] = useState<APIPaginatedResponse<Book>>({
        elements: [
            // Isso aqui deveria ser uma função de algum service específico pra Mocker Data.
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() }
        ],
        pagination: {
            page: 1,
            limit: PAGINATION_DEFAULT_BOOKS_PER_PAGE,
            total_elements: PAGINATION_DEFAULT_BOOKS_PER_PAGE,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [isAuthorsLoading, setIsAuthorsLoading] = useState(false);
    const [isAuthorsLoadFailed, setIsAuthorsLoadFailed] = useState(false);
    const [filterAuthors, setFilterAuthors] = useState<APIPaginatedResponse<Author>>({
        elements: [],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [, setIsTagsLoading] = useState(false);
    const [isTagsLoadFailed, setIsTagsLoadFailed] = useState(false);
    const [filterTags, setFilterTags] = useState<APIPaginatedResponse<Tag>>({
        elements: [],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [, setIsCategoriesLoading] = useState(false);
    const [isCategoriesLoadFailed, setIsCategoriesLoadFailed] = useState(false);
    const [filterCategories, setFilterCategories] = useState<APIPaginatedResponse<Category>>({
        elements: [],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [, setIsPublishersLoading] = useState(false);
    const [isPublishersLoadFailed, setIsPublishersLoadFailed] = useState(false);
    const [filterPublishers, setFilterPublishers] = useState<APIPaginatedResponse<Publisher>>({
        elements: [],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>({
        value: "sortByCreationDesc",
        label: "sortByCreationDesc",
        field: "id",
        direction: "desc"
    });

    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedSpiritAuthors, setSelectedSpiritAuthors] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);

    const getCombinedFilters = () => {
        return {
            search: search,
            authors: [...selectedAuthors, ...selectedSpiritAuthors],
            publishers: selectedPublishers,
            tags: selectedTags,
            category_id: selectedCategories
        };
    };

    const loadBooks = async (reset: boolean = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsBooksLoading(true);
        setIsBooksLoadFailed(false);

        try {
            if (reset) {
                pageRef.current = 1;
            }

            const pagination = {
                limit: PAGINATION_DEFAULT_BOOKS_PER_PAGE,
                page: pageRef.current,
                orderBy: {
                    [sort.field]: sort.direction
                }
            };

            const response = await listBooks(getCombinedFilters(), pagination, { signal: controller.signal });

            setBooks((prev) => ({
                elements: reset ? response.elements : [...prev.elements, ...response.elements],
                pagination: response.pagination
            }));

            setHasNext(response.pagination.has_next);
            pageRef.current += 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setIsBooksLoadFailed(true);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsBooksLoading(false);
                setIsBooksLoadingFirstTime(false);
                setIsBooksLoadingFirstFilter(false);
            }
        }
    };

    const loadAuthors = async () => {
        setIsAuthorsLoading(true);
        setIsAuthorsLoadFailed(false);

        try {
            const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_UNLIMITED_BOOKS_PER_PAGE,
                page: 1
            };

            const objs = await listAuthors(filter, pagination);

            setFilterAuthors(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsAuthorsLoadFailed(true);
        } finally {
            setIsAuthorsLoading(false);
        }
    };

    const loadTags = async () => {
        setIsTagsLoading(true);
        setIsTagsLoadFailed(false);

        try {
            const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_UNLIMITED_BOOKS_PER_PAGE,
                page: 1
            };

            const objs = await listTags(filter, pagination);
            setFilterTags(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsTagsLoadFailed(true);
        } finally {
            setIsTagsLoading(false);
        }
    };

    const loadCategories = async () => {
        setIsCategoriesLoading(true);
        setIsCategoriesLoadFailed(false);

        try {
            const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_UNLIMITED_BOOKS_PER_PAGE,
                page: 1
            };

            const objs = await listCategories(filter, pagination);
            setFilterCategories(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsCategoriesLoadFailed(true);
        } finally {
            setIsCategoriesLoading(false);
        }
    };

    const loadPublishers = async () => {
        setIsPublishersLoading(true);
        setIsPublishersLoadFailed(false);

        try {
            const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_UNLIMITED_BOOKS_PER_PAGE,
                page: 1
            };

            const objs = await listPublishers(filter, pagination);
            setFilterPublishers(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsPublishersLoadFailed(true);
        } finally {
            setIsPublishersLoading(false);
        }
    };

    const changedFilters = async () => {
        setIsBooksLoadingFirstFilter(true);

        loadBooks(RESET_BOOKS_PAGINATION);
        loadAuthors();
        loadTags();
        loadCategories();
        loadPublishers();
    };

    const clearFilters = async () => {
        setIsBooksLoadingFirstTime(true);
        setSelectedAuthors([]);
        setSelectedSpiritAuthors([]);
        setSelectedTags([]);
        setSelectedCategories([]);
        setSelectedPublishers([]);
        setSearch("");
    };

    useEffect(() => {
        changedFilters();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAuthors, selectedSpiritAuthors, selectedTags, selectedCategories, selectedPublishers, sort, search]);

    useEffect(() => {
        const el = loadMoreBooksRef.current;

        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry.isIntersecting && hasNext && !isBooksLoading) {
                    loadBooks();
                }
            },
            { rootMargin: `${INTERSECTION_ROOT_MARGIN_IN_PX}px` }
        );

        observer.observe(el);

        return () => observer.disconnect();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNext, isBooksLoading]);

    useEffect(() => {
        setSearch(queryFromUrl);
    }, [queryFromUrl]);

    // ToDo: Componentizar esses pedaços de layout
    const activeFiltersBadges = (
        <Wrap>
            {search !== "" && (
                <WrapItem>
                    <ActiveFilterBadge
                        label={`${t("search")}: ${search}`}
                        value={search}
                        cancelFilter={() => {
                            setSearch("");
                        }}
                    />
                </WrapItem>
            )}

            {filterCategories.elements
                .filter((category) => selectedCategories.includes(`${category.id}`))
                .map((category) => {
                    return (
                        <WrapItem key={`category#${category.id}`}>
                            <ActiveFilterBadge
                                key={`category#${category.id}`}
                                label={`${t("category")}: ${category.name}`}
                                value={`${category.id}`}
                                cancelFilter={(value) => {
                                    setSelectedCategories(selectedCategories.filter((id) => id != value));
                                }}
                            />
                        </WrapItem>
                    );
                })}

            {filterAuthors.elements
                .filter(
                    (author) =>
                        selectedAuthors.includes(`${author.id}`) || selectedSpiritAuthors.includes(`${author.id}`)
                )
                .map((author) => {
                    return (
                        <WrapItem key={`author#${author.id}`}>
                            <ActiveFilterBadge
                                label={`${t("author")}: ${author.name}`}
                                value={`${author.id}`}
                                cancelFilter={(value) => {
                                    setSelectedAuthors(selectedAuthors.filter((id) => id != value));
                                    setSelectedSpiritAuthors(selectedSpiritAuthors.filter((id) => id != value));
                                }}
                            />
                        </WrapItem>
                    );
                })}

            {filterTags.elements
                .filter((tag) => selectedTags.includes(`${tag.id}`))
                .map((tag) => {
                    return (
                        <WrapItem key={`tag#${tag.id}`}>
                            <ActiveFilterBadge
                                key={`tag#${tag.id}`}
                                label={`${t("tag")}: ${tag.name}`}
                                value={`${tag.id}`}
                                cancelFilter={(value) => {
                                    setSelectedTags(selectedTags.filter((id) => id != value));
                                }}
                            />
                        </WrapItem>
                    );
                })}

            {filterPublishers.elements
                .filter((publisher) => selectedPublishers.includes(publisher.name))
                .map((publisher) => {
                    return (
                        <WrapItem key={`publisher#${publisher.name}`}>
                            <ActiveFilterBadge
                                key={`publisher#${publisher.name}`}
                                label={`${t("publisher")}: ${publisher.name}`}
                                value={publisher.name}
                                cancelFilter={(value) => {
                                    setSelectedPublishers(selectedPublishers.filter((name) => name != value));
                                }}
                            />
                        </WrapItem>
                    );
                })}
        </Wrap>
    );

    const clearFiltersContent = (search !== "" ||
        selectedAuthors.length > 0 ||
        selectedSpiritAuthors.length > 0 ||
        selectedTags.length > 0 ||
        selectedPublishers.length > 0) && <GhostButton onClick={clearFilters}>{t("removeFilters")}</GhostButton>;

    // componentizar esse pedaço de layout
    const filtersContent = (
        <Skeleton loading={isBooksLoadingFirstTime}>
            <VStack align="start" w="100%">
                <HStack w="100%">
                    <Heading fontSize={"xl"}>{t("filter")}</Heading>
                    <Spacer />
                    {clearFiltersContent}
                </HStack>

                {activeFiltersBadges}

                {isMobile && <SortSelect label={t("sortBy")} labelPosition="top" value={sort} onChange={setSort} />}

                <SimpleCheckBoxGroup
                    maxElementsBeforeCollapse={CATEGORY_FILTERS_MAX_ELEMENTS_BEFORE_COLLAPSE}
                    label={t("category")}
                    hide={isCategoriesLoadFailed}
                    options={filterCategories.elements.map((a) => ({
                        label: `${a.name} (${a._count?.books || "0"})`,
                        value: `${a.id}`
                    }))}
                    values={selectedCategories}
                    setValues={setSelectedCategories}
                />

                <SimpleCheckBoxGroup
                    label={t("tag")}
                    hide={isTagsLoadFailed}
                    options={filterTags.elements.map((a) => ({
                        label: `${a.name} (${a._count?.books || "0"})`,
                        value: `${a.id}`
                    }))}
                    values={selectedTags}
                    setValues={setSelectedTags}
                />

                <SimpleCheckBoxGroup
                    label={t("author")}
                    isLoading={isAuthorsLoading}
                    hide={isAuthorsLoadFailed}
                    options={filterAuthors.elements
                        .filter((a) => !a.is_spirit)
                        .map((a) => ({
                            label: `${a.name} (${a._count?.books || "0"})`,
                            value: `${a.id}`
                        }))}
                    values={selectedAuthors}
                    setValues={setSelectedAuthors}
                />

                <SimpleCheckBoxGroup
                    label={t("spiritAuthor")}
                    hide={isAuthorsLoadFailed}
                    options={filterAuthors.elements
                        .filter((a) => a.is_spirit)
                        .map((a) => ({
                            label: `${a.name} (${a._count?.books || "0"})`,
                            value: `${a.id}`
                        }))}
                    values={selectedSpiritAuthors}
                    setValues={setSelectedSpiritAuthors}
                />

                <SimpleCheckBoxGroup
                    label={t("publisher")}
                    hide={isPublishersLoadFailed}
                    options={filterPublishers.elements.map((a) => ({
                        label: `${a.name} (${a._count.books})`,
                        value: `${a.name}`
                    }))}
                    values={selectedPublishers}
                    setValues={setSelectedPublishers}
                />
            </VStack>
        </Skeleton>
    );

    return (
        <>
            <Body>
                <VStack pb={"24px"}>
                    <PageHeading header={t("title")} description={t("description")} />
                    {/* <PageHeading header={t("title")} description={t("description")} /> */}
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
                                {books.elements.length > 0 &&
                                    t("showingXFromYBooks", {
                                        count: books.elements.length,
                                        total: books.pagination.total_elements
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
                        <Box w="360px" py={1} pr="6" position="sticky" top="0" maxH="100vh" overflowY="auto">
                            {filtersContent}
                        </Box>
                    )}

                    <Box flex="1">
                        {!isMobile && (
                            <Flex
                                direction={{ base: "column", md: "row" }}
                                justify="space-between"
                                align={{ base: "center", md: "center" }}
                                gap="6"
                            >
                                <Skeleton loading={isBooksLoading}>
                                    <Text>
                                        {books.elements.length > 0 &&
                                            t("showingXFromYBooks", {
                                                total: books.pagination.total_elements
                                            })}
                                    </Text>
                                </Skeleton>
                                <Spacer flex={1} />

                                <Skeleton loading={isBooksLoadingFirstTime}>
                                    {/* Todo: Eu não gosto de colocar tamanho fixo em nada, mas por hora vai ficar assim mesmo */}
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

                        {books.elements.length == 0 && !isBooksLoading && !isBooksLoadingFirstTime ? (
                            <VStack align={"center"}>
                                <HStack align={"center"} pt="50px">
                                    <VStack align={"center"}>
                                        <Image w="300px" src={LoadingIcons.empty.src} alt={t("somethingIsWrong")} />
                                        <Heading textAlign={"center"}>{t("booksNotFound")}</Heading>
                                        <SimpleButton
                                            // ToDO: Remover isso daqui. Não deve ser responsabilidade do componente recarregar a página.
                                            /// Essa é apenas uma solução temporária e preguiçosa
                                            onClick={clearFilters}
                                        >
                                            {t("removeFilters")}
                                        </SimpleButton>
                                    </VStack>
                                </HStack>
                            </VStack>
                        ) : (
                            <BookGrid
                                variant="grid"
                                loadingFailed={isBooksLoadFailed}
                                isEmpty={books.elements.length == 0}
                                eWidth={"180px"}
                                pt={"12px"}
                            >
                                {books.elements.map((obj: Book) => {
                                    return (
                                        <Skeleton
                                            key={`bookCard#${obj.id}`}
                                            loading={isBooksLoadingFirstTime || isBooksLoadingFirstFilter}
                                        >
                                            <BookGridCard book={obj} />
                                        </Skeleton>
                                    );
                                })}
                            </BookGrid>
                        )}

                        <Box ref={loadMoreBooksRef} h="40px" />
                    </Box>
                </HStack>
            </Body>
        </>
    );
}
