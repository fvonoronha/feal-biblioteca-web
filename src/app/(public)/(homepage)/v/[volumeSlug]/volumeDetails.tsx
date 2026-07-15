"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVolume, listRelatedVolumes } from "endpoints";
import { Volume, Author, APIPaginatedResponse } from "types";
import { useTranslations } from "next-intl";
import {
    DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON,
    SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS,
    PAGINATION_DEFAULT_RELATED_VOLUMES_PER_PAGE,
    QUERY_PARAMS_FOR_AUTHOR,
    QUERY_PARAMS_FOR_SPIRIT_AUTHOR,
    QUERY_PARAMS_FOR_CATEGORY,
    QUERY_PARAMS_FOR_TAG,
    QUERY_PARAMS_FOR_SEARCH,
    QUERY_PARAMS_FOR_PUBLISHER
} from "utils";

import {
    Body,
    PageHeading,
    GhostButton,
    VolumeImageCard,
    SimpleButton,
    SectionHeading,
    VolumeGridCard,
    EntityGrid,
    AuthorSimpleCard
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
    LuBlocks,
    LuGlasses,
    LuBookOpenText
} from "react-icons/lu";

export default function VolumeDetails() {
    const t = useTranslations("VolumeDetails");
    const { volumeSlug } = useParams();
    const router = useRouter();

    const [copied, setCopied] = useState(false);

    const [isVolumeLoading, setIsVolumeLoading] = useState(true);
    const [isVolumeLoadFailed, setIsVolumeLoadFailed] = useState(false);
    const [volume, setVolume] = useState<Volume>(DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON);

    const [isSeeAlsoVolumesLoading, setIsSeeAlsoVolumesLoading] = useState(true);
    const [isSeeAlsoVolumesLoadFailed, setIsSeeAlsoVolumesLoadFailed] = useState(false);
    const [seeAlsoVolumes, setSeeAlsoVolumes] = useState<APIPaginatedResponse<Volume>>({
        elements: [
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() }
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

    const [isRelatedVolumesLoading, setIsRelatedVolumesLoading] = useState(true);
    const [isRelatedVolumesLoadFailed, setIsRelatedVolumesLoadFailed] = useState(false);
    const [relatedVolumes, setRelatedVolumes] = useState<APIPaginatedResponse<Volume>>({
        elements: [
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },

            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() },
            { ...DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON, id: Math.random() }
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

    const loadVolume = async () => {
        setIsVolumeLoading(true);
        setIsVolumeLoadFailed(false);

        try {
            const response = await getVolume(volumeSlug as string);
            setVolume(response);
            loadSeeAlsoVolumes(response.id);
            loadRelatedVolumes(response.id);
        } catch {
            setIsVolumeLoadFailed(true);
        } finally {
            setIsVolumeLoading(false);
        }
    };

    const loadSeeAlsoVolumes = async (volumeId: number) => {
        setIsSeeAlsoVolumesLoading(true);
        setIsSeeAlsoVolumesLoadFailed(false);

        try {
            const pagination = {
                limit: PAGINATION_DEFAULT_RELATED_VOLUMES_PER_PAGE,
                page: 90
            };

            const response = await listRelatedVolumes(volumeId, pagination);
            setSeeAlsoVolumes(response);
        } catch {
            setIsSeeAlsoVolumesLoadFailed(true);
        } finally {
            setIsSeeAlsoVolumesLoading(false);
        }
    };

    const loadRelatedVolumes = async (volumeId: number) => {
        setIsRelatedVolumesLoading(true);
        setIsRelatedVolumesLoadFailed(false);

        try {
            const pagination = {
                limit: PAGINATION_DEFAULT_RELATED_VOLUMES_PER_PAGE,
                page: 1
            };

            const response = await listRelatedVolumes(volumeId, pagination);
            setRelatedVolumes(response);
        } catch {
            setIsRelatedVolumesLoadFailed(true);
        } finally {
            setIsRelatedVolumesLoading(false);
        }
    };

    // ToDo: Transformar em componente isso aqui
    const shareBookUrl = async () => {
        const dataToShare = {
            title: `${volume.book?.title}`,
            text: `${volume.book?.subtitle || volume.book?.description || ""}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(dataToShare);
            } else {
                navigator.clipboard.writeText(
                    `${volume.book?.title}\n${volume.book?.subtitle || volume.book?.description}\n\nAcesse: ${window.location.href}`
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
        if (volumeSlug) loadVolume();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volumeSlug]);

    if (isVolumeLoadFailed) {
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
                    <Skeleton loading={isVolumeLoading} w={"100%"}>
                        <VolumeImageCard volume={volume} />
                    </Skeleton>
                </Flex>

                <VStack align="start" flex="1" gap="6">
                    <Box w="100%">
                        <Skeleton loading={isVolumeLoading}>
                            <PageHeading header={volume.book?.title} description={volume.book?.subtitle || ""} />
                        </Skeleton>
                    </Box>

                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap="6" w="100%">
                        <Skeleton loading={isVolumeLoading} w={"100%"}>
                            <VStack align="start" gap="1">
                                {/* ToDo: Agrupar desc iguais */}
                                {volume.authors?.map((bookAuthor) => {
                                    return (
                                        <HStack
                                            key={`author#${bookAuthor.id}`}
                                            onClick={() => {
                                                router.push(
                                                    `/?${QUERY_PARAMS_FOR_AUTHOR}=${encodeURIComponent(bookAuthor.slug)}`
                                                );
                                            }}
                                        >
                                            {bookAuthor.is_spirit ? <LuStar size="16" /> : <LuPen size="16" />}
                                            <Text fontWeight={"bold"}>
                                                {bookAuthor.role ||
                                                    (bookAuthor.is_spirit ? t("authorSpiritRole") : t("authorRole"))}
                                                :{" "}
                                            </Text>
                                            <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                                {bookAuthor.name}{" "}
                                            </Text>
                                        </HStack>
                                    );
                                })}

                                {volume?.publisher && (
                                    <HStack
                                        onClick={() => {
                                            router.push(
                                                `/?${QUERY_PARAMS_FOR_PUBLISHER}=${encodeURIComponent(volume?.publisher?.slug || "")}`
                                            );
                                        }}
                                    >
                                        <LuBuilding2 size="16" />
                                        <Text fontWeight={"bold"}>{t("publisher")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {volume?.publisher.abbreviation
                                                ? ` ${volume?.publisher.abbreviation} - `
                                                : ""}
                                            {volume?.publisher.name}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.edition && (
                                    <HStack>
                                        <LuBookCopy size="16" />
                                        <Text fontWeight={"bold"}>{t("edition")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {`${volume?.edition}ª`}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.year && (
                                    <HStack>
                                        <LuCalendar size="16" />
                                        <Text fontWeight={"bold"}>{t("publishedAt")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {volume?.year}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.pages && (
                                    <HStack>
                                        <LuBookOpen size="16" />
                                        <Text fontWeight={"bold"}>{t("pages")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {`${volume?.pages}`}{" "}
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Skeleton>

                        <Skeleton loading={isVolumeLoading} w={"100%"}>
                            <VStack align="start" gap="1">
                                {/* <HStack>
                                    {volume?.loans?.length > 0 ? <LuBookX size="16" /> : <LuBookCheck size="16" />}

                                    <Text fontWeight={"bold"}>{t("availability")}: </Text>
                                    <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                        <LoanBadge VolumeLoan={book?.loans?.[0]} />
                                    </Text>
                                </HStack> */}
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

                                {volume.category && (
                                    <HStack
                                        onClick={() => {
                                            router.push(
                                                `/?${QUERY_PARAMS_FOR_CATEGORY}=${encodeURIComponent(volume?.category?.slug || "")}`
                                            );
                                        }}
                                    >
                                        <LuBlocks size="16" />
                                        <Text fontWeight={"bold"}>{t("category")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {volume?.category.name}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.shelf && (
                                    <HStack>
                                        <LuLibraryBig size="16" />
                                        <Text fontWeight={"bold"}>{t("shelf")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {volume?.shelf}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.label && (
                                    <HStack>
                                        <LuBarcode size="16" />
                                        <Text fontWeight={"bold"}>{t("label")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {volume?.label}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.isbn_old && (
                                    <HStack>
                                        <LuBook size="16" />
                                        <Text fontWeight={"bold"}>{t("isbnOld")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {`${volume?.isbn_old}`}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {volume?.isbn && (
                                    <HStack>
                                        <LuBook size="16" />
                                        <Text fontWeight={"bold"}>{t("isbn")}: </Text>
                                        <Text _hover={{ color: "fealRedHover" }} cursor={"pointer"}>
                                            {`${volume?.isbn}`}{" "}
                                        </Text>
                                    </HStack>
                                )}

                                {(volume?.tags || []).length > 0 && (
                                    <Box>
                                        <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                            <LuListTodo size="16" style={{ marginRight: "6px" }} />
                                            <Text as="span" fontWeight="bold">
                                                {t("tags")}:{" "}
                                            </Text>
                                        </Box>
                                        <Box as="span" lineHeight="tall">
                                            {volume?.tags?.map((tag, index) => (
                                                <Text
                                                    key={tag.id}
                                                    as="span"
                                                    _hover={{ color: "fealRedHover" }}
                                                    cursor="pointer"
                                                    transition="color 0.2s"
                                                    onClick={() => {
                                                        router.push(
                                                            `/?${QUERY_PARAMS_FOR_TAG}=${encodeURIComponent(tag.slug.toString())}`
                                                        );
                                                    }}
                                                >
                                                    {tag.name}
                                                    {index === (volume.tags || []).length - 1 ? "" : ", "}
                                                </Text>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </VStack>
                        </Skeleton>
                    </SimpleGrid>

                    {volume.book?.summary && (
                        <Skeleton loading={isVolumeLoading} w="100%">
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuBookOpenText size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("summary")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                <Text as="span" color="fg.muted" textAlign={"justify"}>
                                    {volume.book?.summary}
                                </Text>
                            </Box>
                        </Skeleton>
                    )}

                    {volume.book?.description && (
                        <Skeleton loading={isVolumeLoading} w="100%">
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuText size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("description")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                <Text as="span" color="fg.muted" textAlign={"justify"}>
                                    {volume.book?.description}
                                </Text>
                            </Box>
                        </Skeleton>
                    )}

                    {volume.book?.recommended_for && (
                        <Skeleton loading={isVolumeLoading} w="100%">
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuGlasses size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("recommendedFor")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                <Text as="span" color="fg.muted" textAlign={"justify"}>
                                    {volume.book?.recommended_for}
                                </Text>
                            </Box>
                        </Skeleton>
                    )}

                    {/* ToDo: Transformar esse trecho em componente pois eu ja estou repetindo ele */}
                    {volume.book?.keywords && (
                        <Skeleton loading={isVolumeLoading} w="100%">
                            <Box as="span" display="inline-flex" alignItems="center" mr="2">
                                <LuTextSearch size="16" style={{ marginRight: "6px" }} />
                                <Text as="span" fontWeight="bold">
                                    {t("keywords")}:{" "}
                                </Text>
                            </Box>
                            <Box as="span" lineHeight="tall">
                                {volume.book?.keywords.map((key, index) => (
                                    <Text
                                        onClick={() => {
                                            router.push(`/?${QUERY_PARAMS_FOR_SEARCH}=${encodeURIComponent(key)}`);
                                        }}
                                        key={key}
                                        as="span"
                                        _hover={{ color: "fealRedHover" }}
                                        cursor="pointer"
                                        transition="color 0.2s"
                                    >
                                        {key}
                                        {index === (volume.book?.keywords || []).length - 1 ? "" : ", "}
                                    </Text>
                                ))}
                            </Box>
                        </Skeleton>
                    )}

                    <Skeleton loading={isVolumeLoading} w="100%">
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

            {(volume.authors || []).length > 0 ? (
                <>
                    <Spacer pt={"24px"} />

                    <Skeleton loading={isSeeAlsoVolumesLoading}>
                        <SectionHeading header={(volume.authors || []).length > 1 ? t("authors") : t("author")} />
                    </Skeleton>

                    <Spacer pt={"24px"} />
                    <Box>
                        <EntityGrid variant="scroll" loadingFailed={isSeeAlsoVolumesLoadFailed} eWidth={"180px"}>
                            {(volume.authors || []).map((author: Author) => {
                                return (
                                    <Skeleton key={`authorCard#${author.id}`} loading={isSeeAlsoVolumesLoading}>
                                        <AuthorSimpleCard
                                            author={author}
                                            onClick={() => {
                                                router.push(
                                                    `/?${author.is_spirit ? QUERY_PARAMS_FOR_SPIRIT_AUTHOR : QUERY_PARAMS_FOR_AUTHOR}=${author.slug}`
                                                );
                                            }}
                                        />
                                    </Skeleton>
                                );
                            })}
                        </EntityGrid>
                    </Box>
                </>
            ) : (
                <></>
            )}

            {/* ToDo: Quando o livro aberto nao estiver disponível seria interessante adicionar aqui uma seção com outros volumes do memso livro */}

            {relatedVolumes.elements.length > 0 ? (
                <>
                    <Spacer pt={"24px"} />

                    <Skeleton loading={isRelatedVolumesLoading}>
                        <SectionHeading header={t("relatedVolumes")} />
                    </Skeleton>

                    <Spacer pt={"24px"} />
                    <Box>
                        <EntityGrid variant="scroll" loadingFailed={isRelatedVolumesLoadFailed} eWidth={"180px"}>
                            {relatedVolumes.elements.map((obj: Volume) => {
                                return (
                                    <Skeleton key={`volumeCard#${obj.id}`} loading={isRelatedVolumesLoading}>
                                        <VolumeGridCard volume={obj} />
                                    </Skeleton>
                                );
                            })}
                        </EntityGrid>
                    </Box>
                </>
            ) : (
                <></>
            )}

            {seeAlsoVolumes.elements.length > 0 ? (
                <>
                    <Spacer pt={"24px"} />

                    <Skeleton loading={isSeeAlsoVolumesLoading}>
                        <SectionHeading header={t("seeAlso")} />
                    </Skeleton>

                    <Spacer pt={"24px"} />
                    <Box>
                        <EntityGrid variant="scroll" loadingFailed={isSeeAlsoVolumesLoadFailed} eWidth={"180px"}>
                            {seeAlsoVolumes.elements.map((obj: Volume) => {
                                return (
                                    <Skeleton key={`volumeCard#${obj.id}`} loading={isSeeAlsoVolumesLoading}>
                                        <VolumeGridCard volume={obj} />
                                    </Skeleton>
                                );
                            })}
                        </EntityGrid>
                    </Box>
                </>
            ) : (
                <></>
            )}

            <Spacer pt={"24px"} />

            <Skeleton loading={isVolumeLoading}>
                <VStack flex={1} align={{ base: "center", md: "start" }}>
                    <SectionHeading header={t("didntFindWhatYouWereLookingFor")} description={t("weAreWorkingOnIt")} />
                </VStack>
            </Skeleton>

            <Spacer pt={"24px"} />

            <Skeleton loading={isVolumeLoading}>
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
