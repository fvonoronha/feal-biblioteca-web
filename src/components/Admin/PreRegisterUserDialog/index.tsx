"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DialogRoot, DialogBackdrop, DialogContent, Portal, VStack, HStack, Heading, Field, Input, Spinner } from "@chakra-ui/react";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { getOnlyNumbers, isCPFValid, maskCPF, maskPhone } from "utils";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: { name: string; phone: string; document: string }) => void;
    isSubmitting: boolean;
    errors: string[];
}

const emptyForm = { name: "", phone: "", document: "" };

export default function PreRegisterUserDialog({ open, onClose, onSubmit, isSubmitting, errors }: Props) {
    const t = useTranslations("AdminUsers");
    const [form, setForm] = useState(emptyForm);
    const [localErrors, setLocalErrors] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setForm(emptyForm);
            setLocalErrors([]);
        }
    }, [open]);

    const handleSubmit = () => {
        const validationErrors: string[] = [];
        if (!form.name.trim()) validationErrors.push(t("validationFullNameRequired"));

        const document = getOnlyNumbers(form.document);
        if (!document) validationErrors.push(t("validationCpfRequired"));
        else if (!isCPFValid(document)) validationErrors.push(t("validationCpfInvalid"));

        const phone = getOnlyNumbers(form.phone);
        if (!phone) validationErrors.push(t("validationPhoneRequired"));
        else if (phone.length < 10) validationErrors.push(t("validationPhoneInvalid"));

        setLocalErrors(validationErrors);
        if (validationErrors.length > 0) return;

        onSubmit({ name: form.name.trim(), phone, document });
    };

    return (
        <DialogRoot open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
          <Portal>
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
                    <Heading size="md">{t("preRegisterTitle")}</Heading>

                    {(errors.length > 0 || localErrors.length > 0) && (
                        <VStack gap={2} align="stretch">
                            {[...localErrors, ...errors].map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    <Field.Root required>
                        <Field.Label>
                            {t("fullNameLabel")}
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            placeholder={t("fullNamePlaceholder")}
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            disabled={isSubmitting}
                        />
                    </Field.Root>

                    <HStack gap={4} align="start" wrap="wrap">
                        <Field.Root flex="1" minW="180px" required>
                            <Field.Label>
                                {t("phoneLabel")}
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={form.phone}
                                onChange={(event) => setForm((current) => ({ ...current, phone: maskPhone(event.target.value) }))}
                                inputMode="tel"
                                maxLength={15}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                disabled={isSubmitting}
                            />
                        </Field.Root>

                        <Field.Root flex="1" minW="180px" required>
                            <Field.Label>
                                {t("cpfLabel")}
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                placeholder="000.000.000-00"
                                value={form.document}
                                onChange={(event) => setForm((current) => ({ ...current, document: maskCPF(event.target.value) }))}
                                inputMode="numeric"
                                maxLength={14}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                disabled={isSubmitting}
                            />
                        </Field.Root>
                    </HStack>

                    <HStack justify="flex-end" gap={3} pt={2}>
                        <GhostButton onClick={onClose} disabled={isSubmitting}>
                            {t("cancelButton")}
                        </GhostButton>
                        <SimpleButton onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size="sm" /> : t("preRegisterSubmit")}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
          </Portal>
        </DialogRoot>
    );
}
