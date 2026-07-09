"use client";

import { useState, useRef, useEffect } from "react";
import {
    Stack,
    Text,
    IconButton,
    Input,
    Box,
    HStack,
    DialogRoot,
    DialogTrigger,
    DialogContent,
    DialogBackdrop,
    Group,
    Skeleton,
    Heading
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SimpleButton, BookGridCard } from "components";
import { listCategoriesToExplore, listAuthorsToExplore, listTagsToExplore, listBooks, listAuthors } from "endpoints";
import { APIPaginatedResponse, Category, Author, Tag, Book } from "types";
import {
    TOP_BAR_DEFAULT_ICON_SIZE,
    QUERY_PARAMS_FOR_SEARCH,
    PAGINATION_DEFAULT_CATEGORIES_TO_EXPLORE,
    PAGINATION_DEFAULT_TAGS_TO_EXPLORE,
    PAGINATION_DEFAULT_AUTHORS_TO_EXPLORE,
    PAGINATION_DEFAULT_BOOKS_TO_EXPLORE,
    DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON,
    DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON,
    DEFAULT_EXAMPLE_BOOK_FOR_SKELETON
} from "utils";
import { AuthorGridCard, BookGrid } from "components";
import { useDebounce } from "hooks";

const SearchInput = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const t = useTranslations("Collection");

    const abortControllerRef = useRef<AbortController | null>(null);
    const abortControllerAuthorRef = useRef<AbortController | null>(null);

    const [isFirstCategoriesDownload, setIsFirstCategoriesDownload] = useState(true);
    const [isMainCategoriesLoading, setIsMainCategoriesLoading] = useState(false);
    const [isMainCategoriesLoadFailed, setIsMainCategoriesLoadFailed] = useState(false);
    const [filterCategories, setFilterCategories] = useState<APIPaginatedResponse<Category>>({
        elements: [
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome Bem Longo demais" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome mais ou menos" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome Bem Longo demais" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome mais ou menos" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome Bem Longo demais" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome mais ou menos" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" },
            { ...DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON, id: Math.random(), name: "Nome curto" }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [isFirstAuthorDownload, setIsFirstAuthorDownload] = useState(true);
    const [isMainAuthorsLoading, setIsMainAuthorsLoading] = useState(false);
    const [isMainAuthorsLoadFailed, setIsMainAuthorsLoadFailed] = useState(false);
    const [filterAuthors, setFilterAuthors] = useState<APIPaginatedResponse<Author>>({
        elements: [
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random(), is_spirit: Math.random() % 2 === 0 }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [isFirstBookDownload, setIsFirstBookDownload] = useState(true);
    const [isMainBooksLoading, setIsMainBooksLoading] = useState(false);
    const [isMainBooksLoadFailed, setIsMainBooksLoadFailed] = useState(false);
    const [books, setBooks] = useState<APIPaginatedResponse<Book>>({
        elements: [
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [isFirstSearchedAuthorDownload, setIsFirstSearchedAuthorDownload] = useState(true);
    const [isMainSearchedAuthorsLoading, setIsMainSearchedAuthorsLoading] = useState(false);
    const [isMainSearchedAuthorsLoadFailed, setIsMainSearchedAuthorsLoadFailed] = useState(false);
    const [authors, setAuthors] = useState<APIPaginatedResponse<Author>>({
        elements: [
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [isFirstTagsDownload, setIsFirstTagsDownload] = useState(true);
    const [isMainTagsLoading, setIsMainTagsLoading] = useState(false);
    const [isMainTagsLoadFailed, setIsMainTagsLoadFailed] = useState(false);
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

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (query.trim()) {
            router.push(`/?${QUERY_PARAMS_FOR_SEARCH}=${encodeURIComponent(query)}`);
            setOpen(false);
            setQuery("");
        }
    };

    const loadCategories = async () => {
        setIsMainCategoriesLoading(true);
        setIsMainCategoriesLoadFailed(false);

        try {
            // const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_DEFAULT_CATEGORIES_TO_EXPLORE,
                page: 1
            };

            const objs = await listCategoriesToExplore({}, pagination);
            setFilterCategories(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsMainCategoriesLoadFailed(true);
        } finally {
            setIsMainCategoriesLoading(false);
        }
    };

    const loadTags = async () => {
        setIsMainTagsLoading(true);
        setIsMainTagsLoadFailed(false);

        try {
            // const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_DEFAULT_TAGS_TO_EXPLORE,
                page: 1
            };

            const objs = await listTagsToExplore({}, pagination);
            setFilterTags(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsMainTagsLoadFailed(true);
        } finally {
            setIsMainTagsLoading(false);
        }
    };

    const loadAuthors = async () => {
        setIsMainAuthorsLoading(true);
        setIsMainAuthorsLoadFailed(false);

        try {
            // const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_DEFAULT_AUTHORS_TO_EXPLORE,
                page: 1
            };

            const objs = await listAuthorsToExplore({}, pagination);
            setFilterAuthors(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsMainAuthorsLoadFailed(true);
        } finally {
            setIsMainAuthorsLoading(false);
        }
    };

    const searchBooks = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsMainBooksLoading(true);
        setIsMainBooksLoadFailed(false);

        try {
            // const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_DEFAULT_BOOKS_TO_EXPLORE,
                page: 1
            };

            const objs = await listBooks(
                {
                    search: query
                },
                pagination,
                { signal: controller.signal }
            );
            setBooks(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsMainBooksLoadFailed(true);
        } finally {
            setIsMainBooksLoading(false);
        }
    };

    const searchAuthors = async () => {
        if (abortControllerAuthorRef.current) {
            abortControllerAuthorRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerAuthorRef.current = controller;

        setIsMainSearchedAuthorsLoading(true);
        setIsMainSearchedAuthorsLoadFailed(false);

        try {
            // const filter = getCombinedFilters();

            const pagination = {
                limit: PAGINATION_DEFAULT_BOOKS_TO_EXPLORE,
                page: 1
            };

            const objs = await listAuthors(
                {
                    search: query,
                    trim: true
                },
                pagination,
                { signal: controller.signal }
            );
            setAuthors(objs || { elements: [], totalElements: 0 });
        } catch {
            setIsMainSearchedAuthorsLoadFailed(true);
        } finally {
            setIsMainSearchedAuthorsLoading(false);
        }
    };

    useEffect(() => {
        // Se a query estiver vazia, não faz nada
        if (debouncedQuery.trim() === "") {
            setIsFirstBookDownload(true);
            setIsFirstSearchedAuthorDownload(true);
            setBooks({
                elements: [
                    { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() }
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    total_elements: 0,
                    total_pages: 0,
                    has_next: false,
                    has_previous: false
                }
            });
            setAuthors({
                elements: [
                    { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                    { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() }
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    total_elements: 0,
                    total_pages: 0,
                    has_next: false,
                    has_previous: false
                }
            });
            return;
        }

        
        setBooks({
            elements: [
                { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_BOOK_FOR_SKELETON, id: Math.random() }
            ],
            pagination: {
                page: 1,
                limit: 10,
                total_elements: 0,
                total_pages: 0,
                has_next: false,
                has_previous: false
            }
        });
    
        setAuthors({
            elements: [
                { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() },
                { ...DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON, id: Math.random() }
            ],
            pagination: {
                page: 1,
                limit: 10,
                total_elements: 0,
                total_pages: 0,
                has_next: false,
                has_previous: false
            }
        });
        

        // Se tem texto, chama loadBooks
        searchBooks();
        searchAuthors();

        setIsFirstBookDownload(false);
        setIsFirstSearchedAuthorDownload(false);
    }, [debouncedQuery]);

    const loadAll = async () => {
        if ((isFirstCategoriesDownload || isMainCategoriesLoadFailed) && !isMainCategoriesLoading) {
            loadCategories();
            setIsFirstCategoriesDownload(false);
        }

        if ((isFirstAuthorDownload || isMainAuthorsLoadFailed) && !isMainAuthorsLoading) {
            loadAuthors();
            setIsFirstAuthorDownload(false);
        }

        if ((isFirstTagsDownload || isMainTagsLoadFailed) && !isMainTagsLoading) {
            loadTags();
            setIsFirstTagsDownload(false);
        }
    };

    return (
        <DialogRoot
            lazyMount
            open={open}
            onOpenChange={(e) => {
                setOpen(e.open);
                loadAll();
            }}
            size="xl"
        >
            <DialogTrigger asChild>
                <IconButton
                    aria-label={t("filterSearchLabel")}
                    variant="ghost"
                    size="sm"
                    css={{
                        _icon: { width: "5", height: "5" }
                    }}
                >
                    <LuSearch />
                </IconButton>
            </DialogTrigger>

            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top="10%"
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "90vw", md: "1500px" }}
                margin="0"
            >
                {/* <DialogBody py={4} px={4} maxHeight="80vh" overflowY="auto"> */}
                <Box pt={4} px={4}>
                    <form onSubmit={handleSearch}>
                        <Group w="full" attached>
                            <Box display="flex" alignItems="center" pr="4">
                                <LuSearch color="gray.emphasized" size={TOP_BAR_DEFAULT_ICON_SIZE} />
                            </Box>

                            <Input
                                type="text"
                                value={query}
                                placeholder={t("filterSearchPlaceholder")}
                                onChange={(e) => setQuery(e.target.value)}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                colorPalette="primary"
                                _focus={{ borderColor: "fealRed" }}
                                _hover={{ borderColor: "fealRed" }}
                                autoFocus
                                // disabled={isMainBooksLoading}
                            />

                            <HStack gap="2" display={{ base: "none", md: "flex" }} pl="4">
                                <SimpleButton onClick={() => handleSearch()}>{t("filterSearchLabel")}</SimpleButton>
                            </HStack>
                        </Group>
                    </form>
                </Box>

                <Box py={4} px={4} maxHeight="80vh" overflowY="auto">
                    {query.length === 0 && (
                        <>
                            {/* Categorias */}
                            {!isMainCategoriesLoadFailed && (
                                <Stack gap="2">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.400"
                                        letterSpacing="wider"
                                        pt="4"
                                        pb="2"
                                    >
                                        {t("filterSearchExploreCategories").toUpperCase()}
                                    </Text>

                                    <HStack gap="2" wrap="wrap">
                                        {filterCategories.elements.map((category: Category) => (
                                            <Skeleton
                                                key={`categoryCard#${category.id}`}
                                                loading={isMainCategoriesLoading || isFirstCategoriesDownload}
                                            >
                                                <Box
                                                    key={category.id}
                                                    as="button"
                                                    px="4"
                                                    py="1.5"
                                                    bg={{ base: "gray.50", _dark: "gray.700" }}
                                                    borderRadius="sm"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    transition="all 0.2s"
                                                    _hover={{
                                                        bg: "fealRed",
                                                        color: "white",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => {
                                                        router.push(`/?c=${category.slug}`);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {category.name.split(".").at(-1)?.trim()}
                                                </Box>
                                            </Skeleton>
                                        ))}
                                    </HStack>
                                </Stack>
                            )}

                            {/* Autores */}
                            {!isMainAuthorsLoadFailed && (
                                <Stack gap="2" pt="4">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.400"
                                        letterSpacing="wider"
                                        pt="4"
                                        pb="2"
                                    >
                                        {t("filterSearchExploreAuthors").toUpperCase()}
                                    </Text>

                                    {/* ToDo: Create a Generic Grid, maybe? */}
                                    <BookGrid
                                        variant="grid"
                                        loadingFailed={isMainAuthorsLoadFailed}
                                        // isLoadingMore={isMainAuthorsLoading}
                                        isEmpty={filterAuthors.elements.length == 0}
                                        eWidth={"120px"}
                                    >
                                        {filterAuthors.elements.map((author: Author) => (
                                            <Skeleton
                                                key={`authorCard#${author.id}`}
                                                loading={isMainAuthorsLoading || isFirstAuthorDownload}
                                            >
                                                <AuthorGridCard
                                                    author={author}
                                                    onClick={() => {
                                                        router.push(`/?a=${author.slug}`);
                                                        setOpen(false);
                                                    }}
                                                />
                                            </Skeleton>
                                        ))}
                                    </BookGrid>
                                </Stack>
                            )}

                            {/* Tags */}
                            {!isMainTagsLoadFailed && (
                                <Stack gap="2">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.400"
                                        letterSpacing="wider"
                                        pt="4"
                                        pb="2"
                                    >
                                        {t("filterSearchExploreTags").toUpperCase()}
                                    </Text>

                                    <HStack gap="2" wrap="wrap">
                                        {filterTags.elements.map((tag: Tag) => (
                                            <Skeleton
                                                key={`tagCard#${tag.id}`}
                                                loading={isMainTagsLoading || isFirstTagsDownload}
                                            >
                                                <Box
                                                    key={tag.id}
                                                    as="button"
                                                    px="4"
                                                    py="1.5"
                                                    bg={{ base: "gray.50", _dark: "gray.700" }}
                                                    borderRadius="sm"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    transition="all 0.2s"
                                                    _hover={{ bg: "fealRed", color: "white", cursor: "pointer" }}
                                                    onClick={() => {
                                                        router.push(`/?t=${tag.slug}`);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {tag.name?.trim()}
                                                </Box>
                                            </Skeleton>
                                        ))}
                                    </HStack>
                                </Stack>
                            )}
                        </>
                    )}

                    {query.length > 0 && (
                        <>
                            <Stack gap="2">
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color="gray.400"
                                    letterSpacing="wider"
                                    pt="4"
                                    pb="2"
                                >
                                    {t("filterSearchFastSearch").toUpperCase()}
                                </Text>

                                {/* Books */}
                                <Skeleton loading={isMainBooksLoading || isFirstBookDownload}>
                                    <Text>
                                        {t("filterSearchFastSearchedBookResult", {
                                            total: books.pagination.total_elements
                                        })}
                                    </Text>
                                </Skeleton>

                                {(books.elements.length == 0 || isMainBooksLoadFailed) && !isMainBooksLoading ? (
                                    // <VStack align={"center"}>
                                    //     <HStack align={"center"} py="20px">
                                    //         <VStack align={"center"}>
                                    //             <Image
                                    //                 w="300px"
                                    //                 src={LoadingIcons.empty.src}
                                    //                 alt={t("somethingIsWrong")}
                                    //             />
                                    //             <Heading textAlign={"center"}>{t("booksNotFound")}</Heading>
                                    //             <SimpleButton
                                    //                 // ToDO: Remover isso daqui. Não deve ser responsabilidade do componente recarregar a página.
                                    //                 /// Essa é apenas uma solução temporária e preguiçosa
                                    //                 onClick={() => {
                                    //                     setQuery("");
                                    //                 }}
                                    //             >
                                    //                 {t("removeFilters")}
                                    //             </SimpleButton>
                                    //         </VStack>
                                    //     </HStack>
                                    // </VStack>

                                    <Heading textAlign={"center"}>{t("booksNotFound")}</Heading>
                                ) : (
                                    <BookGrid
                                        variant="grid"
                                        loadingFailed={false}
                                        // isLoadingMore={isMainAuthorsLoading}
                                        // isEmpty={filterAuthors.elements.length == 0}
                                        eWidth={"120px"}
                                    >
                                        {books.elements.map((book: Book) => (
                                            <Skeleton
                                                key={`bookCard#${book.id}`}
                                                loading={isMainBooksLoading || isFirstBookDownload}
                                            >
                                                <BookGridCard
                                                    book={book}
                                                    isSeeMore={
                                                        books.pagination.total_elements > 6 &&
                                                        books.elements[5].id == book.id
                                                    }
                                                    isSeeMorePlaceHolder={t("filterSearchFastSearchSeeAll")}
                                                    onClick={() => {
                                                        if (
                                                            books.pagination.total_elements > 6 &&
                                                            books.elements[5].id == book.id
                                                        ) {
                                                            handleSearch();
                                                        } else {
                                                            router.push(`/b/${book.slug}`);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                />
                                            </Skeleton>
                                        ))}
                                    </BookGrid>
                                )}

                                {/* Authors */}

                                <Skeleton loading={isMainSearchedAuthorsLoading || isFirstSearchedAuthorDownload}>
                                    <Text>
                                        {t("filterSearchFastSearchedAuthorResult", {
                                            total: authors.pagination.total_elements
                                        })}
                                    </Text>
                                </Skeleton>

                                {(books.elements.length == 0 || isMainSearchedAuthorsLoadFailed) &&
                                !isMainSearchedAuthorsLoading ? (
                                    // <VStack align={"center"}>
                                    //     <HStack align={"center"} py="20px">
                                    //         <VStack align={"center"}>
                                    //             <Image
                                    //                 w="300px"
                                    //                 src={LoadingIcons.empty.src}
                                    //                 alt={t("somethingIsWrong")}
                                    //             />
                                    //             <Heading textAlign={"center"}>{t("booksNotFound")}</Heading>
                                    //             <SimpleButton
                                    //                 // ToDO: Remover isso daqui. Não deve ser responsabilidade do componente recarregar a página.
                                    //                 /// Essa é apenas uma solução temporária e preguiçosa
                                    //                 onClick={() => {
                                    //                     setQuery("");
                                    //                 }}
                                    //             >
                                    //                 {t("removeFilters")}
                                    //             </SimpleButton>
                                    //         </VStack>
                                    //     </HStack>
                                    // </VStack>

                                    <Heading textAlign={"center"}>{t("authorsNotFound")}</Heading>
                                ) : (
                                    <BookGrid
                                        variant="grid"
                                        loadingFailed={false}
                                        // isLoadingMore={isMainAuthorsLoading}
                                        // isEmpty={filterAuthors.elements.length == 0}
                                        eWidth={"120px"}
                                    >
                                        {authors.elements.map((author: Author) => (
                                            <Skeleton
                                                key={`searchAuthorCard#${author.id}`}
                                                loading={isMainSearchedAuthorsLoading || isFirstSearchedAuthorDownload}
                                            >
                                                <AuthorGridCard
                                                    author={author}
                                                    isSeeMore={
                                                        authors.pagination.total_elements > 6 &&
                                                        authors.elements[5].id == author.id
                                                    }
                                                    isSeeMorePlaceHolder={t("filterSearchFastSearchSeeAll")}
                                                    onClick={() => {
                                                        if (
                                                            authors.pagination.total_elements > 6 &&
                                                            authors.elements[5].id == author.id
                                                        ) {
                                                            handleSearch();
                                                        } else {
                                                            router.push(`/a/${author.slug}`);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                />
                                            </Skeleton>
                                        ))}
                                    </BookGrid>
                                )}
                            </Stack>
                        </>
                    )}
                </Box>
                {/* </DialogBody> */}
            </DialogContent>
        </DialogRoot>
    );
};

export default SearchInput;
// // Apenas salvanod pra olhar depois
//  {query.length === 0 && (
//                     <Stack gap="3" mt="4" px="4" pb="4">
//                         <Text fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="wider">
//                             EXPLORAR CATEGORIAS
//                         </Text>
//                         <HStack gap="2" wrap="wrap">
//                             {["Ficção", "Tecnologia", "Design", "História"].map((tag) => (
//                                 <Box
//                                     key={tag}
//                                     as="button"
//                                     px="4"
//                                     py="1.5"
//                                     bg="gray.50"
//                                     borderRadius="full"
//                                     fontSize="sm"
//                                     fontWeight="medium"
//                                     transition="all 0.2s"
//                                     _hover={{ bg: "blue.600", color: "white" }}
//                                     onClick={() => {
//                                         router.push(`/search?q=${tag}`);
//                                         setOpen(false);
//                                     }}
//                                 >
//                                     {tag}
//                                 </Box>
//                             ))}
//                         </HStack>
//                     </Stack>
//                 )}
