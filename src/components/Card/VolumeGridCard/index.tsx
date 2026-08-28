"use client";

import { memo, useState } from "react";
import { Card, VStack, Image, Text, Box, HStack } from "@chakra-ui/react";
import { VolumeCardProps } from "types";
import { useRouter } from "next/navigation";
import { LabelBadge, SimpleButton, TextHighlight } from "components";
import { volumeCover } from "assets";
import { LuBookOpen, LuCalendar } from "react-icons/lu";

const VolumeGridCard = (props: VolumeCardProps) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const { volume, search, isSeeMorePlaceHolder, isSeeMore } = props;
    const coverImg = volume.cover_url || volumeCover.default.src;

    const title = volume.book.title || "";
    const descLines = 6;
    // const descLines = title.length <= maxCharsOneLine ? 4 : 3;

    const onClick = () => {
        if (props.onClick) {
            props.onClick();
        } else {
            router.push(`/v/${volume.slug}`);
        }
    };

    return (
        <Card.Root
            bg="none"
            boxShadow="none"
            border="none"
            w="100%"
            cursor="pointer"
            onClick={onClick}
            onMouseEnter={() => !isSeeMore && setIsHovered(true)}
            onMouseLeave={() => !isSeeMore && setIsHovered(false)}
            position="relative"
        >
            {/* Container 3D principal */}
            <Box
                aspectRatio={8 / 11}
                position="relative"
                perspective="1500px"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* 1. BLOCO DE PÁGINAS (Fica atrás da capa) */}
                <Box
                    position="absolute"
                    top="2%"
                    bottom="2%"
                    left="2px"
                    right="5px"
                    bg="white"
                    borderRadius="sm"
                    transform="translateZ(-1px)" // Garante que fique atrás sem piscar
                    boxShadow="
                        1px 0 0 #ddd,
                        2px 0 0 #fff,
                        3px 0 0 #ddd,
                        4px 0 0 #fff,
                        5px 0 7px rgba(0,0,0,0.1)
                    "
                    _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: "linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.07) 100%)",
                        backgroundSize: "4px 100%"
                    }}
                />

                {/* 2. A CAPA DO LIVRO */}
                <Box
                    w="100%"
                    h="100%"
                    position="relative"
                    transformOrigin="left center"
                    willChange="transform"
                    transition="transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s ease"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                    }}
                    transform={`
                        rotateY(${isHovered ? "-28deg" : "0.01deg"})
                        translateZ(1px)
                    `}
                    boxShadow={isHovered ? "15px 10px 25px -5px rgba(0,0,0,0.25)" : "2px 2px 8px rgba(0,0,0,0.12)"}
                >
                    <Image
                        borderRadius="sm"
                        src={coverImg}
                        alt={volume.book.title}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                    />
                </Box>

                {/* Badge de Empréstimo (Sempre visível e acima de tudo) */}
                {/* {book.loans?.length > 0 && !isHovered && (
                    <Box position="absolute" top="6px" right="6px" zIndex="10" transform="translateZ(10px)">
                        <LoanBadge bookLoan={book.loans[0]} />
                    </Box>
                )} */}

                {volume.label && !isHovered && (
                    <Box position="absolute" bottom="6px" left="12px" zIndex="10" transform="translateZ(10px)">
                        <LabelBadge label={volume.label} />
                    </Box>
                )}
            </Box>

            {/* Corpo do Card com as descrições devolvidas */}
            <Card.Body py="3" px="0">
                <VStack align="start" gap="1">
                    {/* <HStack justifyContent="space-between" width="100%">
                        <HStack alignItems="center" gap="1">
                            {book.label && (
                                <Text fontSize="xs" color="gray.500" lineClamp="1">
                                    {book.label}
                                </Text>
                            )}
                        </HStack>
                        {book.shelf && (
                            <HStack alignItems="center" gap="1">
                                <Text fontSize="xs" color="gray.500" lineClamp="1">
                                    {book.shelf}
                                </Text>
                                <LuLibraryBig size="12" color="gray" />
                            </HStack>
                        )}
                    </HStack> */}

                    <HStack justifyContent="space-between" width="100%">
                        <HStack alignItems="center" gap="1">
                            {volume.year && (
                                <>
                                    <LuCalendar size="12" color="gray" />
                                    <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }} lineClamp="1">
                                        {volume.year}
                                    </Text>
                                </>
                            )}
                        </HStack>
                        {volume.pages && (
                            <HStack alignItems="center" gap="1">
                                <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }} lineClamp="1">
                                    {volume.pages}
                                </Text>
                                <LuBookOpen size="12" color="gray" />
                            </HStack>
                        )}
                    </HStack>

                    <Text fontWeight="bold" fontSize="sm" lineHeight="tight" lineClamp="2">
                        {search ? <TextHighlight query={search} text={title} /> : title}
                    </Text>

                    {
                        /*volume.book.subtitle || */ (volume.book.description || volume.book.summary) && (
                            <Text
                                fontSize="xs"
                                color={{ base: "gray.600", _dark: "gray.400" }}
                                opacity={0.8}
                                lineClamp={descLines}
                            >
                                {search ? (
                                    <TextHighlight
                                        query={search}
                                        text={
                                            /*volume.book.subtitle || */
                                            volume.book.description || volume.book.summary || ""
                                        }
                                    />
                                ) : (
                                    /*volume.book.subtitle || */
                                    volume.book.description || volume.book.summary || ""
                                )}
                                {/* {volume.book.subtitle || volume.book.description || volume.book.summary} */}
                            </Text>
                        )
                    }
                </VStack>
            </Card.Body>

            {/* Overlay que aparece quando isPreview é true */}
            {isSeeMore && (
                <Box
                    position="absolute"
                    top="-3"
                    left="-3"
                    right="-3"
                    bottom="-3"
                    // bg="#9a272120"
                    backdropFilter="blur(3px)"
                    borderRadius="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex="1000"
                    cursor="pointer"
                    onClick={onClick}
                >
                    <HStack pb="32">
                        <SimpleButton onClick={onClick}>{isSeeMorePlaceHolder}</SimpleButton>
                    </HStack>
                </Box>
            )}
        </Card.Root>
    );
};

export default memo(VolumeGridCard);
