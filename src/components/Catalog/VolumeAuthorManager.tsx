"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge, Field, HStack, Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { LuCalendarDays, LuPlus, LuSparkles, LuUserPlus, LuX } from "react-icons/lu";
import { AdminListRow, EntitySearchCombobox, ErrorBanner, SimpleIconButton } from "components";
import { listAuthorsAdmin } from "endpoints";
import { Author, Volume } from "types";
import { authorCover } from "assets";

interface Props {
    volume: Volume;
    isBusy: boolean;
    error: string | null;
    onLinkAuthor: (author: Author, description?: string) => Promise<boolean>;
    onUnlinkAuthor: (authorId: number) => Promise<boolean>;
    onRequestCreateAuthor: () => void;
}

const AUTHOR_SEARCH_LIMIT = 20;

function formatLifeSpan(birthDate?: string | null, deathDate?: string | null): string | null {
    const birthYear = birthDate ? new Date(birthDate).getUTCFullYear() : null;
    const deathYear = deathDate ? new Date(deathDate).getUTCFullYear() : null;

    if (birthYear && deathYear) return `${birthYear} — ${deathYear}`;
    if (birthYear) return `${birthYear}`;
    if (deathYear) return `— ${deathYear}`;
    return null;
}

function AuthorAvatar({ author, size = "40px" }: { author: Author; size?: string }) {
    return (
        <Image
            src={author.avatar_url || authorCover.default.src}
            alt=""
            boxSize={size}
            borderRadius="full"
            objectFit="cover"
            flexShrink={0}
        />
    );
}

export default function VolumeAuthorManager({
    volume,
    isBusy,
    error,
    onLinkAuthor,
    onUnlinkAuthor,
    onRequestCreateAuthor
}: Props) {
    const t = useTranslations("AdminCatalog");
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [role, setRole] = useState("");

    const linkedAuthors = volume.authors || [];
    const linkedIds = new Set(linkedAuthors.map((author) => author.id));

    // Busca no servidor (nunca carrega todos os autores no cliente - podem ser milhares) e já
    // exclui quem já está vinculado a este volume, pra não oferecer duplicata na lista.
    const searchAuthors = useCallback(
        async (query: string) => {
            const response = await listAuthorsAdmin({ search: query || undefined }, { limit: AUTHOR_SEARCH_LIMIT, page: 1 });
            return response.elements.filter((author) => !linkedIds.has(author.id));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [volume.authors]
    );

    const handleAdd = async () => {
        if (!selectedAuthor) return;
        const success = await onLinkAuthor(selectedAuthor, role.trim() || undefined);
        if (success) {
            setSelectedAuthor(null);
            setRole("");
        }
    };

    return (
        <VStack align="stretch" gap={3} w="100%">
            <Text fontWeight="bold" fontSize="sm" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                {t("volumeAuthorsTitle")}
            </Text>

            {error && <ErrorBanner message={error} />}

            {linkedAuthors.length > 0 && (
                <VStack align="stretch" gap={2}>
                    {linkedAuthors.map((author) => {
                        const lifeSpan = formatLifeSpan(author.birth_date, author.death_date);

                        return (
                            <AdminListRow
                                key={author.id}
                                avatar={<AuthorAvatar author={author} />}
                                title={
                                    <Text fontWeight="bold" fontSize="sm">
                                        {author.name}
                                    </Text>
                                }
                                badges={
                                    <>
                                        {author.is_spirit && (
                                            <Badge colorPalette="purple" size="sm">
                                                <LuSparkles size={10} /> {t("spiritBadge")}
                                            </Badge>
                                        )}
                                        {lifeSpan && (
                                            <Badge colorPalette="gray" size="sm">
                                                <LuCalendarDays size={10} /> {lifeSpan}
                                            </Badge>
                                        )}
                                    </>
                                }
                                subtitle={
                                    author.role ? (
                                        <Text fontSize="xs" color="fg.muted">
                                            {author.role}
                                        </Text>
                                    ) : (
                                        <Text fontSize="xs" color="fg.subtle" fontStyle="italic">
                                            {t("authorRolePlaceholder")}
                                        </Text>
                                    )
                                }
                                actions={
                                    <SimpleIconButton
                                        aria-label={t("removeAuthorButton")}
                                        tooltip={t("removeAuthorButton")}
                                        onClick={() => onUnlinkAuthor(author.id)}
                                        disabled={isBusy}
                                    >
                                        <LuX size={14} />
                                    </SimpleIconButton>
                                }
                            />
                        );
                    })}
                </VStack>
            )}

            <HStack gap={2} align="end" wrap="wrap">
                <Field.Root flex="2" minW="220px">
                    <Field.Label fontSize="xs">{t("addAuthorLabel")}</Field.Label>
                    <EntitySearchCombobox
                        selected={selectedAuthor}
                        onSelect={setSelectedAuthor}
                        search={searchAuthors}
                        placeholder={t("selectAuthorPlaceholder")}
                        emptyText={t("noAuthorsFound")}
                        disabled={isBusy}
                        renderItem={(author) => {
                            const lifeSpan = formatLifeSpan(author.birth_date, author.death_date);
                            return (
                                <HStack gap={2} align="center">
                                    <AuthorAvatar author={author} size="28px" />
                                    <VStack align="start" gap={0} flex="1" minW={0}>
                                        <Text fontSize="sm" fontWeight="bold" lineClamp={1}>
                                            {author.name}
                                        </Text>
                                        <HStack gap={1} wrap="wrap">
                                            {author.is_spirit && (
                                                <Badge colorPalette="purple" size="xs">
                                                    {t("spiritBadge")}
                                                </Badge>
                                            )}
                                            {lifeSpan && (
                                                <Text fontSize="xs" color="fg.muted">
                                                    {lifeSpan}
                                                </Text>
                                            )}
                                            {!!author.volumes_count && (
                                                <Text fontSize="xs" color="fg.muted">
                                                    {t("volumesCount", { count: author.volumes_count })}
                                                </Text>
                                            )}
                                        </HStack>
                                    </VStack>
                                </HStack>
                            );
                        }}
                    />
                </Field.Root>

                <Field.Root flex="2" minW="140px">
                    <Field.Label fontSize="xs">{t("authorRoleLabel")}</Field.Label>
                    <Input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder={t("authorRolePlaceholder")}
                        variant="flushed"
                        fontSize="sm"
                        borderBottomWidth="2px"
                        disabled={isBusy}
                    />
                </Field.Root>

                <SimpleIconButton
                    aria-label={t("addAuthorButton")}
                    tooltip={t("addAuthorButton")}
                    onClick={handleAdd}
                    disabled={isBusy || !selectedAuthor}
                    flexShrink={0}
                >
                    {isBusy ? <Spinner size="xs" /> : <LuPlus size={16} />}
                </SimpleIconButton>

                <SimpleIconButton
                    aria-label={t("quickCreateAuthorButton")}
                    tooltip={t("quickCreateAuthorButton")}
                    onClick={onRequestCreateAuthor}
                    disabled={isBusy}
                    flexShrink={0}
                    colorPalette="fealRed"
                >
                    <LuUserPlus size={16} />
                </SimpleIconButton>
            </HStack>
        </VStack>
    );
}
