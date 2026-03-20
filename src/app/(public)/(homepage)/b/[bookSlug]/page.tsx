"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBook, listRelatedBooks } from "endpoints";
import { Book, APIPaginatedResponse } from "types";
import { parseDateFullText } from "utils";
import { useTranslations } from "next-intl";
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
    LuStar,
    LuPenTool,
    LuTag,
    LuBuilding2,
    LuCalendar,
    LuBook,
    LuBookOpen,
    LuLibraryBig,
    LuBarcode,
    LuBadgeInfo,
    LuShare,
    LuText,
    LuGlasses,
    LuCheck,
    LuArrowLeft
} from "react-icons/lu";
import { randomInt } from "crypto";

const NUMBER_OF_RELATED_BOOKS_TO_SHOW = 6;
const TIMEOUT_OF_SHARE_BUTTON_ICON_CHANGE_IN_MS = 3000;
const DEFAULT_EXAMPLE_BOOK_FOR_SKELETON = {
    id: 1,
    slug: "slug",
    title: "title",
    subtitle: "subtitle",
    publisher: "publisher",
    year: 1857,
    edition: "1",
    isbn: "isbn",
    pages: 1,
    summary: "",
    pdf_url: "",
    cover_url: "",
    images_url: [""],
    label: "label",
    shelf: "shelf",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável.",
    loans: [],
    keywords: ["a", "b", "c"],
    tags: [{ tag: { id: 1, slug: "slug1", name: "tag" } }],
    authors: [{ author: { id: 1, slug: "slug1", name: "author", is_spirit: false } }]
};

export default function BookDetails() {
    const t = useTranslations("BookDetails");
    const { bookSlug } = useParams();
    const router = useRouter();

    const [copied, setCopied] = useState(false);

    const [isBookLoading, setIsBookLoading] = useState(true);
    const [isBookLoadFailed, setIsBookLoadFailed] = useState(false);
    const [book, setBook] = useState<Book>(DEFAULT_EXAMPLE_BOOK_FOR_SKELETON);

    const [isBooksLoading, setIsBooksLoading] = useState(true);
    const [isBooksLoadFailed, setIsBooksLoadFailed] = useState(false);
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
        setIsBooksLoading(true);
        setIsBooksLoadFailed(false);

        try {
            const pagination = {
                limit: NUMBER_OF_RELATED_BOOKS_TO_SHOW,
                page: 1,
                orderBy: {
                    id: "desc"
                }
            };

            const response = await listRelatedBooks(bookId, pagination);
            setBooks(response);
        } catch (err) {
            console.log(err);
            setIsBooksLoadFailed(true);
        } finally {
            setIsBooksLoading(false);
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
                }, TIMEOUT_OF_SHARE_BUTTON_ICON_CHANGE_IN_MS);
            }
        } catch {}
    };

    const goToCollection = () => {
        router.push("/");
    };

    useEffect(() => {
        if (bookSlug) loadBook();
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
            <GhostButton onClick={goToCollection} py={"48px"}>
                <HStack>
                    <LuArrowLeft />
                    <Text>{t("backToCollection")}</Text>
                </HStack>
            </GhostButton>

            <Stack direction={{ base: "column", md: "row" }} gap="6" align="start">
                <Flex justify="center" w={{ base: "100%", md: "350px" }} bg="none" overflow="hidden">
                    <Skeleton
                        loading={isBookLoading}
                        shadow="xl"
                        w={{ base: "90%", md: "350px" }}
                        borderRadius="md"
                        flexShrink={0}
                        overflow="hidden"
                    >
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
                                            {bookAuthor.author.is_spirit ? (
                                                <LuStar size="16" />
                                            ) : (
                                                <LuPenTool size="16" />
                                            )}
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
                                        <LuBadgeInfo size="16" />
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
                                    <LuCalendar size="16" />
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
                                            <LuTag size="16" style={{ marginRight: "6px" }} />
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
                        <Box>
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuGlasses size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("description")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                <Text as="span" color="fg.muted" textAlign={"justify"}>
                                    {book?.description}
                                </Text>
                            </Box>
                        </Box>
                    )}

                    {/* ToDo: Transformar esse trecho em componente pois eu ja estou repetindo ele */}
                    {book?.keywords.length > 0 && (
                        <Box>
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuText size="16" style={{ marginRight: "6px" }} />
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
                        </Box>
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

            <Spacer pt={"24px"} />

            <Skeleton loading={isBooksLoading}>
                <SectionHeading header={t("seeAlso")} />
            </Skeleton>

            <BookGrid loadingFailed={isBooksLoadFailed} eWidth={"180px"} pt={"12px"}>
                {books.elements.map((obj: Book) => {
                    return (
                        <Skeleton key={`bookCard#${obj.id}`} loading={isBooksLoading}>
                            <BookGridCard book={obj} />
                        </Skeleton>
                    );
                })}
            </BookGrid>

            <Spacer pt={"24px"} />

            <Skeleton loading={isBooksLoading}>
                <VStack flex={1} align={{ base: "center", md: "start" }}>
                    <SectionHeading header={t("didntFindWhatYouWereLookingFor")} description={t("weAreWorkingOnIt")} />
                </VStack>
            </Skeleton>

            <Skeleton loading={isBookLoading}>
                <VStack flex={1} align={{ base: "center", md: "start" }}>
                    <SimpleButton onClick={goToCollection} mt={"24px"}>
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
