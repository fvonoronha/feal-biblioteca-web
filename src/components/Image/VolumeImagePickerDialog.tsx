"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
    Box,
    DialogBackdrop,
    DialogContent,
    DialogRoot,
    Grid,
    HStack,
    Heading,
    Icon,
    Image,
    Input,
    Separator,
    Spinner,
    Tabs,
    Text,
    VStack
} from "@chakra-ui/react";
import Cropper, { Area, Point } from "react-easy-crop";
import { LuLink, LuUpload, LuImages } from "react-icons/lu";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { fetchImageFromUrl } from "endpoints";
import { getCroppedImageBlob } from "utils";

const OUTPUT_WIDTH = 800;
const OUTPUT_HEIGHT = 1100;
const ASPECT_RATIO = OUTPUT_WIDTH / OUTPUT_HEIGHT;

interface Props {
    isOpen: boolean;
    title: string;
    siblingImages: string[];
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onCropped: (blob: Blob) => void;
    onSelectExisting: (url: string) => void;
}

export default function VolumeImagePickerDialog({
    isOpen,
    title,
    siblingImages,
    isSubmitting,
    error,
    onClose,
    onCropped,
    onSelectExisting
}: Props) {
    const t = useTranslations("AdminCatalog");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [urlInput, setUrlInput] = useState("");
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const resetAndClose = () => {
        if (isSubmitting) return;
        setUrlInput("");
        setLocalError(null);
        setPendingImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        onClose();
    };

    const handleLoadFromUrl = async () => {
        if (!urlInput.trim() || isFetchingUrl) return;
        setLocalError(null);
        setIsFetchingUrl(true);

        try {
            const dataUrl = await fetchImageFromUrl(urlInput.trim());
            if (!dataUrl) throw new Error("empty response");
            setPendingImageSrc(dataUrl);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (fetchError: any) {
            const apiErrors = fetchError?.response?.data?.body?.image?.error;
            setLocalError(Array.isArray(apiErrors) ? apiErrors[0]?.message : t("imagePickerGenericError"));
        } finally {
            setIsFetchingUrl(false);
        }
    };

    const handleFileSelected = (file: File | undefined) => {
        if (!file) return;
        setLocalError(null);
        setPendingImageSrc(URL.createObjectURL(file));
    };

    const handleConfirmCrop = async () => {
        if (!pendingImageSrc || !croppedAreaPixels) return;
        setLocalError(null);

        try {
            const blob = await getCroppedImageBlob(pendingImageSrc, croppedAreaPixels, OUTPUT_WIDTH, OUTPUT_HEIGHT);
            onCropped(blob);
        } catch {
            setLocalError(t("imagePickerGenericError"));
        }
    };

    const handleBackToPicker = () => {
        setPendingImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const displayedError = error || localError;

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && resetAndClose()} size="lg">
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "8%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "620px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "85vh" }}
                overflowY="auto"
                p={{ base: 4, md: 6 }}
            >
                <VStack align="stretch" gap={4}>
                    <Heading size="md">{title}</Heading>

                    {displayedError && <ErrorBanner message={displayedError} />}

                    {pendingImageSrc ? (
                        <VStack align="stretch" gap={4}>
                            <Text fontSize="sm" color="fg.muted">
                                {t("imagePickerCropHint")}
                            </Text>

                            <Box position="relative" w="100%" h="360px" bg="black" borderRadius="md" overflow="hidden">
                                <Cropper
                                    image={pendingImageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={ASPECT_RATIO}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(_area, areaPixels) => setCroppedAreaPixels(areaPixels)}
                                />
                            </Box>

                            <HStack gap={3}>
                                <Text fontSize="xs" color="fg.muted" flexShrink={0}>
                                    {t("imagePickerZoomLabel")}
                                </Text>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.05}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    style={{ width: "100%" }}
                                    disabled={isSubmitting}
                                />
                            </HStack>

                            <HStack justify="flex-end" gap={3} pt={2}>
                                <GhostButton onClick={handleBackToPicker} disabled={isSubmitting}>
                                    {t("imagePickerCropCancel")}
                                </GhostButton>
                                <SimpleButton onClick={handleConfirmCrop} disabled={isSubmitting || !croppedAreaPixels}>
                                    {isSubmitting ? <Spinner size="sm" /> : t("imagePickerCropConfirm")}
                                </SimpleButton>
                            </HStack>
                        </VStack>
                    ) : (
                        <Tabs.Root defaultValue="url" colorPalette="fealRed" variant="line">
                            <Tabs.List>
                                <Tabs.Trigger value="url">
                                    <Icon>
                                        <LuLink />
                                    </Icon>
                                    {t("imagePickerTabUrl")}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="upload">
                                    <Icon>
                                        <LuUpload />
                                    </Icon>
                                    {t("imagePickerTabUpload")}
                                </Tabs.Trigger>
                                {siblingImages.length > 0 && (
                                    <Tabs.Trigger value="reuse">
                                        <Icon>
                                            <LuImages />
                                        </Icon>
                                        {t("imagePickerTabReuse")}
                                    </Tabs.Trigger>
                                )}
                            </Tabs.List>

                            <Tabs.Content value="url">
                                <VStack align="stretch" gap={3} pt={2}>
                                    <Text fontSize="sm" color="fg.muted">
                                        {t("imagePickerUrlHint")}
                                    </Text>
                                    <HStack>
                                        <Input
                                            placeholder={t("imagePickerUrlPlaceholder")}
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            variant="flushed"
                                            fontSize="sm"
                                            borderBottomWidth="2px"
                                            disabled={isFetchingUrl}
                                            onKeyDown={(e) => e.key === "Enter" && handleLoadFromUrl()}
                                        />
                                        <SimpleButton
                                            onClick={handleLoadFromUrl}
                                            disabled={!urlInput.trim() || isFetchingUrl}
                                            flexShrink={0}
                                        >
                                            {isFetchingUrl ? <Spinner size="sm" /> : t("imagePickerUrlButton")}
                                        </SimpleButton>
                                    </HStack>
                                </VStack>
                            </Tabs.Content>

                            <Tabs.Content value="upload">
                                <VStack align="stretch" gap={3} pt={2}>
                                    <Text fontSize="sm" color="fg.muted">
                                        {t("imagePickerUploadHint")}
                                    </Text>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileSelected(e.target.files?.[0])}
                                    />
                                    <SimpleButton onClick={() => fileInputRef.current?.click()} alignSelf="start">
                                        {t("imagePickerUploadButton")}
                                    </SimpleButton>
                                </VStack>
                            </Tabs.Content>

                            {siblingImages.length > 0 && (
                                <Tabs.Content value="reuse">
                                    <VStack align="stretch" gap={3} pt={2}>
                                        <Text fontSize="sm" color="fg.muted">
                                            {t("imagePickerReuseHint")}
                                        </Text>
                                        <Grid
                                            templateColumns="repeat(auto-fill, minmax(80px, 1fr))"
                                            gap={3}
                                            opacity={isSubmitting ? 0.5 : 1}
                                            pointerEvents={isSubmitting ? "none" : "auto"}
                                        >
                                            {siblingImages.map((url) => (
                                                <Box
                                                    key={url}
                                                    position="relative"
                                                    aspectRatio={ASPECT_RATIO}
                                                    borderRadius="md"
                                                    overflow="hidden"
                                                    border="2px solid"
                                                    borderColor={{ base: "gray.200", _dark: "gray.600" }}
                                                    cursor="pointer"
                                                    _hover={{ borderColor: "fealRed.solid" }}
                                                    onClick={() => onSelectExisting(url)}
                                                >
                                                    <Image src={url} alt="" objectFit="cover" w="100%" h="100%" />
                                                </Box>
                                            ))}
                                        </Grid>
                                    </VStack>
                                </Tabs.Content>
                            )}
                        </Tabs.Root>
                    )}

                    {!pendingImageSrc && (
                        <>
                            <Separator />
                            <HStack justify="flex-end">
                                <GhostButton onClick={resetAndClose} disabled={isSubmitting}>
                                    {t("imagePickerCancelButton")}
                                </GhostButton>
                            </HStack>
                        </>
                    )}
                </VStack>
            </DialogContent>
        </DialogRoot>
    );
}
