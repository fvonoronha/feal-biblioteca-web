"use client";

import { memo } from "react";
import { Card, VStack, Text, Box, HStack } from "@chakra-ui/react";
import { VolumeCardProps } from "types";
import { useRouter } from "next/navigation";
import { BookCoverFlip, LabelBadge, LoanBadge, SimpleButton, TextHighlight } from "components";
import { LuBookOpen, LuCalendar } from "react-icons/lu";

const VolumeGridCard = (props: VolumeCardProps) => {
    const router = useRouter();
    const { volume, search, isSeeMorePlaceHolder, isSeeMore } = props;

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
        <Card.Root bg="none" boxShadow="none" border="none" w="100%" cursor="pointer" onClick={onClick} position="relative">
            <BookCoverFlip coverUrl={volume.cover_url} alt={volume.book.title}>
                {(isHovered) => (
                    <>
                        {/* Badge de Empréstimo - só aparece quando indisponível, sempre visível (não
                            só no hover) já que essa é uma informação relevante de bater o olho e
                            entender. */}
                        {volume.is_available === false && (
                            <Box position="absolute" top="6px" right="6px" zIndex="10" transform="translateZ(10px)">
                                <LoanBadge isAvailable={false} dueDate={volume.loan_due_date} />
                            </Box>
                        )}

                        {volume.label && !isHovered && (
                            <Box position="absolute" bottom="6px" left="12px" zIndex="10" transform="translateZ(10px)">
                                <LabelBadge label={volume.label} />
                            </Box>
                        )}
                    </>
                )}
            </BookCoverFlip>

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
