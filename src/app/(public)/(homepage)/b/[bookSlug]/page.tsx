"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBook } from "endpoints";
import { Book } from "types";
import { parseDateFullText } from "utils";
import { useTranslations } from "next-intl";
import { Body, PageHeading, GhostButton, BookImageCard, LoanBadge, SimpleButton } from "components";

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

const TIMEOUT_OF_SHARE_BUTTON_ICON_CHANGE_IN_MS = 3000;

export default function BookDetails() {
    const t = useTranslations("BookDetails");
    const { bookSlug } = useParams();
    const router = useRouter();

    const [copied, setCopied] = useState(false);

    const [isBookLoading, setIsBookLoading] = useState(true);
    const [isBookLoadFailed, setIsBookLoadFailed] = useState(false);
    const [book, setBook] = useState<Book>({
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
    });

    const loadBook = async () => {
        setIsBookLoading(true);
        setIsBookLoadFailed(false);

        try {
            const response = await getBook(bookSlug as string);
            setBook(response);
        } catch {
            setIsBookLoadFailed(true);
        } finally {
            setIsBookLoading(false);
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
            {/* Header / Navegação */}
            {/* <VStack align="start" pt="6" mb="8" gap="4">
                <GhostButton onClick={() => router.back()} leftIcon={<LuArrowLeft />}>
                    {t("backToCollection")}
                </GhostButton>
            </VStack> */}

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
                                <Text
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
                                </Text>

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
                                    <HStack align="start" gap="1">
                                        <HStack>
                                            <LuTag size="16" />
                                            <Text fontWeight={"bold"}>{t("tags")}: </Text>
                                        </HStack>
                                        {/* ToDO: Tornar cada tag clicável e encaminhar para uma página com livros dessa tag */}
                                        <HStack wrap="wrap" gap="2">
                                            {book?.tags.map((tag, index) => (
                                                <Text key={tag.tag.id} _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                                    {tag.tag.name}
                                                    {index == book.tags.length - 1 ? "" : ", "}
                                                </Text>
                                            ))}
                                        </HStack>
                                    </HStack>
                                )}
                            </VStack>
                        </Skeleton>
                    </SimpleGrid>
                    {book?.description && (
                        <Skeleton loading={isBookLoading}>
                            <VStack gap="0" align={"start"}>
                                <HStack>
                                    <LuGlasses size="16" />
                                    <Text fontWeight={"bold"}>{t("description")}: </Text>
                                </HStack>
                                <Text lineHeight="tall" color="fg.muted" textAlign={"justify"}>
                                    {book?.description}
                                </Text>
                            </VStack>
                        </Skeleton>
                    )}

                    {book?.keywords?.length > 0 && (
                        <Skeleton loading={isBookLoading} w={"100%"}>
                            <HStack align="start" gap="1">
                                <HStack>
                                    <LuText size="16" />
                                    <Text fontWeight={"bold"}>{t("keywords")}: </Text>
                                </HStack>
                                {/* ToDO: Tornar cada tag clicável e encaminhar para uma página com livros dessa tag */}
                                <HStack wrap="wrap" gap="2">
                                    {book?.keywords.map((keyword, index) => (
                                        <Text key={keyword} _hover={{ color: "fealRed" }} cursor={"pointer"}>
                                            {keyword}
                                            {index == book.keywords.length - 1 ? "" : ", "}
                                        </Text>
                                    ))}
                                </HStack>
                            </HStack>
                        </Skeleton>
                    )}

                    <Skeleton loading={isBookLoading}>
                        <SimpleButton onClick={shareBookUrl}>
                            <HStack>
                                {copied ? <LuCheck /> : <LuShare />}
                                <Text>{t("share")}</Text>
                            </HStack>
                        </SimpleButton>
                    </Skeleton>
                </VStack>
            </Stack>
        </Body>
    );
}
