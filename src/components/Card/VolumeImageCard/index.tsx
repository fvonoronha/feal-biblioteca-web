"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Box, DialogBackdrop, DialogContent, DialogRoot, Image, Portal, Text, VStack, HStack } from "@chakra-ui/react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { LuExpand, LuX } from "react-icons/lu";
import { LabelBadge } from "components";
import { useScrollWiggleHint } from "hooks";
import { VolumeCardProps } from "types";
import { bookCover } from "assets";

const VolumeImageCard = (props: VolumeCardProps) => {
    const { volume } = props;
    const scrollRef = useRef<HTMLDivElement>(null);

    useScrollWiggleHint(scrollRef);

    const allImages = [volume.cover_url, ...(volume.images_url || [])].filter(Boolean);
    const images = allImages.length > 0 ? allImages : [bookCover.default.src];

    const [mainImage, setMainImage] = useState(images[0]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        setMainImage(images[0]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume.cover_url, volume.images_url]);

    const currentIndex = images.indexOf(mainImage);

    const goToImage = (direction: "prev" | "next") => {
        let newIndex = currentIndex;

        if (direction === "prev") {
            newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        } else {
            newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        }

        const newImage = images[newIndex];
        setMainImage(newImage);

        if (scrollRef.current) {
            const thumbnailWidth = 83; // 75px largura + 8px gap
            scrollRef.current.scrollTo({
                left: newIndex * thumbnailWidth - 75,
                behavior: "smooth"
            });
        }
    };

    // Setas do teclado navegam pelas imagens com o visualizador aberto, em loop - igual aos
    // botões, só que sem precisar mirar num alvo pequeno na tela.
    useEffect(() => {
        if (!isViewerOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") goToImage("prev");
            if (event.key === "ArrowRight") goToImage("next");
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isViewerOpen, currentIndex]);

    return (
        <VStack gap={2} w="100%" align="stretch">
            <Box
                aspectRatio={8 / 11}
                position="relative"
                overflow="hidden"
                borderRadius="lg"
                w="100%"
                cursor="zoom-in"
                border="2px solid"
                borderColor={{ base: "gray.200", _dark: "gray.600" }}
                onClick={() => setIsViewerOpen(true)}
                transition="all .2s"
                _hover={{ boxShadow: "2xl", borderColor: "fealRed.solid" }}
            >
                <Image src={mainImage} alt={volume.book?.title} objectFit="cover" w="100%" h="100%" />

                {volume.label && (
                    <Box position="absolute" bottom="6px" left="12px" zIndex="10">
                        <LabelBadge label={volume.label} size={"lg"} />
                    </Box>
                )}

                {/* Sempre visível (não só no hover) para funcionar igual no toque do celular -
                    é só um indicativo visual, quem recebe o clique é a imagem toda por trás. */}
                <Box
                    position="absolute"
                    top="10px"
                    right="10px"
                    zIndex="10"
                    p={2}
                    borderRadius="full"
                    bg="blackAlpha.600"
                    color="white"
                    pointerEvents="none"
                >
                    <LuExpand size={16} />
                </Box>
            </Box>

            {images.length > 1 && (
                <HStack position="relative" w="100%" gap={0}>
                    <Box
                        flexShrink={0}
                        p={2}
                        mr={1}
                        borderRadius="full"
                        color="fealRed.solid"
                        bg={{ base: "gray.100", _dark: "gray.700" }}
                        cursor="pointer"
                        onClick={() => goToImage("prev")}
                        _hover={{ bg: "fealRed.solid", color: "white" }}
                        transition="all .2s"
                    >
                        <FaChevronLeft size="16" />
                    </Box>

                    <HStack
                        ref={scrollRef}
                        flex={1}
                        overflowX="auto"
                        py={2}
                        gap={2}
                        css={{
                            "&::-webkit-scrollbar": { display: "none" },
                            msOverflowStyle: "none",
                            scrollbarWidth: "none"
                        }}
                    >
                        {images.map((img, index) => (
                            <Box
                                key={`${img}-${index}`}
                                aspectRatio={8 / 11}
                                minW="75px"
                                maxW="75px"
                                borderRadius="md"
                                overflow="hidden"
                                cursor="pointer"
                                border="2px solid"
                                borderColor={mainImage === img ? "fealRed.solid" : { base: "gray.200", _dark: "gray.600" }}
                                onClick={() => setMainImage(img)}
                                transition="all .2s"
                                _hover={{ transform: "translateY(-4px)" }}
                            >
                                <Image alt={volume.book?.title} src={img} w="100%" h="100%" objectFit="cover" />
                            </Box>
                        ))}
                    </HStack>

                    <Box
                        flexShrink={0}
                        p={2}
                        ml={1}
                        borderRadius="full"
                        color="fealRed.solid"
                        bg={{ base: "gray.100", _dark: "gray.700" }}
                        cursor="pointer"
                        onClick={() => goToImage("next")}
                        _hover={{ bg: "fealRed.solid", color: "white" }}
                        transition="all .2s"
                    >
                        <FaChevronRight size="16" />
                    </Box>
                </HStack>
            )}

            <DialogRoot lazyMount open={isViewerOpen} onOpenChange={(e) => setIsViewerOpen(e.open)}>
              <Portal>
                <DialogBackdrop bg="blackAlpha.900" backdropFilter="blur(6px)" />

                <DialogContent
                    position="fixed"
                    inset="0"
                    w="100vw"
                    h="100dvh"
                    maxW="100vw"
                    maxH="100dvh"
                    m={0}
                    borderRadius={0}
                    bg="transparent"
                    boxShadow="none"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        position="absolute"
                        top={{ base: "12px", md: "24px" }}
                        right={{ base: "12px", md: "24px" }}
                        zIndex={1}
                        p={2}
                        borderRadius="full"
                        bg="whiteAlpha.200"
                        color="white"
                        cursor="pointer"
                        _hover={{ bg: "whiteAlpha.400" }}
                        onClick={() => setIsViewerOpen(false)}
                    >
                        <LuX size={22} />
                    </Box>

                    <Image
                        src={mainImage}
                        alt={volume.book?.title}
                        objectFit="contain"
                        maxW="90vw"
                        maxH="85dvh"
                        borderRadius="md"
                    />

                    {images.length > 1 && (
                        <>
                            <Box
                                position="absolute"
                                left={{ base: "8px", md: "24px" }}
                                top="50%"
                                transform="translateY(-50%)"
                                p={3}
                                borderRadius="full"
                                bg="whiteAlpha.200"
                                color="white"
                                cursor="pointer"
                                _hover={{ bg: "whiteAlpha.400" }}
                                onClick={() => goToImage("prev")}
                            >
                                <FaChevronLeft size={22} />
                            </Box>

                            <Box
                                position="absolute"
                                right={{ base: "8px", md: "24px" }}
                                top="50%"
                                transform="translateY(-50%)"
                                p={3}
                                borderRadius="full"
                                bg="whiteAlpha.200"
                                color="white"
                                cursor="pointer"
                                _hover={{ bg: "whiteAlpha.400" }}
                                onClick={() => goToImage("next")}
                            >
                                <FaChevronRight size={22} />
                            </Box>

                            <Text
                                position="absolute"
                                bottom={{ base: "12px", md: "24px" }}
                                left="50%"
                                transform="translateX(-50%)"
                                color="white"
                                fontSize="sm"
                                bg="blackAlpha.600"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                {currentIndex + 1} / {images.length}
                            </Text>
                        </>
                    )}
                </DialogContent>
              </Portal>
            </DialogRoot>
        </VStack>
    );
};

export default memo(VolumeImageCard);
