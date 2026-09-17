"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    VStack,
    HStack,
    Heading,
    Text,
    Field,
    Input,
    NativeSelect,
    Separator,
    Spinner
} from "@chakra-ui/react";
import { ErrorBanner, GhostButton, SimpleButton, VolumeImageManager } from "components";
import { Publisher, Volume } from "types";
import { VolumePayload } from "endpoints";

export type VolumeFormTarget =
    | { mode: "create"; bookId: number; bookTitle: string }
    | { mode: "edit"; volume: Volume; bookTitle: string }
    | null;

type VolumeImageField = "cover" | "back" | "aux";

interface Props {
    target: VolumeFormTarget;
    publishers: Publisher[];
    siblingVolumes: Volume[];
    onClose: () => void;
    onSave: (volumePayload: Partial<VolumePayload>) => void;
    isSaving: boolean;
    errors: string[];

    // Gerenciamento de imagens (capa/verso/auxiliares) - só funciona em modo "edit", já que os
    // endpoints de upload multipart precisam de um volume já existente. Cada ação aqui salva
    // imediatamente no servidor, independente do botão "Salvar" principal deste diálogo.
    onUploadVolumeImage: (field: VolumeImageField, blob: Blob) => Promise<boolean>;
    onSelectExistingVolumeImage: (field: VolumeImageField, url: string) => Promise<boolean>;
    onClearVolumeImage: (field: "cover" | "back") => Promise<boolean>;
    onRemoveVolumeAuxImage: (url: string) => Promise<boolean>;
    isUploadingVolumeImage: boolean;
    volumeImageError: string | null;
}

const emptyForm = {
    publisher_id: "",
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
    publishers,
    siblingVolumes,
    onClose,
    onSave,
    isSaving,
    errors,
    onUploadVolumeImage,
    onSelectExistingVolumeImage,
    onClearVolumeImage,
    onRemoveVolumeAuxImage,
    isUploadingVolumeImage,
    volumeImageError
}: Props) {
    const t = useTranslations("AdminCatalog");
    const [form, setForm] = useState(emptyForm);

    const isEdit = target?.mode === "edit";

    useEffect(() => {
        if (target?.mode === "edit") {
            const volume = target.volume;
            setForm({
                publisher_id: volume.publisher ? String(volume.publisher.id) : "",
                year: volume.year ? String(volume.year) : "",
                edition: volume.edition || "",
                isbn: volume.isbn || "",
                isbn_old: volume.isbn_old || "",
                pages: volume.pages ? String(volume.pages) : "",
                label: volume.label || "",
                shelf: volume.shelf || ""
            });
        } else if (target?.mode === "create") {
            setForm(emptyForm);
        }
    }, [target]);

    const updateField = (field: keyof typeof form, value: string) =>
        setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = () => {
        onSave({
            publisher_id: form.publisher_id ? Number(form.publisher_id) : undefined,
            year: form.year ? Number(form.year) : undefined,
            edition: form.edition.trim() || undefined,
            isbn: form.isbn.trim() || undefined,
            isbn_old: form.isbn_old.trim() || undefined,
            pages: form.pages ? Number(form.pages) : undefined,
            label: form.label.trim() || undefined,
            shelf: form.shelf.trim() || undefined
        });
    };

    return (
        <DialogRoot open={!!target} onOpenChange={(e) => !e.open && onClose()} size="md">
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
                        <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                                value={form.publisher_id}
                                onChange={(e) => updateField("publisher_id", e.target.value)}
                            >
                                <option value="">{t("noneOption")}</option>
                                {publishers.map((publisher) => (
                                    <option key={publisher.id} value={publisher.id}>
                                        {publisher.name}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
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
                            {t("cancelButton")}
                        </GhostButton>
                        <SimpleButton onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? <Spinner size="sm" /> : t("saveButton")}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
        </DialogRoot>
    );
}
