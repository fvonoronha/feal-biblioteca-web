"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    Badge,
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
    Portal,
    Separator,
    Spinner,
    Text,
    Textarea,
    VStack,
    Wrap
} from "@chakra-ui/react";
import { LuSparkles } from "react-icons/lu";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { BookPayload, GeminiBookSuggestion } from "endpoints";
import { Book } from "types";

interface Props {
    book: Book | null;
    suggestion: GeminiBookSuggestion | null;
    isLoading: boolean;
    error: string | null;
    isApplying: boolean;
    onClose: () => void;
    onApply: (bookPayload: Partial<BookPayload>, tagIds: number[] | null) => void;
}

type TextFieldKey = "summary" | "description" | "recommended_for";

const TEXT_FIELDS: TextFieldKey[] = ["summary", "description", "recommended_for"];

export default function GeminiSuggestDialog({ book, suggestion, isLoading, error, isApplying, onClose, onApply }: Props) {
    const t = useTranslations("AdminCatalog");

    const [selected, setSelected] = useState<Record<TextFieldKey, boolean>>({
        summary: false,
        description: false,
        recommended_for: false
    });
    const [editedText, setEditedText] = useState<Record<TextFieldKey, string>>({ summary: "", description: "", recommended_for: "" });
    const [applyKeywords, setApplyKeywords] = useState(false);
    const [editedKeywords, setEditedKeywords] = useState("");
    const [applyCategory, setApplyCategory] = useState(false);
    const [applyTags, setApplyTags] = useState(false);

    useEffect(() => {
        if (!suggestion) return;

        setSelected({
            summary: !!suggestion.summary,
            description: !!suggestion.description,
            recommended_for: !!suggestion.recommended_for
        });
        setEditedText({
            summary: suggestion.summary || "",
            description: suggestion.description || "",
            recommended_for: suggestion.recommended_for || ""
        });
        setApplyKeywords(suggestion.keywords.length > 0);
        setEditedKeywords(suggestion.keywords.join(", "));
        setApplyCategory(!!suggestion.category);
        setApplyTags(suggestion.tags.length > 0);
    }, [suggestion]);

    const isOpen = !!book;

    const handleApply = () => {
        if (!suggestion) return;

        const bookPayload: Partial<BookPayload> = {};

        TEXT_FIELDS.forEach((field) => {
            if (selected[field]) bookPayload[field] = editedText[field].trim();
        });

        if (applyKeywords) {
            bookPayload.keywords = editedKeywords
                .split(",")
                .map((keyword) => keyword.trim())
                .filter(Boolean);
        }

        if (applyCategory && suggestion.category) {
            bookPayload.category_id = suggestion.category.id;
        }

        const tagIds = applyTags && suggestion.tags.length > 0 ? suggestion.tags.map((tag) => tag.id) : null;

        onApply(bookPayload, tagIds);
    };

    const hasAnySelection =
        TEXT_FIELDS.some((field) => selected[field]) || applyKeywords || applyCategory || (applyTags && (suggestion?.tags.length || 0) > 0);

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
          <Portal>
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "6%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "900px" }}
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
                            {book?.title}
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

                            {TEXT_FIELDS.map((field) => (
                                <VStack key={field} align="stretch" gap={2}>
                                    <Separator />
                                    <Checkbox.Root
                                        checked={selected[field]}
                                        onCheckedChange={(e) => setSelected((prev) => ({ ...prev, [field]: !!e.checked }))}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label fontWeight="bold">{t(`geminiField_${field}`)}</Checkbox.Label>
                                    </Checkbox.Root>

                                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                        <VStack align="stretch" gap={1}>
                                            <Text fontSize="xs" color="fg.subtle">
                                                {t("geminiCurrentLabel")}
                                            </Text>
                                            <Text fontSize="sm" color="fg.muted" whiteSpace="pre-wrap">
                                                {(book && (book[field] as string)) || t("geminiEmptyValue")}
                                            </Text>
                                        </VStack>

                                        <VStack align="stretch" gap={1}>
                                            <Text fontSize="xs" color="fealRed.solid">
                                                {t("geminiSuggestedLabel")}
                                            </Text>
                                            <Textarea
                                                value={editedText[field]}
                                                onChange={(e) => setEditedText((prev) => ({ ...prev, [field]: e.target.value }))}
                                                variant="flushed"
                                                fontSize="sm"
                                                borderBottomWidth="2px"
                                                rows={3}
                                                disabled={!selected[field] || isApplying}
                                            />
                                        </VStack>
                                    </Grid>
                                </VStack>
                            ))}

                            <Separator />
                            <Checkbox.Root checked={applyKeywords} onCheckedChange={(e) => setApplyKeywords(!!e.checked)}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label fontWeight="bold">{t("geminiField_keywords")}</Checkbox.Label>
                            </Checkbox.Root>
                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="fg.subtle">
                                        {t("geminiCurrentLabel")}
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        {(book?.keywords || []).join(", ") || t("geminiEmptyValue")}
                                    </Text>
                                </VStack>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="fealRed.solid">
                                        {t("geminiSuggestedLabel")}
                                    </Text>
                                    <Input
                                        value={editedKeywords}
                                        onChange={(e) => setEditedKeywords(e.target.value)}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                        disabled={!applyKeywords || isApplying}
                                    />
                                </VStack>
                            </Grid>

                            {suggestion.category && (
                                <>
                                    <Separator />
                                    <Checkbox.Root checked={applyCategory} onCheckedChange={(e) => setApplyCategory(!!e.checked)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label fontWeight="bold">{t("geminiField_category")}</Checkbox.Label>
                                    </Checkbox.Root>
                                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                        <VStack align="stretch" gap={1}>
                                            <Text fontSize="xs" color="fg.subtle">
                                                {t("geminiCurrentLabel")}
                                            </Text>
                                            <Text fontSize="sm" color="fg.muted">
                                                {book?.category?.name || t("geminiEmptyValue")}
                                            </Text>
                                        </VStack>
                                        <VStack align="stretch" gap={1}>
                                            <Text fontSize="xs" color="fealRed.solid">
                                                {t("geminiSuggestedLabel")}
                                            </Text>
                                            <Badge colorPalette="red" size="lg" alignSelf="flex-start">
                                                {suggestion.category.name}
                                            </Badge>
                                        </VStack>
                                    </Grid>
                                </>
                            )}

                            {suggestion.tags.length > 0 && (
                                <>
                                    <Separator />
                                    <Checkbox.Root checked={applyTags} onCheckedChange={(e) => setApplyTags(!!e.checked)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label fontWeight="bold">{t("geminiField_tags")}</Checkbox.Label>
                                    </Checkbox.Root>
                                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                                        <VStack align="stretch" gap={1}>
                                            <Text fontSize="xs" color="fg.subtle">
                                                {t("geminiCurrentLabel")}
                                            </Text>
                                            <Wrap gap={1}>
                                                {(book?.tags || []).length > 0 ? (
                                                    book?.tags?.map((tag) => (
                                                        <Badge key={tag.id} colorPalette="gray" size="sm">
                                                            {tag.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Text fontSize="sm" color="fg.muted">
                                                        {t("geminiEmptyValue")}
                                                    </Text>
                                                )}
                                            </Wrap>
                                        </VStack>
                                        <VStack align="stretch" gap={1}>
                                            <Text fontSize="xs" color="fealRed.solid">
                                                {t("geminiSuggestedLabel")}
                                            </Text>
                                            <Wrap gap={1}>
                                                {suggestion.tags.map((tag) => (
                                                    <Badge key={tag.id} colorPalette="red" size="sm">
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </Wrap>
                                        </VStack>
                                    </Grid>
                                </>
                            )}

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
          </Portal>
        </DialogRoot>
    );
}
