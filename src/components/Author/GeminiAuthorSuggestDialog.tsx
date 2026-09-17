"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    Center,
    Checkbox,
    DialogBackdrop,
    DialogContent,
    DialogRoot,
    Grid,
    HStack,
    Heading,
    Icon,
    Input,
    Separator,
    Spinner,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import { LuSparkles } from "react-icons/lu";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { AuthorPayload, GeminiAuthorSuggestion } from "endpoints";
import { Author } from "types";
import { parseDateFullText } from "utils";

interface Props {
    author: Author | null;
    suggestion: GeminiAuthorSuggestion | null;
    isLoading: boolean;
    error: string | null;
    isApplying: boolean;
    onClose: () => void;
    onApply: (authorPayload: Partial<AuthorPayload>) => void;
}

export default function GeminiAuthorSuggestDialog({
    author,
    suggestion,
    isLoading,
    error,
    isApplying,
    onClose,
    onApply
}: Props) {
    const t = useTranslations("AdminAuthors");

    const [applyDescription, setApplyDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState("");
    const [applyBirthDate, setApplyBirthDate] = useState(false);
    const [editedBirthDate, setEditedBirthDate] = useState("");
    const [applyDeathDate, setApplyDeathDate] = useState(false);
    const [editedDeathDate, setEditedDeathDate] = useState("");

    useEffect(() => {
        if (!suggestion) return;

        setApplyDescription(!!suggestion.description);
        setEditedDescription(suggestion.description || "");
        setApplyBirthDate(!!suggestion.birth_date);
        setEditedBirthDate(suggestion.birth_date || "");
        setApplyDeathDate(!!suggestion.death_date);
        setEditedDeathDate(suggestion.death_date || "");
    }, [suggestion]);

    const isOpen = !!author;

    const handleApply = () => {
        if (!suggestion) return;

        const authorPayload: Partial<AuthorPayload> = {};

        if (applyDescription) authorPayload.description = editedDescription.trim();
        if (applyBirthDate) authorPayload.birth_date = editedBirthDate;
        if (applyDeathDate) authorPayload.death_date = editedDeathDate;

        onApply(authorPayload);
    };

    const hasAnySelection = applyDescription || applyBirthDate || applyDeathDate;

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "6%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "700px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "88vh" }}
                overflowY="auto"
                p={{ base: 4, md: 6 }}
            >
                <VStack align="stretch" gap={4}>
                    <VStack align="start" gap={0}>
                        <HStack>
                            <Icon color="fealRed.solid">
                                <LuSparkles />
                            </Icon>
                            <Heading size="md">{t("geminiDialogTitle")}</Heading>
                        </HStack>
                        <Text fontSize="sm" color="fg.muted">
                            {author?.name}
                        </Text>
                    </VStack>

                    {isLoading ? (
                        <Center py={16}>
                            <VStack gap={3}>
                                <Spinner size="lg" color="fealRed.solid" />
                                <Text fontSize="sm" color="fg.muted">
                                    {t("geminiLoadingText")}
                                </Text>
                            </VStack>
                        </Center>
                    ) : error ? (
                        <VStack gap={3} align="stretch" py={6}>
                            <ErrorBanner message={error} />
                            <SimpleButton alignSelf="center" onClick={onClose}>
                                {t("cancelButton")}
                            </SimpleButton>
                        </VStack>
                    ) : suggestion ? (
                        <VStack align="stretch" gap={5}>
                            <Text fontSize="sm" color="fg.muted">
                                {t("geminiHint")}
                            </Text>

                            <VStack align="stretch" gap={2}>
                                <Separator />
                                <Checkbox.Root
                                    checked={applyDescription}
                                    onCheckedChange={(e) => setApplyDescription(!!e.checked)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label fontWeight="bold">{t("geminiField_description")}</Checkbox.Label>
                                </Checkbox.Root>

                                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                    <VStack align="stretch" gap={1}>
                                        <Text fontSize="xs" color="fg.subtle">
                                            {t("geminiCurrentLabel")}
                                        </Text>
                                        <Text fontSize="sm" color="fg.muted" whiteSpace="pre-wrap">
                                            {author?.description || t("geminiEmptyValue")}
                                        </Text>
                                    </VStack>

                                    <VStack align="stretch" gap={1}>
                                        <Text fontSize="xs" color="fealRed.solid">
                                            {t("geminiSuggestedLabel")}
                                        </Text>
                                        <Textarea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            variant="flushed"
                                            fontSize="sm"
                                            borderBottomWidth="2px"
                                            rows={6}
                                            disabled={!applyDescription || isApplying}
                                        />
                                    </VStack>
                                </Grid>
                            </VStack>

                            <Separator />
                            <Checkbox.Root
                                checked={applyBirthDate}
                                onCheckedChange={(e) => setApplyBirthDate(!!e.checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label fontWeight="bold">{t("birthDateLabel")}</Checkbox.Label>
                            </Checkbox.Root>
                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="fg.subtle">
                                        {t("geminiCurrentLabel")}
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        {author?.birth_date
                                            ? parseDateFullText(new Date(author.birth_date))
                                            : t("geminiEmptyValue")}
                                    </Text>
                                </VStack>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="fealRed.solid">
                                        {t("geminiSuggestedLabel")}
                                    </Text>
                                    <Input
                                        type="date"
                                        value={editedBirthDate}
                                        onChange={(e) => setEditedBirthDate(e.target.value)}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                        disabled={!applyBirthDate || isApplying}
                                    />
                                </VStack>
                            </Grid>

                            <Separator />
                            <Checkbox.Root
                                checked={applyDeathDate}
                                onCheckedChange={(e) => setApplyDeathDate(!!e.checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label fontWeight="bold">{t("deathDateLabel")}</Checkbox.Label>
                            </Checkbox.Root>
                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="fg.subtle">
                                        {t("geminiCurrentLabel")}
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        {author?.death_date
                                            ? parseDateFullText(new Date(author.death_date))
                                            : t("geminiEmptyValue")}
                                    </Text>
                                </VStack>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="fealRed.solid">
                                        {t("geminiSuggestedLabel")}
                                    </Text>
                                    <Input
                                        type="date"
                                        value={editedDeathDate}
                                        onChange={(e) => setEditedDeathDate(e.target.value)}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                        disabled={!applyDeathDate || isApplying}
                                    />
                                </VStack>
                            </Grid>

                            <HStack justify="flex-end" gap={3} pt={2}>
                                <GhostButton onClick={onClose} disabled={isApplying}>
                                    {t("cancelButton")}
                                </GhostButton>
                                <SimpleButton onClick={handleApply} disabled={isApplying || !hasAnySelection}>
                                    {isApplying ? <Spinner size="sm" /> : t("geminiApplyButton")}
                                </SimpleButton>
                            </HStack>
                        </VStack>
                    ) : null}
                </VStack>
            </DialogContent>
        </DialogRoot>
    );
}
