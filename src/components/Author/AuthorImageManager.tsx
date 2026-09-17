"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { LuPencil, LuX } from "react-icons/lu";
import { GhostButton, VolumeImagePickerDialog } from "components";
import { authorCover } from "assets";

interface Props {
    avatarUrl?: string;
    isBusy: boolean;
    error: string | null;
    onUploadImage: (blob: Blob) => Promise<boolean>;
    onClearImage: () => Promise<boolean>;
}

const AVATAR_SIZE = 800;

// Gerenciamento da foto do autor - mesmo padrão do VolumeImageManager (recorte via
// VolumeImagePickerDialog, salva imediatamente no servidor), só que com um único slot e
// proporção quadrada (800x800, ver AVATAR_SIZE em author.service.js).
export default function AuthorImageManager({ avatarUrl, isBusy, error, onUploadImage, onClearImage }: Props) {
    const t = useTranslations("AdminAuthors");
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleCropped = async (blob: Blob) => {
        const success = await onUploadImage(blob);
        if (success) setIsPickerOpen(false);
    };

    return (
        <VStack align="stretch" gap={3} w="100%">
            <Text fontWeight="bold" fontSize="sm" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                {t("avatarImageTitle")}
            </Text>

            <VStack align="center" gap={2}>
                <Box
                    position="relative"
                    w="110px"
                    aspectRatio={1}
                    borderRadius="full"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={{ base: "gray.200", _dark: "gray.600" }}
                >
                    <Image src={avatarUrl || authorCover.default.src} alt="" objectFit="cover" w="100%" h="100%" />

                    {avatarUrl && (
                        <Box
                            position="absolute"
                            top="2px"
                            right="2px"
                            p="3px"
                            borderRadius="full"
                            bg="blackAlpha.700"
                            color="white"
                            cursor="pointer"
                            _hover={{ bg: "fealRed.solid" }}
                            onClick={() => !isBusy && onClearImage()}
                        >
                            <LuX size={12} />
                        </Box>
                    )}
                </Box>

                <GhostButton size="xs" onClick={() => setIsPickerOpen(true)} disabled={isBusy}>
                    <LuPencil size={12} />
                </GhostButton>
            </VStack>

            <VolumeImagePickerDialog
                isOpen={isPickerOpen}
                title={t("avatarImageTitle")}
                siblingImages={[]}
                isSubmitting={isBusy}
                error={error}
                outputWidth={AVATAR_SIZE}
                outputHeight={AVATAR_SIZE}
                onClose={() => setIsPickerOpen(false)}
                onCropped={handleCropped}
                onSelectExisting={() => {}}
            />
        </VStack>
    );
}
