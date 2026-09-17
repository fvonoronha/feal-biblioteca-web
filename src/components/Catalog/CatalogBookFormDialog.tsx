"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DialogRoot, DialogBackdrop, DialogContent, Portal, VStack, HStack, Heading, Field, Input, Textarea, NativeSelect, Spinner } from "@chakra-ui/react";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { Book, Category } from "types";
import { BookPayload } from "endpoints";

interface Props {
    editingBook: Book | "new" | null;
    categories: Category[];
    onClose: () => void;
    onSave: (payload: BookPayload) => void;
    isSaving: boolean;
    errors: string[];
}

const emptyForm = {
    title: "",
    subtitle: "",
    category_id: "",
    summary: "",
    description: "",
    recommended_for: "",
    keywords: ""
};

export default function CatalogBookFormDialog({ editingBook, categories, onClose, onSave, isSaving, errors }: Props) {
    const t = useTranslations("AdminCatalog");
    const [form, setForm] = useState(emptyForm);

    const isOpen = !!editingBook;
    const isEdit = editingBook !== "new" && !!editingBook;

    useEffect(() => {
        if (editingBook === "new") {
            setForm(emptyForm);
        } else if (editingBook) {
            setForm({
                title: editingBook.title || "",
                subtitle: editingBook.subtitle || "",
                category_id: editingBook.category ? String(editingBook.category.id) : "",
                summary: editingBook.summary || "",
                description: editingBook.description || "",
                recommended_for: editingBook.recommended_for || "",
                keywords: (editingBook.keywords || []).join(", ")
            });
        }
    }, [editingBook]);

    const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = () => {
        const keywords = form.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean);

        onSave({
            title: form.title.trim(),
            subtitle: form.subtitle.trim() || undefined,
            category_id: form.category_id ? Number(form.category_id) : undefined,
            summary: form.summary.trim() || undefined,
            description: form.description.trim() || undefined,
            recommended_for: form.recommended_for.trim() || undefined,
            keywords
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
                width={{ base: "calc(100vw - 24px)", md: "600px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "85vh" }}
                overflowY="auto"
                p={{ base: 4, md: 6 }}
            >
                <VStack align="stretch" gap={4}>
                    <VStack align="start" gap={0}>
                        <Heading size="md">{isEdit ? t("editBookTitle") : t("createBookTitle")}</Heading>
                        <Heading size="xs" fontWeight="normal" color="fg.muted">
                            {t("bookFormHint")}
                        </Heading>
                    </VStack>

                    {errors.length > 0 && (
                        <VStack gap={2} align="stretch">
                            {errors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    <Field.Root required>
                        <Field.Label>
                            {t("titleLabel")}
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            value={form.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                            autoFocus
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("subtitleLabel")}</Field.Label>
                        <Input
                            value={form.subtitle}
                            onChange={(e) => updateField("subtitle", e.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("categoryLabel")}</Field.Label>
                        <NativeSelect.Root size="sm">
                            <NativeSelect.Field value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)}>
                                <option value="">{t("noneOption")}</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("summaryLabel")}</Field.Label>
                        <Textarea
                            value={form.summary}
                            onChange={(e) => updateField("summary", e.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            rows={3}
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("descriptionLabel")}</Field.Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            rows={4}
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("recommendedForLabel")}</Field.Label>
                        <Textarea
                            value={form.recommended_for}
                            onChange={(e) => updateField("recommended_for", e.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            rows={2}
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("keywordsLabel")}</Field.Label>
                        <Input
                            placeholder={t("keywordsPlaceholder")}
                            value={form.keywords}
                            onChange={(e) => updateField("keywords", e.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <HStack justify="flex-end" gap={3} pt={2}>
                        <GhostButton onClick={onClose} disabled={isSaving}>
                            {t("cancelButton")}
                        </GhostButton>
                        <SimpleButton onClick={handleSubmit} disabled={isSaving || !form.title.trim()}>
                            {isSaving ? <Spinner size="sm" /> : t("saveButton")}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
          </Portal>
        </DialogRoot>
    );
}
