"use client";

import { memo } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { EntityGrid, LabelBadge, BookCoverFlip } from "components";
import { Volume } from "types";

interface Props {
    volumes: Volume[];
}

/**
 * Mostra outros exemplares/edições do mesmo livro quando o volume que o usuário está vendo
 * está indisponível - a ideia é que ele nunca fique "sem saída": se esta cópia está
 * emprestada, outra pode estar livre agora mesmo.
 */
function VolumeSiblingVolumes({ volumes }: Props) {
    const t = useTranslations("VolumeDetails");
    const router = useRouter();

    return (
        <Box w="100%">
            <Text fontWeight="bold" fontSize="sm" pb={2} color="fg.muted">
                {t("siblingVolumesTitle")}
            </Text>

            <EntityGrid variant="scroll" eWidth="90px" loadingFailed={false}>
                {volumes.map((sibling) => (
                    <VStack
                        key={sibling.id}
                        align="center"
                        gap={1}
                        cursor="pointer"
                        onClick={() => router.push(`/v/${sibling.slug}`)}
                    >
                        <Box
                            w="90px"
                            borderRadius="md"
                            border="2px solid"
                            borderColor={sibling.is_available ? "green.400" : { base: "gray.200", _dark: "gray.600" }}
                        >
                            <BookCoverFlip coverUrl={sibling.cover_url} alt={sibling.book?.title || ""} w="100%">
                                {() =>
                                    sibling.label && (
                                        <Box
                                            position="absolute"
                                            bottom="4px"
                                            left="4px"
                                            zIndex="10"
                                            transform="translateZ(10px)"
                                        >
                                            <LabelBadge label={sibling.label} size="sm" />
                                        </Box>
                                    )
                                }
                            </BookCoverFlip>
                        </Box>

                        <HStack gap={1}>
                            <Box
                                boxSize="7px"
                                borderRadius="full"
                                bg={sibling.is_available ? "green.400" : "fealRed.solid"}
                            />
                            <Text fontSize="xs" color="fg.muted">
                                {sibling.is_available ? t("siblingAvailable") : t("siblingUnavailable")}
                            </Text>
                        </HStack>
                    </VStack>
                ))}
            </EntityGrid>
        </Box>
    );
}

export default memo(VolumeSiblingVolumes);
