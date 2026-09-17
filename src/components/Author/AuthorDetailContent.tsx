"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
    Box,
    Center,
    HStack,
    Image,
    NativeSelect,
    Skeleton,
    Spinner,
    Text,
    VStack,
    Separator,
    Badge
} from "@chakra-ui/react";
import { LuSparkles, LuX, LuCalendarDays } from "react-icons/lu";
import { useAuthorDetails } from "hooks";
import { authorCover } from "assets";
import { EntityGrid, LabelBadge, BookCoverFlip, AdminSortSelect } from "components";
import { AuthorVolume } from "types";
import { QUERY_PARAMS_FOR_CATEGORY } from "utils";

interface Props {
    authorSlug: string;
    onClose?: () => void;
    // Navega para uma página que não é mais este modal (ex.: um volume) - fecha o diálogo de
    // forma determinística antes de sair, em vez de combinar onClose()+router.push() (essa
    // combinação corria risco de disparar duas navegações de história em sequência rápida).
    onNavigate: (path: string) => void;
}

function formatLifeSpan(birthDate: string | null | undefined, deathDate: string | null | undefined): string | null {
    const birthYear = birthDate ? new Date(birthDate).getUTCFullYear() : null;
    const deathYear = deathDate ? new Date(deathDate).getUTCFullYear() : null;

    if (birthYear && deathYear) return `${birthYear} — ${deathYear}`;
    if (birthYear) return `${birthYear}`;
    if (deathYear) return `— ${deathYear}`;
    return null;
}

export default function AuthorDetailContent({ authorSlug, onClose, onNavigate }: Props) {
    const t = useTranslations("AuthorDetails");
    const { author, isAuthorLoading, isAuthorLoadFailed } = useAuthorDetails(authorSlug);

    const [categoryFilter, setCategoryFilter] = useState("");
    const [sort, setSort] = useState("title_asc");

    const sortOptions = [
        { value: "title_asc", label: t("sortTitleAsc") },
        { value: "year_desc", label: t("sortYearDesc") },
        { value: "year_asc", label: t("sortYearAsc") }
    ];

    const goToVolume = (volume: AuthorVolume) => {
        onNavigate(`/v/${volume.slug}`);
    };

    const goToCategory = (categorySlug: string) => {
        onNavigate(`/?${QUERY_PARAMS_FOR_CATEGORY}=${categorySlug}`);
    };

    // Temas dos livros deste autor (derivados dos volumes já carregados, sem outra chamada) -
    // dá pra explorar o resto do acervo por assunto a partir do autor, não só livro a livro.
    const categories = Array.from(
        new Map((author.volumes || []).filter((v) => v.category).map((v) => [v.category!.slug, v.category!])).values()
    );

    // Quebra por papel (autor, tradutor, organizador...) - antes só dava pra perceber isso
    // olhando livro por livro na grade; agora fica visível de cara quantos títulos ele assina
    // em cada função.
    const roleBreakdown = Array.from(
        (author.volumes || []).reduce((acc, volume) => {
            const role = volume.role?.trim() || t("defaultRole");
            acc.set(role, (acc.get(role) || 0) + 1);
            return acc;
        }, new Map<string, number>())
    );

    // Filtro e ordenação aplicados só no que já veio do backend (a lista de volumes de um
    // autor raramente passa de algumas dezenas) - não vale a pena outra chamada de API só
    // pra isso.
    const displayedVolumes = useMemo(() => {
        const volumes = author.volumes || [];
        const filtered = categoryFilter
            ? volumes.filter((volume) => volume.category?.slug === categoryFilter)
            : volumes;

        return [...filtered].sort((a, b) => {
            if (sort === "year_desc") return (b.year || 0) - (a.year || 0);
            if (sort === "year_asc") return (a.year || 0) - (b.year || 0);
            return a.book.title.localeCompare(b.book.title);
        });
    }, [author.volumes, categoryFilter, sort]);

    if (isAuthorLoadFailed) {
        return (
            <VStack py="16" gap={3}>
                <Text>{t("errorLoading")}</Text>
            </VStack>
        );
    }

    const coverImg =
        author.avatar_url || (author.is_spirit ? authorCover.default_is_spirit.src : authorCover.default.src);
    const lifeSpan = formatLifeSpan(author.birth_date, author.death_date);

    return (
        <Box position="relative" p={{ base: 4, md: 6 }} maxH={{ base: "85dvh", md: "82vh" }} overflowY="auto">
            {onClose && (
                <Box
                    position="absolute"
                    top={{ base: "8px", md: "16px" }}
                    right={{ base: "8px", md: "16px" }}
                    zIndex={1}
                    p={2}
                    borderRadius="full"
                    bg="blackAlpha.100"
                    cursor="pointer"
                    _hover={{ bg: "blackAlpha.200" }}
                    onClick={onClose}
                >
                    <LuX size={18} />
                </Box>
            )}

            <VStack align="stretch" gap={5}>
                {/* Cabeçalho: foto fixa à esquerda + nome/badges/biografia ocupando todo o
                    espaço à direita, em vez de empilhado - aproveita bem melhor a largura
                    generosa do modal em telas maiores. */}
                <HStack align="start" gap={5} w="100%">
                    <Skeleton loading={isAuthorLoading} borderRadius="md" flexShrink={0}>
                        <Image
                            src={coverImg}
                            alt={author.name}
                            boxSize={{ base: "96px", md: "128px" }}
                            borderRadius="md"
                            objectFit="cover"
                            border="2px solid"
                            borderColor={{ base: "gray.200", _dark: "gray.600" }}
                        />
                    </Skeleton>

                    <VStack align="start" gap={2} flex={1} minW={0}>
                        <VStack align="start" gap={1}>
                            <Skeleton loading={isAuthorLoading}>
                                <Text fontSize="xl" fontWeight="bold">
                                    {author.name}
                                </Text>
                            </Skeleton>

                            <HStack wrap="wrap" gap={2}>
                                {author.is_spirit && (
                                    <Badge colorPalette="purple" variant="subtle">
                                        <LuSparkles size={12} /> {t("spiritBadge")}
                                    </Badge>
                                )}
                                {lifeSpan && (
                                    <Badge variant="subtle" colorPalette="gray">
                                        <LuCalendarDays size={12} /> {lifeSpan}
                                    </Badge>
                                )}
                                {typeof author.volumes_count === "number" && (
                                    <Badge variant="subtle" colorPalette="gray">
                                        {t("volumesCount", { count: author.volumes_count })}
                                    </Badge>
                                )}
                            </HStack>
                        </VStack>

                        {(author.description || isAuthorLoading) && (
                            <Skeleton loading={isAuthorLoading} w="100%">
                                <Text
                                    fontSize="sm"
                                    color={{ base: "gray.700", _dark: "gray.300" }}
                                    whiteSpace="pre-line"
                                >
                                    {author.description}
                                </Text>
                            </Skeleton>
                        )}

                        {roleBreakdown.length > 0 && (
                            <HStack wrap="wrap" gap={2}>
                                {roleBreakdown.map(([role, count]) => (
                                    <Badge key={role} variant="outline" colorPalette="gray" size="sm">
                                        {role} ({count})
                                    </Badge>
                                ))}
                            </HStack>
                        )}

                        {categories.length > 0 && (
                            <VStack align="start" gap={1} w="100%">
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color="fg.muted"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                >
                                    {t("categoriesTitle")}
                                </Text>
                                <HStack wrap="wrap" gap={2}>
                                    {categories.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant="subtle"
                                            colorPalette="fealRed"
                                            cursor="pointer"
                                            onClick={() => goToCategory(category.slug)}
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </HStack>
                            </VStack>
                        )}
                    </VStack>
                </HStack>

                <Separator />

                <VStack align="start" gap={3} w="100%">
                    <HStack justify="space-between" wrap="wrap" gap={2} w="100%">
                        <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color="fg.muted"
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            {t("booksTitle")}
                        </Text>

                        {!isAuthorLoading && (author.volumes?.length || 0) > 0 && (
                            <HStack gap={2} wrap="wrap">
                                {categories.length > 0 && (
                                    <NativeSelect.Root size="sm" w={{ base: "full", md: "160px" }}>
                                        <NativeSelect.Field
                                            value={categoryFilter}
                                            onChange={(event) => setCategoryFilter(event.target.value)}
                                        >
                                            <option value="">{t("categoryFilterAll")}</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.slug}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                )}

                                <AdminSortSelect value={sort} options={sortOptions} onChange={setSort} />
                            </HStack>
                        )}
                    </HStack>

                    {isAuthorLoading ? (
                        <Center w="100%" py={6}>
                            <Spinner size="md" color="fealRed.solid" />
                        </Center>
                    ) : (author.volumes?.length || 0) === 0 ? (
                        <Text fontSize="sm" color="fg.muted">
                            {t("noBooksFound")}
                        </Text>
                    ) : displayedVolumes.length === 0 ? (
                        <Text fontSize="sm" color="fg.muted">
                            {t("noBooksMatchFilter")}
                        </Text>
                    ) : (
                        <EntityGrid variant="grid" eWidth="110px" loadingFailed={false}>
                            {displayedVolumes.map((volume) => (
                                <VStack
                                    key={volume.id}
                                    align="center"
                                    gap={1}
                                    cursor="pointer"
                                    onClick={() => goToVolume(volume)}
                                >
                                    <Box
                                        w="100%"
                                        borderRadius="md"
                                        border="2px solid"
                                        borderColor={{ base: "gray.200", _dark: "gray.600" }}
                                        transition="border-color .15s"
                                        _hover={{ borderColor: "fealRed.solid" }}
                                    >
                                        <BookCoverFlip coverUrl={volume.cover_url} alt={volume.book.title} w="100%">
                                            {(isHovered) => (
                                                <>
                                                    {volume.label && !isHovered && (
                                                        <Box
                                                            position="absolute"
                                                            bottom="4px"
                                                            left="4px"
                                                            zIndex="10"
                                                            transform="translateZ(10px)"
                                                        >
                                                            <LabelBadge label={volume.label} size="sm" />
                                                        </Box>
                                                    )}
                                                    {volume.is_available === false && (
                                                        <Box
                                                            position="absolute"
                                                            top="4px"
                                                            right="4px"
                                                            zIndex="10"
                                                            transform="translateZ(10px)"
                                                            boxSize="10px"
                                                            borderRadius="full"
                                                            bg="fealRed.solid"
                                                            border="2px solid"
                                                            borderColor={{ base: "white", _dark: "gray.800" }}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </BookCoverFlip>
                                    </Box>

                                    <Text fontSize="xs" fontWeight="bold" lineClamp={2} textAlign="center">
                                        {volume.book.title}
                                    </Text>
                                    {volume.role && (
                                        <Text fontSize="xs" color="fg.muted" lineClamp={1}>
                                            {volume.role}
                                        </Text>
                                    )}
                                </VStack>
                            ))}
                        </EntityGrid>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}
