"use client";

import { Box, Card, Center, HStack, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { LuSearch, LuBookOpen, LuX } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { GhostButton, LabelBadge, ShelfBadge, BookCoverFlip } from "components";
import { Volume } from "types";

interface Props {
    query: string;
    onQueryChange: (value: string) => void;
    volumes: Volume[];
    isLoading: boolean;
    selectedVolume: Volume | null;
    onSelectVolume: (volume: Volume) => void;
    onClearVolume: () => void;
}

export function VolumeLoanPicker({
    query,
    onQueryChange,
    volumes,
    isLoading,
    selectedVolume,
    onSelectVolume,
    onClearVolume
}: Props) {
    const t = useTranslations("NewLoanPage");

    if (selectedVolume) {
        return (
            <Card.Root variant="outline" w="100%">
                <Card.Body p={4}>
                    <HStack align="start" gap={3}>
                        <BookCoverFlip coverUrl={selectedVolume.cover_url} alt={selectedVolume.book?.title || ""} w="56px" />

                        <VStack align="start" gap={1} flex={1} minW={0}>
                            <Text fontWeight="bold" lineClamp={2}>
                                {selectedVolume.book?.title}
                            </Text>

                            <HStack wrap="wrap" gap={2}>
                                {selectedVolume.label && <LabelBadge label={selectedVolume.label} size="sm" />}
                                {selectedVolume.shelf && <ShelfBadge shelf={selectedVolume.shelf} />}
                            </HStack>

                            {selectedVolume.publisher?.name && (
                                <Text fontSize="xs" color="fg.muted">
                                    {selectedVolume.publisher.name}
                                </Text>
                            )}
                        </VStack>

                        <GhostButton size="sm" p={2} flexShrink={0} onClick={onClearVolume}>
                            <LuX /> {t("changeButton")}
                        </GhostButton>
                    </HStack>
                </Card.Body>
            </Card.Root>
        );
    }

    return (
        <VStack align="stretch" gap={3} w="100%" flex="1">
            <HStack borderBottomWidth="2px" borderColor="border" pb={1} px={1}>
                <LuSearch color="gray" />
                <Input
                    placeholder={t("searchVolumePlaceholder")}
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    variant="flushed"
                    fontSize="sm"
                    border="none"
                    _focus={{ boxShadow: "none" }}
                    autoComplete="off"
                />
            </HStack>

            {isLoading && (
                <Center py={4}>
                    <Spinner size="sm" />
                </Center>
            )}

            {!isLoading && query.trim() !== "" && volumes.length === 0 && (
                <Text fontSize="sm" color="fg.muted" textAlign="center" py={2}>
                    {t("noVolumesFound")}
                </Text>
            )}

            {!isLoading && query.trim() === "" && (
                <Text fontSize="sm" color="fg.muted" textAlign="center" py={2}>
                    {t("searchVolumeHint")}
                </Text>
            )}

            {!isLoading && volumes.length > 0 && (
                <VStack align="stretch" gap={1} maxH="300px" overflowY="auto">
                    {volumes.map((volume) => {
                        const isUnavailable = volume.is_available === false;
                        return (
                            <HStack
                                key={volume.id}
                                p={2}
                                borderRadius="md"
                                cursor="pointer"
                                opacity={isUnavailable ? 0.6 : 1}
                                _hover={{ bg: "gray.subtle" }}
                                onClick={() => onSelectVolume(volume)}
                            >
                                <BookCoverFlip coverUrl={volume.cover_url} alt={volume.book?.title || ""} w="36px" />

                                <VStack align="start" gap={0} flex={1} minW={0}>
                                    <Text fontWeight="bold" fontSize="sm" lineClamp={1}>
                                        {volume.book?.title}
                                    </Text>
                                    <HStack gap={1}>
                                        {volume.label && (
                                            <Text fontSize="xs" color="fg.muted" lineClamp={1}>
                                                {volume.label}
                                            </Text>
                                        )}
                                        {volume.publisher?.name && (
                                            <Text fontSize="xs" color="fg.muted" lineClamp={1}>
                                                • {volume.publisher.name}
                                            </Text>
                                        )}
                                    </HStack>
                                </VStack>

                                {isUnavailable ? (
                                    <Text fontSize="xs" fontWeight="bold" color="fealRed.solid" flexShrink={0}>
                                        {t("volumeUnavailableBadge")}
                                    </Text>
                                ) : (
                                    <Box flexShrink={0} color="gray.400">
                                        <LuBookOpen size={16} />
                                    </Box>
                                )}
                            </HStack>
                        );
                    })}
                </VStack>
            )}
        </VStack>
    );
}
