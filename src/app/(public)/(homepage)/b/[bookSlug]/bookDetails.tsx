"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBook, listRelatedBooks } from "endpoints";
import { Book, APIPaginatedResponse } from "types";
import { useTranslations } from "next-intl";
import {
    DEFAULT_EXAMPLE_BOOK_FOR_SKELETON,
    SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS,
    PAGINATION_DEFAULT_RELATED_BOOKS_PER_PAGE
} from "utils";

import {
    Body,
    PageHeading,
    GhostButton,
    BookImageCard,
    LoanBadge,
    SimpleButton,
    SectionHeading,
    BookGridCard,
    BookGrid
} from "components";

import { Flex, Box, HStack, VStack, Text, Skeleton, Stack, SimpleGrid, Spacer } from "@chakra-ui/react";

import {
    LuListTodo,
    LuPen,
    LuStar,
    LuTextSearch,
    LuBuilding2,
    LuCalendar,
    LuBook,
    LuBookOpen,
    LuLibraryBig,
    LuBarcode,
    LuBookCopy,
    LuShare,
    LuText,
    LuCheck,
    LuArrowLeft,
    LuBookCheck,
    LuBookX
} from "react-icons/lu";

export default function BookDetails() {
    const t = useTranslations("BookDetails");
    const { bookSlug } = useParams();
    const router = useRouter();

    const [copied, setCopied] = useState(false);

    const [isBookLoading, setIsBookLoading] = useState(true);
    const [isBookLoadFailed, setIsBookLoadFailed] = useState(false);
    const [book, setBook] = useState<Book>(DEFAULT_EXAMPLE_BOOK_FOR_SKELETON);

    const [isSeeAlsoBooksLoading, setIsSeeAlsoBooksLoading] = useState(true);
    const [isSeeAlsoBooksLoadFailed, setIsSeeAlsoBooksLoadFailed] = useState(false);
    const [seeAlsoBooks, setSeeAlsoBooks] = useState<APIPaginatedResponse<Book>>({
        elements: [
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
            limit: 10,
            total_elements: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const loadBook = async () => {
        setIsBookLoading(true);
        setIsBookLoadFailed(false);

        try {
            const response = await getBook(bookSlug as string);
            setBook(response);
            loadRelatedBooks(response.id);
        } catch {
            setIsBookLoadFailed(true);
        } finally {
            setIsBookLoading(false);
        }
    };

    const loadRelatedBooks = async (bookId: number) => {
        setIsSeeAlsoBooksLoading(true);
        setIsSeeAlsoBooksLoadFailed(false);

        try {
            const pagination = {
                limit: PAGINATION_DEFAULT_RELATED_BOOKS_PER_PAGE,
                page: 1,
                orderBy: {
                    id: "desc"
                }
            };

            const response = await listRelatedBooks(bookId, pagination);
            setSeeAlsoBooks(response);
        } catch (err) {
            console.log(err);
            setIsSeeAlsoBooksLoadFailed(true);
        } finally {
            setIsSeeAlsoBooksLoading(false);
        }
    };

    // ToDo: Transformar em componente isso aqui
    const shareBookUrl = async () => {
        const dataToShare = {
            title: `${book.title}`,
            text: `${book.subtitle || ""}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(dataToShare);
            } else {
                navigator.clipboard.writeText(
                    `${book.title}\n${book.subtitle || book.description}\n\nAcesse: ${window.location.href}`
                );
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS);
            }
        } catch {}
    };

    const goToCollection = () => {
        router.push("/");
    };

    useEffect(() => {
        if (bookSlug) loadBook();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookSlug]);

    if (isBookLoadFailed) {
        return (
            <Body>
                <VStack py="20">
                    <Text>{t("errorLoading")}</Text>
                    <GhostButton onClick={() => router.back()}>{t("goBack")}</GhostButton>
                </VStack>
            </Body>
        );
    }

    return (
        <Body>
            <GhostButton onClick={goToCollection} pb={"24px"}>
                <HStack>
                    <LuArrowLeft />
                    <Text>{t("backToCollection")}</Text>
                </HStack>
            </GhostButton>

            <Stack direction={{ base: "column", md: "row" }} gap="6" align="start">
                <Flex justify="center" w={{ base: "100%", md: "350px" }} bg="none" overflow="hidden">
                    <Skeleton loading={isBookLoading} w={"100%"}>
                        <BookImageCard book={book} />
                    </Skeleton>
                </Flex>

                <VStack align="start" flex="1" gap="6">
                    <Box w="100%">
                        <Skeleton loading={isBookLoading}>
                            <PageHeading header={book?.title} description={book?.subtitle || ""} />
                        </Skeleton>
                    </Box>

                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap="6" w="100%">
                        <Skeleton loading={isBookLoading} w={"100%"}>
                            <VStack align="start" gap="1">
                                {/* ToDO: Tornar cada autor clicável e encaminhar para uma página com livros desse autor */}
                                {book?.authors.map((bookAuthor) => {
                                    return (
                                        <HStack key={`author#${bookAuthor.author.id}`}>
                                            {bookAuthor.author.is_spirit ? <LuStar size="16" /> : <LuPen size="16" />}
                                            <Text fontWeight={"bold"}>{bookAuthor.description || t("author")}: </Text>
                                            <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                                {bookAuthor.author.name}{" "}
                                            </Text>
                                        </HStack>
                                    );
                                })}

                                {/* ToDO: Tornar a editora clicável e encaminhar para uma página com livros dessa editora */}
                                {book?.publisher && (
                                    <HStack>
                                        <LuBuilding2 size="16" />
                                        <Text fontWeight={"bold"}>{t("publisher")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {book?.publisher}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {book?.edition && (
                                    <HStack>
                                        <LuBookCopy size="16" />
                                        <Text fontWeight={"bold"}>{t("edition")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {`${book?.edition}ª`}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {book?.year && (
                                    <HStack>
                                        <LuCalendar size="16" />
                                        <Text fontWeight={"bold"}>{t("publishedAt")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {book?.year}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {book?.pages && (
                                    <HStack>
                                        <LuBookOpen size="16" />
                                        <Text fontWeight={"bold"}>{t("pages")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {`${book?.pages}`}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {book?.isbn && (
                                    <HStack>
                                        <LuBook size="16" />
                                        <Text fontWeight={"bold"}>{t("isbn")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {`${book?.isbn}`}{" "}
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Skeleton>

                        <Skeleton loading={isBookLoading} w={"100%"}>
                            <VStack align="start" gap="1">
                                <HStack>
                                    {book?.loans?.length > 0 ? <LuBookX size="16" /> : <LuBookCheck size="16" />}

                                    <Text fontWeight={"bold"}>{t("availability")}: </Text>
                                    <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                        <LoanBadge bookLoan={book?.loans?.[0]} />
                                    </Text>
                                </HStack>
                                {/* <Text
                                    fontStyle={"italic"}
                                    fontSize={"sm"}
                                    color={book?.loans?.length > 0 ? "fealRed" : "green"}
                                >
                                    {book?.loans?.length > 0
                                        ? t("loanedTooltip", {
                                              loan_date: parseDateFullText(new Date(book.loans[0]?.loan_date)),
                                              due_date: parseDateFullText(new Date(book.loans[0]?.due_date))
                                          })
                                        : t("availableTooltip")}
                                </Text> */}

                                {book?.shelf && (
                                    <HStack>
                                        <LuLibraryBig size="16" />
                                        <Text fontWeight={"bold"}>{t("shelf")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {book?.shelf}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {book?.label && (
                                    <HStack>
                                        <LuBarcode size="16" />
                                        <Text fontWeight={"bold"}>{t("label")}: </Text>
                                        <Text _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {book?.label}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {book?.tags.length > 0 && (
                                    <Box>
                                        <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                            <LuListTodo size="16" style={{ marginRight: "6px" }} />
                                            <Text as="span" fontWeight="bold">
                                                {t("tags")}:{" "}
                                            </Text>
                                        </Box>
                                        <Box as="span" lineHeight="tall">
                                            {book?.tags.map((tag, index) => (
                                                <Text
                                                    key={tag.tag.id}
                                                    as="span"
                                                    _hover={{ color: "fealRed" }}
                                                    cursor="pointer"
                                                    transition="color 0.2s"
                                                >
                                                    {tag.tag.name}
                                                    {index === book.tags.length - 1 ? "" : ", "}
                                                </Text>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </VStack>
                        </Skeleton>
                    </SimpleGrid>

                    {book?.description && (
                        <Skeleton loading={isBookLoading} w="100%">
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuText size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("description")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                <Text as="span" color="fg.muted" textAlign={"justify"}>
                                    {book?.description}
                                </Text>
                            </Box>
                        </Skeleton>
                    )}

                    {/* ToDo: Transformar esse trecho em componente pois eu ja estou repetindo ele */}
                    {book?.keywords.length > 0 && (
                        <Skeleton loading={isBookLoading} w="100%">
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuTextSearch size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("keywords")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                {book?.keywords.map((key, index) => (
                                    <Text
                                        key={key}
                                        as="span"
                                        _hover={{ color: "fealRed" }}
                                        cursor="pointer"
                                        transition="color 0.2s"
                                    >
                                        {key}
                                        {index === book.keywords.length - 1 ? "" : ", "}
                                    </Text>
                                ))}
                            </Box>
                        </Skeleton>
                    )}

                    <Skeleton loading={isBookLoading} w="100%">
                        <VStack flex={1} align={{ base: "center", md: "start" }}>
                            <SimpleButton onClick={shareBookUrl}>
                                <HStack>
                                    {copied ? <LuCheck /> : <LuShare />}
                                    <Text>{t("share")}</Text>
                                </HStack>
                            </SimpleButton>
                        </VStack>
                    </Skeleton>
                </VStack>
            </Stack>

            {/* ToDo: Quando o livro aberto nao estiver disponível seria interessante adicionar aqui uma seção com outros volumes do memso livro */}

            {seeAlsoBooks.elements.length > 0 ? (
                <>
                    <Spacer pt={"24px"} />

                    <Skeleton loading={isSeeAlsoBooksLoading}>
                        <SectionHeading header={t("seeAlso")} />
                    </Skeleton>

                    <Spacer pt={"24px"} />
                    <Box>
                        <BookGrid variant="scroll" loadingFailed={isSeeAlsoBooksLoadFailed} eWidth={"180px"}>
                            {seeAlsoBooks.elements.map((obj: Book) => {
                                return (
                                    <Skeleton key={`bookCard#${obj.id}`} loading={isSeeAlsoBooksLoading}>
                                        <BookGridCard book={obj} />
                                    </Skeleton>
                                );
                            })}
                        </BookGrid>
                    </Box>
                </>
            ) : (
                <></>
            )}

            <Spacer pt={"24px"} />

            <Skeleton loading={isBookLoading}>
                <VStack flex={1} align={{ base: "center", md: "start" }}>
                    <SectionHeading header={t("didntFindWhatYouWereLookingFor")} description={t("weAreWorkingOnIt")} />
                </VStack>
            </Skeleton>

            <Spacer pt={"24px"} />

            <Skeleton loading={isBookLoading}>
                <VStack flex={1} align={{ base: "center", md: "start" }}>
                    <SimpleButton onClick={goToCollection}>
                        <HStack>
                            <LuBook />
                            <Text>{t("backToCollection")}</Text>
                        </HStack>
                    </SimpleButton>
                </VStack>
            </Skeleton>

            <Spacer pt={"24px"} />

            {/* ToDo: Aqui seria legal também uma seção sobre doação de livros para a biblioteca */}
        </Body>
    );
}
