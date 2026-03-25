"use client";

import { memo, useEffect, useState, useRef } from "react";
import { Card, VStack, Image, Text, Box, Flex, HStack } from "@chakra-ui/react";
import { BookCardProps } from "types";
import { useRouter } from "next/navigation";
import { LoanBadge, MultipleImagesBadge } from "components";
import { bookCover } from "assets";
import { LuLibraryBig } from "react-icons/lu";

const FIRST_IMAGE_SLIDE_TIME_IN_MS = 500;
const IMAGE_SLIDE_TIME_IN_MS = 3600;

const BookGridCardV2 = (props: BookCardProps) => {
    const { book } = props;
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const allImages = [book.cover_url, ...(book.images_url || [])].filter(Boolean);
    const images = allImages.length > 0 ? allImages : [bookCover.default.src];

    const startCarousel = () => {
        if (images.length <= 1) return;
        setIsHovered(true);
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex(1);
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, IMAGE_SLIDE_TIME_IN_MS);
        }, FIRST_IMAGE_SLIDE_TIME_IN_MS);
    };

    const stopCarousel = () => {
        setIsHovered(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCurrentIndex(0);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const clickBook = () => {
        router.push(`/b/${book.slug}`);
    };

    return (
        <Card.Root
            bg="none"
            boxShadow="none"
            border="none"
            w="100%"
            cursor="pointer"
            overflow="hidden"
            borderRadius="lg"
            onClick={clickBook}
            onMouseEnter={startCarousel}
            onMouseLeave={stopCarousel}
            transition="all .2s"
            _hover={{
                filter: "saturate(1.1) brightness(1.1)",
                transform: "scale(1.04)"
            }}
        >
            <Box aspectRatio={8 / 11} position="relative" overflow="hidden">
                <Flex
                    w={`${images.length * 100}%`}
                    h="100%"
                    transform={`translateX(-${(currentIndex * 100) / images.length}%)`}
                    transition={isHovered ? "transform 0.4s ease-in-out" : "none"}
                    willChange="transform"
                >
                    {images.map((imgSrc, index) => (
                        <Image
                            key={index}
                            borderRadius="lg"
                            src={imgSrc}
                            alt={`${book.title} - ${index}`}
                            objectFit="cover"
                            w={`${100 / images.length}%`}
                            h="100%"
                        />
                    ))}
                </Flex>

                {/*  Disponibilidade */}
                {book.loans?.length > 0 && (
                    <LoanBadge bookLoan={book.loans[0]} position="absolute" top="6px" left="6px" zIndex="1" />
                )}

                {/*Multiplas imagens */}
                {images?.length > 1 && !isHovered && (
                    <MultipleImagesBadge
                        images={(images || []) as string[]}
                        position="absolute"
                        top="6px"
                        right="6px"
                        zIndex="1"
                    />
                )}
            </Box>

            <Card.Body py="1" px="0">
                <VStack align="start" gap="0">
                    <HStack justifyContent="space-between" width="100%">
                        <HStack alignItems="center">
                            {book.label && (
                                <Text fontSize="xs" lineClamp="1">
                                    {book.label || ""}
                                </Text>
                            )}
                        </HStack>
                        {book.shelf && (
                            <HStack alignItems="center">
                                <Text fontSize="xs" lineClamp="1">
                                    {book.shelf || ""}
                                </Text>
                                <LuLibraryBig size="12" />
                            </HStack>
                        )}
                    </HStack>

                    <Text fontWeight="bold" fontSize="sm" lineClamp="2">
                        {book.title}
                    </Text>
                    <Text fontSize="xs" opacity={0.8} lineClamp="2">
                        {book.subtitle || book.description || book.publisher}
                    </Text>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default memo(BookGridCardV2);
