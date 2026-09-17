"use client";

import { useEffect, useState } from "react";
import { Box, Button, Group, Heading, HStack, Input } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchExploreChipList, SearchExploreAuthors, SearchVolumeResults, SearchAuthorResults } from "components";
import { Author, Category, Tag, Volume } from "types";
import {
    TOP_BAR_DEFAULT_ICON_SIZE,
    QUERY_PARAMS_FOR_SEARCH,
    QUERY_PARAMS_FOR_CATEGORY,
    QUERY_PARAMS_FOR_TAG
} from "utils";
import { useDebounce, useSearchExploreLists, useSearchResults } from "hooks";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 500;

interface Props {
    // Navega para uma rota que NÃO é mais o modal de busca (outra página de verdade, como um
    // volume ou a home filtrada) - o `SearchDialog` usa isso pra fechar o diálogo de forma
    // determinística antes de empurrar a nova rota (ver useModalDialog). Ir para o modal de
    // autor (`/a/slug`, outra rota interceptada irmã) continua usando router.push puro logo
    // abaixo, já que ali o slot @modal só troca de conteúdo, sem "fechar" nada visualmente.
    onNavigate: (path: string) => void;
}

export default function SearchDialogContent({ onNavigate }: Props) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const router = useRouter();
    const t = useTranslations("Collection");

    const explore = useSearchExploreLists();
    const results = useSearchResults(debouncedQuery);

    // Antes isso só rodava no onOpenChange do Dialog local - agora que a busca é uma rota
    // (intercepted ou não), carrega assim que o conteúdo monta.
    useEffect(() => {
        explore.loadIfNeeded();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Enquanto o debounce não "alcançou" o que foi digitado, `results` ainda reflete a busca
    // anterior (ou o placeholder de esqueleto, se for a primeira letra) - tratar isso como
    // "carregando" evita mostrar por um instante aqueles volumes falsos do skeleton como se
    // fossem resultados reais.
    const isSearchSettling = query !== debouncedQuery;
    const isVolumesLoading = results.isVolumesLoading || isSearchSettling;
    const isAuthorsLoading = results.isAuthorsLoading || isSearchSettling;

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (query.trim()) {
            onNavigate(`/?${QUERY_PARAMS_FOR_SEARCH}=${encodeURIComponent(query)}`);
        }
    };

    const goToCategory = (category: Category) => {
        onNavigate(`/?${QUERY_PARAMS_FOR_CATEGORY}=${category.slug}`);
    };

    const goToTag = (tag: Tag) => {
        onNavigate(`/?${QUERY_PARAMS_FOR_TAG}=${tag.slug}`);
    };

    // Autor é outra rota interceptada (/a/slug) - o slot @modal só troca de conteúdo pra ela,
    // não sai do "modo modal", então navega direto em vez de passar por onNavigate.
    const goToAuthor = (author: Author) => {
        router.push(`/a/${author.slug}`);
    };

    const goToVolume = (volume: Volume) => {
        onNavigate(`/v/${volume.slug}`);
    };

    return (
        <>
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
                            _focus={{ borderColor: "fealRed.solid" }}
                            _hover={{ borderColor: "fealRed.solid" }}
                            autoFocus
                        />

                        <HStack gap="2" display={{ base: "none", md: "flex" }} pl="4">
                            <Button onClick={() => handleSearch()}>{t("filterSearchLabel")}</Button>
                        </HStack>
                    </Group>
                </form>
            </Box>

            <Box py={4} px={4} maxHeight="80vh" overflowY="auto">
                {query.length === 0 && (
                    <>
                        <SearchExploreChipList
                            title={t("filterSearchExploreCategories")}
                            items={explore.categories.elements}
                            isLoading={explore.categories.isLoading}
                            hide={explore.categories.hasFailed}
                            itemKey={(category: Category) => category.id}
                            formatLabel={(category: Category) => category.name.split(".").at(-1)?.trim() || category.name}
                            onSelectItem={goToCategory}
                        />

                        <SearchExploreAuthors
                            title={t("filterSearchExploreAuthors")}
                            authors={explore.authors.elements}
                            isLoading={explore.authors.isLoading}
                            hide={explore.authors.hasFailed}
                            onSelectAuthor={goToAuthor}
                        />

                        <SearchExploreChipList
                            title={t("filterSearchExploreTags")}
                            items={explore.tags.elements}
                            isLoading={explore.tags.isLoading}
                            hide={explore.tags.hasFailed}
                            itemKey={(tag: Tag) => tag.id}
                            formatLabel={(tag: Tag) => tag.name?.trim() || tag.name}
                            onSelectItem={goToTag}
                        />
                    </>
                )}

                {query.length > 0 && (
                    <Box gap="2" display="flex" flexDirection="column">
                        <Heading fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="wider" pt="4" pb="2">
                            {t("filterSearchFastSearch").toUpperCase()}
                        </Heading>

                        <SearchVolumeResults
                            query={query}
                            volumes={results.volumes}
                            total={results.volumesTotal}
                            isLoading={isVolumesLoading}
                            hasFailed={results.isVolumesLoadFailed}
                            onSeeMore={handleSearch}
                            onSelectVolume={goToVolume}
                        />

                        <SearchAuthorResults
                            query={query}
                            authors={results.authors}
                            total={results.authorsTotal}
                            isLoading={isAuthorsLoading}
                            hasFailed={results.isAuthorsLoadFailed}
                            onSeeMore={handleSearch}
                            onSelectAuthor={goToAuthor}
                        />

                        {!isSearchSettling &&
                            results.volumes.length === 0 &&
                            results.authors.length === 0 &&
                            !results.isVolumesLoading &&
                            !results.isAuthorsLoading && <Heading textAlign="center">{t("nothingFound")}</Heading>}
                    </Box>
                )}
            </Box>
        </>
    );
}
