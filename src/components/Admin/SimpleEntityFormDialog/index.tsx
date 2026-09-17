"use client";

import { useEffect, useState } from "react";
import { DialogRoot, DialogBackdrop, DialogContent, VStack, HStack, Heading, Field, Input, Textarea, Spinner } from "@chakra-ui/react";
import { ErrorBanner, GhostButton, SimpleButton } from "components";

interface EntityLike {
    name: string;
    description?: string;
}

interface Props<T extends EntityLike> {
    editingItem: T | "new" | null;
    onClose: () => void;
    onSave: (payload: { name: string; description?: string }) => void;
    isSaving: boolean;
    errors: string[];
    createTitle: string;
    editTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    cancelLabel: string;
    saveLabel: string;
}

const emptyForm = { name: "", description: "" };

/**
 * Formulário compartilhado por categorias e temas - os dois têm exatamente os mesmos campos
 * (nome + descrição), então uma tela genérica evita duas cópias quase idênticas do mesmo
 * diálogo. Editora usa um formulário próprio (tem campos extras).
 */
export default function SimpleEntityFormDialog<T extends EntityLike>({
    editingItem,
    onClose,
    onSave,
    isSaving,
    errors,
    createTitle,
    editTitle,
    nameLabel,
    namePlaceholder,
    descriptionLabel,
    descriptionPlaceholder,
    cancelLabel,
    saveLabel
}: Props<T>) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingItem === "new") {
            setForm(emptyForm);
        } else if (editingItem) {
            setForm({ name: editingItem.name || "", description: editingItem.description || "" });
        }
    }, [editingItem]);

    const isOpen = !!editingItem;

    const handleSubmit = () => {
        onSave({ name: form.name.trim(), description: form.description.trim() || undefined });
    };

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="md">
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "10%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "480px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "85vh" }}
                overflowY="auto"
                p={{ base: 4, md: 6 }}
            >
                <VStack align="stretch" gap={4}>
                    <Heading size="md">{editingItem === "new" ? createTitle : editTitle}</Heading>

                    {errors.length > 0 && (
                        <VStack gap={2} align="stretch">
                            {errors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    <Field.Root required>
                        <Field.Label>
                            {nameLabel}
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            placeholder={namePlaceholder}
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{descriptionLabel}</Field.Label>
                        <Textarea
                            placeholder={descriptionPlaceholder}
                            value={form.description}
                            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            rows={4}
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <HStack justify="flex-end" gap={3} pt={2}>
                        <GhostButton onClick={onClose} disabled={isSaving}>
                            {cancelLabel}
                        </GhostButton>
                        <SimpleButton onClick={handleSubmit} disabled={isSaving || !form.name.trim()}>
                            {isSaving ? <Spinner size="sm" /> : saveLabel}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
        </DialogRoot>
    );
}
