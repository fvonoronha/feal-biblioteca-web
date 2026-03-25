"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Image, Box, VStack, HStack } from "@chakra-ui/react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

import { BookCardProps } from "types";
import { bookCover } from "assets";

const BookImageCard = (props: BookCardProps) => {
    const { book } = props;
    const scrollRef = useRef<HTMLDivElement>(null);

    const HOVER_SCALE_FACTOR = "2.2";

    const allImages = [book.cover_url, ...(book.images_url || [])].filter(Boolean);
    const images = allImages.length > 0 ? allImages : [bookCover.default.src];

    const [mainImage, setMainImage] = useState(images[0]);
    const [zoomPos, setZoomPos] = useState({ x: "50%", y: "50%" });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        setMainImage(images[0]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [book.cover_url, book.images_url]);

    const currentIndex = images.indexOf(mainImage);

    const handleNavigation = (direction: "prev" | "next") => {
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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x: `${x}%`, y: `${y}%` });
    };

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
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                transition="all .2s"
                _hover={{ boxShadow: "2xl", borderColor: "fealRed" }}
            >
                <Image
                    src={mainImage}
                    alt={book.title}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    transition={isHovering ? "none" : "transform .3s ease-out"}
                    transform={isHovering ? `scale(${HOVER_SCALE_FACTOR})` : "scale(1)"}
                    transformOrigin={`${zoomPos.x} ${zoomPos.y}`}
                />
            </Box>

            {images.length > 1 && (
                <HStack position="relative" w="100%" gap={0}>
                    <Box
                        p={1}
                        color={"fealRed"}
                        cursor={"pointer"}
                        onClick={() => handleNavigation("prev")}
                        _hover={{ transform: "scale(1.2)" }}
                        transition="transform .2s"
                    >
                        <FaChevronLeft size="24" />
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
                                borderColor={mainImage === img ? "fealRed" : { base: "gray.200", _dark: "gray.600" }}
                                onClick={() => setMainImage(img)}
                                transition="all .2s"
                                _hover={{ transform: "translateY(-4px)" }}
                            >
                                <Image alt={book.title} src={img} w="100%" h="100%" objectFit="cover" />
                            </Box>
                        ))}
                    </HStack>

                    <Box
                        p={1}
                        color={"fealRed"}
                        cursor={"pointer"}
                        onClick={() => handleNavigation("next")}
                        _hover={{ transform: "scale(1.2)" }}
                        transition="transform .2s"
                    >
                        <FaChevronRight size="24" />
                    </Box>
                </HStack>
            )}
        </VStack>
    );
};

export default memo(BookImageCard);
