"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DialogRoot, DialogBackdrop, DialogContent, Portal, VStack, HStack, Heading, Field, Input, Textarea, Image, Spinner } from "@chakra-ui/react";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { Publisher } from "types";
import { PublisherPayload } from "endpoints";
import { volumeCover } from "assets";

interface Props {
    editingItem: Publisher | "new" | null;
    onClose: () => void;
    onSave: (payload: PublisherPayload) => void;
    isSaving: boolean;
    errors: string[];
}

const emptyForm = { name: "", abbreviation: "", description: "", avatar_url: "" };

export default function PublisherFormDialog({ editingItem, onClose, onSave, isSaving, errors }: Props) {
    const t = useTranslations("AdminPublishers");
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingItem === "new") {
            setForm(emptyForm);
        } else if (editingItem) {
            setForm({
                name: editingItem.name || "",
                abbreviation: editingItem.abbreviation || "",
                description: editingItem.description || "",
                avatar_url: editingItem.avatar_url || ""
            });
        }
    }, [editingItem]);

    const isOpen = !!editingItem;

    const handleSubmit = () => {
        onSave({
            name: form.name.trim(),
            abbreviation: form.abbreviation.trim() || undefined,
            description: form.description.trim() || undefined,
            avatar_url: form.avatar_url.trim() || undefined
        });
    };

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="md">
          <Portal>
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "10%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "520px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "85vh" }}
                overflowY="auto"
                p={{ base: 4, md: 6 }}
            >
                <VStack align="stretch" gap={4}>
                    <Heading size="md">{editingItem === "new" ? t("createTitle") : t("editTitle")}</Heading>

                    {errors.length > 0 && (
                        <VStack gap={2} align="stretch">
                            {errors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    <HStack align="start" gap={4}>
                        <Image
                            src={form.avatar_url || volumeCover.default.src}
                            alt=""
                            boxSize="64px"
                            borderRadius="md"
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
                                onChange={(event) => setForm((current) => ({ ...current, avatar_url: event.target.value }))}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                disabled={isSaving}
                            />
                        </Field.Root>
                    </HStack>

                    <HStack gap={4} align="start" wrap="wrap">
                        <Field.Root required flex="2" minW="180px">
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

                        <Field.Root flex="1" minW="100px">
                            <Field.Label>{t("abbreviationLabel")}</Field.Label>
                            <Input
                                placeholder={t("abbreviationPlaceholder")}
                                value={form.abbreviation}
                                onChange={(event) => setForm((current) => ({ ...current, abbreviation: event.target.value }))}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                disabled={isSaving}
                            />
                        </Field.Root>
                    </HStack>

                    <Field.Root>
                        <Field.Label>{t("descriptionLabel")}</Field.Label>
                        <Textarea
                            placeholder={t("descriptionPlaceholder")}
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
