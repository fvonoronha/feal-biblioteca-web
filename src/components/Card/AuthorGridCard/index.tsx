"use client";

import { memo, useState } from "react";
import { Card, VStack, Image, Text, Box, HStack } from "@chakra-ui/react";
import { AuthorCardProps } from "types";
import { useRouter } from "next/navigation";
import { SimpleButton } from "components";
import { authorCover } from "assets";
import { LuBook, LuSparkles } from "react-icons/lu";

const AuthorGridCard = (props: AuthorCardProps) => {
    const { author, isSeeMorePlaceHolder, isSeeMore } = props;
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    // Usamos apenas a imagem principal agora
    const coverImg = author.avatar_url || authorCover.default.src;

    console.log("Author: ", author);

    const clickAuthor = () => {
        if (props.onClick) {
            props.onClick?.();
        } else {
            router.push(`/a/${author.slug}`);
        }
    };

    return (
        <Card.Root
            bg="none"
            boxShadow="none"
            border="none"
            w="100%"
            cursor="pointer"
            onClick={clickAuthor}
            onMouseEnter={() => !isSeeMore && setIsHovered(true)}
            onMouseLeave={() => !isSeeMore && setIsHovered(false)}
            position="relative"
        >
            <Box aspectRatio={1} position="relative" perspective="1500px" style={{ transformStyle: "preserve-3d" }}>
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

                        translateY(${isHovered ? "-4px" : "0px"})
                        scale(${isHovered ? "1.05" : "1"})
                        

                       
                    `}
                    boxShadow="2px 2px 8px rgba(0,0,0,0.12)"
                >
                    <Image borderRadius="sm" src={coverImg} alt={author.name} objectFit="cover" w="100%" h="100%" />
                </Box>
            </Box>

            <Card.Body py="3" px="0">
                <VStack align="start" gap="1">
                    <HStack justifyContent="space-between" width="100%">
                        <HStack alignItems="center" gap="1">
                            <LuBook size="12" color="gray" />
                            <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }} lineClamp="1">
                                {author._count?.books} volumes
                            </Text>
                        </HStack>
                        {author.is_spirit && (
                            <HStack alignItems="center" gap="1">
                                <LuSparkles size="12" color="gray" />
                                {/* <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }} lineClamp="1">
                                    Espírito
                                </Text> */}
                            </HStack>
                        )}
                    </HStack>

                    <Text fontWeight="bold" fontSize="sm" lineHeight="tight" lineClamp="2">
                        {author.name}
                    </Text>

                    {/* Descrição/Editora devolvida aqui */}
                    {author.description && (
                        <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }} opacity={0.8} lineClamp="5">
                            {author.description}
                        </Text>
                    )}
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
                    onClick={clickAuthor}
                >
                    <HStack pb="16">
                        <SimpleButton onClick={clickAuthor}>{isSeeMorePlaceHolder}</SimpleButton>
                    </HStack>
                </Box>
            )}
        </Card.Root>
    );
};

export default memo(AuthorGridCard);
