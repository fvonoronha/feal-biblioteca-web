"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Grid, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuX } from "react-icons/lu";
import { GhostButton, VolumeImagePickerDialog } from "components";
import { Volume } from "types";
import { volumeCover } from "assets";

type ImageField = "cover" | "back" | "aux";

interface Props {
    volume: Volume;
    siblingVolumes: Volume[];
    isBusy: boolean;
    error: string | null;
    onUploadImage: (field: ImageField, blob: Blob) => Promise<boolean>;
    onSelectExistingImage: (field: ImageField, url: string) => Promise<boolean>;
    onClearImage: (field: "cover" | "back") => Promise<boolean>;
    onRemoveAuxImage: (url: string) => Promise<boolean>;
}

const ASPECT_RATIO = 800 / 1100;

export default function VolumeImageManager({
    volume,
    siblingVolumes,
    isBusy,
    error,
    onUploadImage,
    onSelectExistingImage,
    onClearImage,
    onRemoveAuxImage
}: Props) {
    const t = useTranslations("AdminCatalog");
    const [activeField, setActiveField] = useState<ImageField | null>(null);

    // Todas as imagens (capa/verso/auxiliares) já usadas em QUALQUER exemplar deste mesmo
    // livro - reaproveitadas como atalho na aba "Reaproveitar imagem" do seletor, pra não
    // precisar baixar de novo uma imagem que já está no acervo.
    const siblingImages = useMemo(() => {
        const urls = new Set<string>();
        siblingVolumes.forEach((sibling) => {
            if (sibling.cover_url) urls.add(sibling.cover_url);
            if (sibling.back_url) urls.add(sibling.back_url);
            (sibling.images_url || []).forEach((url) => urls.add(url));
        });
        return Array.from(urls);
    }, [siblingVolumes]);

    const pickerTitle =
        activeField === "cover"
            ? t("coverImageLabel")
            : activeField === "back"
              ? t("backImageLabel")
              : t("auxImagesLabel");

    const handleCropped = async (blob: Blob) => {
        if (!activeField) return;
        const success = await onUploadImage(activeField, blob);
        if (success) setActiveField(null);
    };

    const handleSelectExisting = async (url: string) => {
        if (!activeField) return;
        const success = await onSelectExistingImage(activeField, url);
        if (success) setActiveField(null);
    };

    return (
        <VStack align="stretch" gap={4} w="100%">
            <Text fontWeight="bold" fontSize="sm" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                {t("volumeImagesTitle")}
            </Text>

            <HStack gap={4} align="start" wrap="wrap">
                <ImageSlot
                    label={t("coverImageLabel")}
                    imageUrl={volume.cover_url}
                    onOpenPicker={() => setActiveField("cover")}
                    onClear={() => onClearImage("cover")}
                    isBusy={isBusy}
                />
                <ImageSlot
                    label={t("backImageLabel")}
                    imageUrl={volume.back_url}
                    onOpenPicker={() => setActiveField("back")}
                    onClear={() => onClearImage("back")}
                    isBusy={isBusy}
                />
            </HStack>

            <VStack align="stretch" gap={2}>
                <Text fontSize="sm" fontWeight="bold">
                    {t("auxImagesLabel")}
                </Text>
                <Grid templateColumns="repeat(auto-fill, minmax(80px, 1fr))" gap={3}>
                    {(volume.images_url || []).map((url) => (
                        <Box
                            key={url}
                            position="relative"
                            aspectRatio={ASPECT_RATIO}
                            borderRadius="md"
                            overflow="hidden"
                            border="2px solid"
                            borderColor={{ base: "gray.200", _dark: "gray.600" }}
                        >
                            <Image src={url} alt="" objectFit="cover" w="100%" h="100%" />
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
                                onClick={() => !isBusy && onRemoveAuxImage(url)}
                            >
                                <LuX size={12} />
                            </Box>
                        </Box>
                    ))}

                    <Box
                        aspectRatio={ASPECT_RATIO}
                        borderRadius="md"
                        border="2px dashed"
                        borderColor={{ base: "gray.300", _dark: "gray.600" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        color="fg.muted"
                        _hover={{ borderColor: "fealRed.solid", color: "fealRed.solid" }}
                        onClick={() => setActiveField("aux")}
                    >
                        <Icon>
                            <LuPlus size={20} />
                        </Icon>
                    </Box>
                </Grid>
            </VStack>

            <VolumeImagePickerDialog
                isOpen={!!activeField}
                title={pickerTitle}
                siblingImages={siblingImages}
                isSubmitting={isBusy}
                error={error}
                onClose={() => setActiveField(null)}
                onCropped={handleCropped}
                onSelectExisting={handleSelectExisting}
            />
        </VStack>
    );
}

function ImageSlot({
    label,
    imageUrl,
    onOpenPicker,
    onClear,
    isBusy
}: {
    label: string;
    imageUrl?: string;
    onOpenPicker: () => void;
    onClear: () => void;
    isBusy: boolean;
}) {
    return (
        <VStack align="center" gap={2}>
            <Box
                position="relative"
                w="110px"
                aspectRatio={ASPECT_RATIO}
                borderRadius="md"
                overflow="hidden"
                border="2px solid"
                borderColor={{ base: "gray.200", _dark: "gray.600" }}
            >
                <Image src={imageUrl || volumeCover.default.src} alt={label} objectFit="cover" w="100%" h="100%" />

                {imageUrl && (
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
                        onClick={() => !isBusy && onClear()}
                    >
                        <LuX size={12} />
                    </Box>
                )}
            </Box>

            <Text fontSize="xs" color="fg.muted">
                {label}
            </Text>

            <GhostButton size="xs" onClick={onOpenPicker} disabled={isBusy}>
                <LuPencil size={12} />
            </GhostButton>
        </VStack>
    );
}
