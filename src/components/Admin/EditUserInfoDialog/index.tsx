"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DialogRoot, DialogBackdrop, DialogContent, VStack, HStack, Heading, Field, Input, Spinner } from "@chakra-ui/react";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { User } from "types";
import { maskPhone, getOnlyNumbers } from "utils";

interface Props {
    user: User | null;
    onClose: () => void;
    onSave: (payload: { name?: string; display_name?: string; email?: string; phone?: string }) => void;
    isSaving: boolean;
    errors: string[];
}

const emptyForm = { name: "", display_name: "", email: "", phone: "" };

export default function EditUserInfoDialog({ user, onClose, onSave, isSaving, errors }: Props) {
    const t = useTranslations("AdminUsers");
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                display_name: user.display_name || "",
                email: user.email || "",
                phone: user.phone ? maskPhone(user.phone) : ""
            });
        }
    }, [user]);

    const handleSubmit = () => {
        onSave({
            name: form.name.trim() || undefined,
            display_name: form.display_name.trim() || undefined,
            email: form.email.trim(),
            phone: getOnlyNumbers(form.phone) || undefined
        });
    };

    return (
        <DialogRoot open={!!user} onOpenChange={(e) => !e.open && onClose()} size="md">
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
                    <VStack align="start" gap={0}>
                        <Heading size="md">{t("editInfoTitle")}</Heading>
                        <Heading size="sm" color="fg.muted" fontWeight="normal">
                            {user?.name}
                        </Heading>
                    </VStack>

                    {errors.length > 0 && (
                        <VStack gap={2} align="stretch">
                            {errors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    <Field.Root>
                        <Field.Label>{t("fullNameLabel")}</Field.Label>
                        <Input
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("displayNameLabel")}</Field.Label>
                        <Input
                            value={form.display_name}
                            onChange={(event) => setForm((current) => ({ ...current, display_name: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("emailLabel")}</Field.Label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSaving}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("phoneLabel")}</Field.Label>
                        <Input
                            placeholder="(00) 00000-0000"
                            value={form.phone}
                            onChange={(event) => setForm((current) => ({ ...current, phone: maskPhone(event.target.value) }))}
                            inputMode="tel"
                            maxLength={15}
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
                        <SimpleButton onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? <Spinner size="sm" /> : t("saveButton")}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
        </DialogRoot>
    );
}
