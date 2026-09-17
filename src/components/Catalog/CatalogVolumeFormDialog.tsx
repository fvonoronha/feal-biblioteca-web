"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    Portal,
    VStack,
    HStack,
    Badge,
    Box,
    Heading,
    Image,
    Text,
    Field,
    Input,
    Separator,
    Spinner
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import {
    AdminListRow,
    AuthorFormDialog,
    EntitySearchCombobox,
    ErrorBanner,
    GhostButton,
    PublisherFormDialog,
    SimpleButton,
    SimpleIconButton,
    VolumeAuthorManager,
    VolumeImageManager
} from "components";
import { Author, Publisher, Volume } from "types";
import { AuthorPayload, listPublishersAdmin, PublisherPayload, VolumePayload } from "endpoints";
import { volumeCover } from "assets";

const PUBLISHER_SEARCH_LIMIT = 20;

function PublisherAvatar({ publisher, size = "40px" }: { publisher: Publisher; size?: string }) {
    return (
        <Image
            src={publisher.avatar_url || volumeCover.default.src}
            alt=""
            boxSize={size}
            borderRadius="md"
            objectFit="cover"
            flexShrink={0}
        />
    );
}

export type VolumeFormTarget =
    | { mode: "create"; bookId: number; bookTitle: string }
    | { mode: "edit"; volume: Volume; bookTitle: string }
    | null;

type VolumeImageField = "cover" | "back" | "aux";

interface Props {
    target: VolumeFormTarget;
    siblingVolumes: Volume[];
    onClose: () => void;
    onSave: (volumePayload: Partial<VolumePayload>) => void;
    isSaving: boolean;
    errors: string[];

    // Cadastro rápido de editora/autor sem sair do formulário do volume - ver useAdminBooks#
    // createPublisherQuick/createAuthorQuick.
    onCreatePublisher: (payload: PublisherPayload) => Promise<Publisher | undefined>;
    onCreateAuthor: (payload: AuthorPayload) => Promise<Author | undefined>;

    // Autores vinculados ao volume - assim como as imagens abaixo, só disponível em modo
    // "edit" (o vínculo exige um volume_id já existente).
    onLinkAuthor: (author: Author, description?: string) => Promise<boolean>;
    onUnlinkAuthor: (authorId: number) => Promise<boolean>;
    isLinkingAuthor: boolean;
    authorLinkError: string | null;

    // Gerenciamento de imagens (capa/verso/auxiliares) - só funciona em modo "edit", já que os
    // endpoints de upload multipart precisam de um volume já existente. Cada ação aqui salva
    // imediatamente no servidor, independente do botão "Salvar" principal deste diálogo. Ao
    // criar um volume novo, o diálogo passa a mostrar essa seção (e a de autores) automaticamente
    // assim que o cadastro é concluído - ver useAdminBooks#saveVolumeForm.
    onUploadVolumeImage: (field: VolumeImageField, blob: Blob) => Promise<boolean>;
    onSelectExistingVolumeImage: (field: VolumeImageField, url: string) => Promise<boolean>;
    onClearVolumeImage: (field: "cover" | "back") => Promise<boolean>;
    onRemoveVolumeAuxImage: (url: string) => Promise<boolean>;
    isUploadingVolumeImage: boolean;
    volumeImageError: string | null;
}

const emptyForm = {
    year: "",
    edition: "",
    isbn: "",
    isbn_old: "",
    pages: "",
    label: "",
    shelf: ""
};

export default function CatalogVolumeFormDialog({
    target,
    siblingVolumes,
    onClose,
    onSave,
    isSaving,
    errors,
    onCreatePublisher,
    onCreateAuthor,
    onLinkAuthor,
    onUnlinkAuthor,
    isLinkingAuthor,
    authorLinkError,
    onUploadVolumeImage,
    onSelectExistingVolumeImage,
    onClearVolumeImage,
    onRemoveVolumeAuxImage,
    isUploadingVolumeImage,
    volumeImageError
}: Props) {
    const t = useTranslations("AdminCatalog");
    const [form, setForm] = useState(emptyForm);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);

    const isEdit = target?.mode === "edit";

    // Busca no servidor (nunca carrega todas as editoras no cliente - podem ser muitas).
    const searchPublishers = useCallback(async (query: string) => {
        const response = await listPublishersAdmin({ search: query || undefined }, { limit: PUBLISHER_SEARCH_LIMIT, page: 1 });
        return response.elements;
    }, []);

    // Detecta a transição "criar -> editar" (o mesmo diálogo passa a mostrar autores/imagens
    // assim que o volume é criado, ver useAdminBooks#saveVolumeForm) pra mostrar um aviso
    // amigável explicando por que novas seções apareceram, em vez de simplesmente fechar.
    const previousModeRef = useRef<string | null>(null);
    const [justCreated, setJustCreated] = useState(false);

    useEffect(() => {
        if (previousModeRef.current === "create" && target?.mode === "edit") {
            setJustCreated(true);
        }
        if (!target) setJustCreated(false);
        previousModeRef.current = target?.mode ?? null;
    }, [target]);

    useEffect(() => {
        if (target?.mode === "edit") {
            const volume = target.volume;
            setForm({
                year: volume.year ? String(volume.year) : "",
                edition: volume.edition || "",
                isbn: volume.isbn || "",
                isbn_old: volume.isbn_old || "",
                pages: volume.pages ? String(volume.pages) : "",
                label: volume.label || "",
                shelf: volume.shelf || ""
            });
            setSelectedPublisher(volume.publisher || null);
        } else if (target?.mode === "create") {
            setForm(emptyForm);
            setSelectedPublisher(null);
        }
    }, [target]);

    const updateField = (field: keyof typeof form, value: string) =>
        setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = () => {
        onSave({
            publisher_id: selectedPublisher ? selectedPublisher.id : undefined,
            year: form.year ? Number(form.year) : undefined,
            edition: form.edition.trim() || undefined,
            isbn: form.isbn.trim() || undefined,
            isbn_old: form.isbn_old.trim() || undefined,
            pages: form.pages ? Number(form.pages) : undefined,
            label: form.label.trim() || undefined,
            shelf: form.shelf.trim() || undefined
        });
    };

    // --- Cadastro rápido de editora, acionado pelo atalho ao lado do select de editora ---
    const [quickCreatePublisherOpen, setQuickCreatePublisherOpen] = useState(false);
    const [isSavingQuickPublisher, setIsSavingQuickPublisher] = useState(false);
    const [quickPublisherErrors, setQuickPublisherErrors] = useState<string[]>([]);

    const handleSaveQuickPublisher = async (payload: PublisherPayload) => {
        setIsSavingQuickPublisher(true);
        setQuickPublisherErrors([]);

        try {
            const created = await onCreatePublisher(payload);
            if (created) {
                setSelectedPublisher(created);
                setQuickCreatePublisherOpen(false);
            } else {
                setQuickPublisherErrors([t("saveGenericError")]);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.publisher?.error;
            setQuickPublisherErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("saveGenericError")]
            );
        } finally {
            setIsSavingQuickPublisher(false);
        }
    };

    // --- Cadastro rápido de autor, acionado de dentro da seção de autores (só existe em modo
    // "edit") - ao criar, já vincula o autor recém-criado a este volume direto ---
    const [quickCreateAuthorOpen, setQuickCreateAuthorOpen] = useState(false);
    const [isSavingQuickAuthor, setIsSavingQuickAuthor] = useState(false);
    const [quickAuthorErrors, setQuickAuthorErrors] = useState<string[]>([]);

    const handleSaveQuickAuthor = async (payload: AuthorPayload) => {
        setIsSavingQuickAuthor(true);
        setQuickAuthorErrors([]);

        try {
            const created = await onCreateAuthor(payload);
            if (created) {
                setQuickCreateAuthorOpen(false);
                if (isEdit) await onLinkAuthor(created);
            } else {
                setQuickAuthorErrors([t("saveGenericError")]);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.author?.error;
            setQuickAuthorErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("saveGenericError")]
            );
        } finally {
            setIsSavingQuickAuthor(false);
        }
    };

    return (
        <DialogRoot open={!!target} onOpenChange={(e) => !e.open && onClose()} size="md">
            <Portal>
                <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

                <DialogContent
                    borderRadius="lg"
                    bg="gray.subtle"
                    position="fixed"
                    top={{ base: "12px", md: "10%" }}
                    left="50%"
                    transform="translateX(-50%)"
                    width={{ base: "calc(100vw - 24px)", md: "500px" }}
                    maxH={{ base: "calc(100dvh - 24px)", md: "85vh" }}
                    overflowY="auto"
                    p={{ base: 4, md: 6 }}
                >
                    <VStack align="stretch" gap={4}>
                        <VStack align="start" gap={0}>
                            <Heading size="md">{isEdit ? t("editVolumeTitle") : t("createEditionTitle")}</Heading>
                            <Text fontSize="sm" color="fg.muted">
                                {target?.bookTitle}
                            </Text>
                        </VStack>

                        {justCreated && (
                            <Text fontSize="sm" color="green.fg" bg="green.subtle" borderRadius="md" px={3} py={2}>
                                {t("volumeCreatedHint")}
                            </Text>
                        )}

                        {errors.length > 0 && (
                            <VStack gap={2} align="stretch">
                                {errors.map((message, index) => (
                                    <ErrorBanner key={index} message={message} />
                                ))}
                            </VStack>
                        )}

                        <HStack gap={4} align="start" wrap="wrap">
                            <Field.Root flex="1" minW="160px">
                                <Field.Label>{t("labelLabel")}</Field.Label>
                                <Input
                                    value={form.label}
                                    onChange={(e) => updateField("label", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                            <Field.Root flex="1" minW="160px">
                                <Field.Label>{t("shelfLabel")}</Field.Label>
                                <Input
                                    value={form.shelf}
                                    onChange={(e) => updateField("shelf", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                        </HStack>

                        <Field.Root>
                            <Field.Label>{t("publisherLabel")}</Field.Label>
                            <HStack gap={2}>
                                <Box flex="1">
                                    <EntitySearchCombobox
                                        selected={selectedPublisher}
                                        onSelect={setSelectedPublisher}
                                        search={searchPublishers}
                                        placeholder={t("searchPublisherPlaceholder")}
                                        emptyText={t("noPublishersFound")}
                                        disabled={isSaving}
                                        renderItem={(publisher) => (
                                            <HStack gap={2} align="center">
                                                <PublisherAvatar publisher={publisher} size="28px" />
                                                <VStack align="start" gap={0} flex="1" minW={0}>
                                                    <Text fontSize="sm" fontWeight="bold" lineClamp={1}>
                                                        {publisher.name}
                                                    </Text>
                                                    <HStack gap={1} wrap="wrap">
                                                        {publisher.abbreviation && (
                                                            <Badge colorPalette="gray" size="xs">
                                                                {publisher.abbreviation}
                                                            </Badge>
                                                        )}
                                                        {!!publisher.books_count && (
                                                            <Text fontSize="xs" color="fg.muted">
                                                                {t("booksCount", { count: publisher.books_count })}
                                                            </Text>
                                                        )}
                                                    </HStack>
                                                </VStack>
                                            </HStack>
                                        )}
                                    />
                                </Box>
                                <SimpleIconButton
                                    aria-label={t("quickCreatePublisherButton")}
                                    tooltip={t("quickCreatePublisherButton")}
                                    onClick={() => setQuickCreatePublisherOpen(true)}
                                    disabled={isSaving}
                                    flexShrink={0}
                                >
                                    <LuPlus size={16} />
                                </SimpleIconButton>
                            </HStack>

                            {selectedPublisher && (
                                <Box mt={2} w="100%">
                                    <AdminListRow
                                        avatar={<PublisherAvatar publisher={selectedPublisher} />}
                                        title={
                                            <Text fontWeight="bold" fontSize="sm">
                                                {selectedPublisher.name}
                                            </Text>
                                        }
                                        badges={
                                            selectedPublisher.abbreviation ? (
                                                <Badge colorPalette="gray" size="sm">
                                                    {selectedPublisher.abbreviation}
                                                </Badge>
                                            ) : undefined
                                        }
                                        subtitle={
                                            selectedPublisher.description ? (
                                                <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                                                    {selectedPublisher.description}
                                                </Text>
                                            ) : undefined
                                        }
                                        meta={
                                            (selectedPublisher.books_count || selectedPublisher.volumes_count) && (
                                                <Text fontSize="xs" color="fg.muted">
                                                    {[
                                                        selectedPublisher.books_count
                                                            ? t("booksCount", { count: selectedPublisher.books_count })
                                                            : null,
                                                        selectedPublisher.volumes_count
                                                            ? t("volumesCount", { count: selectedPublisher.volumes_count })
                                                            : null
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </Text>
                                            )
                                        }
                                    />
                                </Box>
                            )}
                        </Field.Root>

                        <HStack gap={4} align="start" wrap="wrap">
                            <Field.Root flex="1" minW="100px">
                                <Field.Label>{t("yearLabel")}</Field.Label>
                                <Input
                                    type="number"
                                    value={form.year}
                                    onChange={(e) => updateField("year", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                            <Field.Root flex="1" minW="100px">
                                <Field.Label>{t("editionLabel")}</Field.Label>
                                <Input
                                    value={form.edition}
                                    onChange={(e) => updateField("edition", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                            <Field.Root flex="1" minW="100px">
                                <Field.Label>{t("pagesLabel")}</Field.Label>
                                <Input
                                    type="number"
                                    value={form.pages}
                                    onChange={(e) => updateField("pages", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                        </HStack>

                        <HStack gap={4} align="start" wrap="wrap">
                            <Field.Root flex="1" minW="160px">
                                <Field.Label>{t("isbnLabel")}</Field.Label>
                                <Input
                                    value={form.isbn}
                                    onChange={(e) => updateField("isbn", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                            <Field.Root flex="1" minW="160px">
                                <Field.Label>{t("isbnOldLabel")}</Field.Label>
                                <Input
                                    value={form.isbn_old}
                                    onChange={(e) => updateField("isbn_old", e.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                            </Field.Root>
                        </HStack>

                        {isEdit && target?.mode === "edit" && (
                            <>
                                <Separator />
                                <VolumeAuthorManager
                                    volume={target.volume}
                                    isBusy={isLinkingAuthor}
                                    error={authorLinkError}
                                    onLinkAuthor={onLinkAuthor}
                                    onUnlinkAuthor={onUnlinkAuthor}
                                    onRequestCreateAuthor={() => setQuickCreateAuthorOpen(true)}
                                />

                                <Separator />
                                <VolumeImageManager
                                    volume={target.volume}
                                    siblingVolumes={siblingVolumes}
                                    isBusy={isUploadingVolumeImage}
                                    error={volumeImageError}
                                    onUploadImage={onUploadVolumeImage}
                                    onSelectExistingImage={onSelectExistingVolumeImage}
                                    onClearImage={onClearVolumeImage}
                                    onRemoveAuxImage={onRemoveVolumeAuxImage}
                                />
                            </>
                        )}

                        <HStack justify="flex-end" gap={3} pt={2}>
                            <GhostButton onClick={onClose} disabled={isSaving}>
                                {justCreated ? t("doneButton") : t("cancelButton")}
                            </GhostButton>
                            <SimpleButton onClick={handleSubmit} disabled={isSaving}>
                                {isSaving ? <Spinner size="sm" /> : t("saveButton")}
                            </SimpleButton>
                        </HStack>
                    </VStack>
                </DialogContent>
            </Portal>

            <PublisherFormDialog
                editingItem={quickCreatePublisherOpen ? "new" : null}
                onClose={() => !isSavingQuickPublisher && setQuickCreatePublisherOpen(false)}
                onSave={handleSaveQuickPublisher}
                isSaving={isSavingQuickPublisher}
                errors={quickPublisherErrors}
            />

            <AuthorFormDialog
                editingAuthor={quickCreateAuthorOpen ? "new" : null}
                onClose={() => !isSavingQuickAuthor && setQuickCreateAuthorOpen(false)}
                onSave={handleSaveQuickAuthor}
                isSaving={isSavingQuickAuthor}
                errors={quickAuthorErrors}
            />
        </DialogRoot>
    );
}
