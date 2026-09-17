"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    Portal,
    VStack,
    HStack,
    Heading,
    Field,
    Input,
    Textarea,
    Checkbox,
    Image,
    Spinner
} from "@chakra-ui/react";
import { AuthorImageManager, ErrorBanner, GhostButton, SimpleButton } from "components";
import { Author } from "types";
import { AuthorPayload } from "endpoints";
import { authorCover } from "assets";

interface Props {
    editingAuthor: Author | "new" | null;
    onClose: () => void;
    onSave: (payload: AuthorPayload) => void;
    isSaving: boolean;
    errors: string[];

    // Gerenciamento da foto via upload/recorte - só disponível editando um autor já existente
    // (o endpoint de upload precisa de um author_id válido) e só fornecido pela tela dedicada de
    // autores; o cadastro rápido (a partir do formulário de volume) não passa essas props, e
    // continua com o campo simples de URL abaixo.
    onUploadImage?: (blob: Blob) => Promise<boolean>;
    onClearImage?: () => Promise<boolean>;
    isUploadingImage?: boolean;
    imageError?: string | null;
}

const emptyForm = { name: "", description: "", avatar_url: "", is_spirit: false, birth_date: "", death_date: "" };

export default function AuthorFormDialog({
    editingAuthor,
    onClose,
    onSave,
    isSaving,
    errors,
    onUploadImage,
    onClearImage,
    isUploadingImage,
    imageError
}: Props) {
    const t = useTranslations("AdminAuthors");
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingAuthor && editingAuthor !== "new") {
            setForm({
                name: editingAuthor.name || "",
                description: editingAuthor.description || "",
                avatar_url: editingAuthor.avatar_url || "",
                is_spirit: !!editingAuthor.is_spirit,
                birth_date: editingAuthor.birth_date ? editingAuthor.birth_date.slice(0, 10) : "",
                death_date: editingAuthor.death_date ? editingAuthor.death_date.slice(0, 10) : ""
            });
        } else if (editingAuthor === "new") {
            setForm(emptyForm);
        }
    }, [editingAuthor]);

    const isOpen = !!editingAuthor;

    const handleSubmit = () => {
        onSave({
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            avatar_url: form.avatar_url.trim() || undefined,
            is_spirit: form.is_spirit,
            birth_date: form.birth_date || undefined,
            death_date: form.death_date || undefined
        });
    };

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg">
          <Portal>
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "8%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "560px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "85vh" }}
                overflowY="auto"
                p={{ base: 4, md: 6 }}
            >
                <VStack align="stretch" gap={4}>
                    <Heading size="md">{editingAuthor === "new" ? t("createTitle") : t("editTitle")}</Heading>

                    {errors.length > 0 && (
                        <VStack gap={2} align="stretch">
                            {errors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    {editingAuthor && editingAuthor !== "new" && onUploadImage && onClearImage ? (
                        <AuthorImageManager
                            avatarUrl={editingAuthor.avatar_url}
                            isBusy={!!isUploadingImage}
                            error={imageError ?? null}
                            onUploadImage={onUploadImage}
                            onClearImage={onClearImage}
                        />
                    ) : (
                        <HStack align="start" gap={4}>
                            <Image
                                src={form.avatar_url || authorCover.default.src}
                                alt=""
                                boxSize="72px"
                                borderRadius="full"
                                objectFit="cover"
                                flexShrink={0}
                                border="2px solid"
                                borderColor="gray.muted"
                            />

                            <Field.Root flex="1">
                                <Field.Label>{t("avatarUrlLabel")}</Field.Label>
                                <Input
                                    placeholder={t("avatarUrlPlaceholder")}
                                    value={form.avatar_url}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, avatar_url: event.target.value }))
                                    }
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                    disabled={isSaving}
                                />
                                <Field.HelperText>{t("avatarUrlHelper")}</Field.HelperText>
                            </Field.Root>
                        </HStack>
                    )}

                    <Field.Root required>
                        <Field.Label>
                            {t("nameLabel")}
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            placeholder={t("namePlaceholder")}
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("descriptionLabel")}</Field.Label>
                        <Textarea
                            placeholder={t("descriptionPlaceholder")}
                            value={form.description}
                            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            rows={5}
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <HStack gap={4} align="start" wrap="wrap">
                        <Field.Root flex="1" minW="160px">
                            <Field.Label>{t("birthDateLabel")}</Field.Label>
                            <Input
                                type="date"
                                value={form.birth_date}
                                onChange={(event) => setForm((current) => ({ ...current, birth_date: event.target.value }))}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                disabled={isSaving}
                            />
                        </Field.Root>

                        <Field.Root flex="1" minW="160px">
                            <Field.Label>{t("deathDateLabel")}</Field.Label>
                            <Input
                                type="date"
                                value={form.death_date}
                                onChange={(event) => setForm((current) => ({ ...current, death_date: event.target.value }))}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                disabled={isSaving}
                            />
                        </Field.Root>
                    </HStack>

                    <Checkbox.Root
                        checked={form.is_spirit}
                        onCheckedChange={(e) => setForm((current) => ({ ...current, is_spirit: !!e.checked }))}
                        disabled={isSaving}
                        cursor="pointer"
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control
                            cursor="pointer"
                            borderWidth="2px"
                            _checked={{ bg: "fealRed.solid", borderColor: "fealRed.solid", color: "white" }}
                        />
                        <Checkbox.Label cursor="pointer">{t("isSpiritLabel")}</Checkbox.Label>
                    </Checkbox.Root>

                    <HStack justify="flex-end" gap={3} pt={2}>
                        <GhostButton onClick={onClose} disabled={isSaving}>
                            {t("cancelButton")}
                        </GhostButton>
                        <SimpleButton onClick={handleSubmit} disabled={isSaving || !form.name.trim()}>
                            {isSaving ? <Spinner size="sm" /> : t("saveButton")}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
          </Portal>
        </DialogRoot>
    );
}
