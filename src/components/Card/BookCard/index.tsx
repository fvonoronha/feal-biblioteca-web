"use client";

import { memo, useEffect } from "react";
import { Card, VStack, Image, Text, Box } from "@chakra-ui/react";
import { BookCardProps } from "types";
import { useRouter } from "next/navigation";
import { LoanBadge } from "components";
import { bookCover } from "assets";

const BookCard = (props: BookCardProps) => {
    const book = props.book;

    const router = useRouter();

    useEffect(() => {}, []);

    const clickBook = () => {
        router.push(`/acervo/livro/${book.slug}`);
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
            transition="all .2s"
            _hover={{
                filter: "saturate(1.2) brightness(1.1)",
                transform: "scale(1.02)"
            }}
        >
            <Box aspectRatio={8 / 11} position="relative" overflow="hidden">
                <Image
                    borderRadius="lg"
                    src={book.cover_url || bookCover.default.src}
                    alt={book.title}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                />

                {/* ToDo: Adicionar a lógica para empréstimo */}
                {true && <LoanBadge position="absolute" bottom="6px" left="6px" />}
            </Box>

            <Card.Body py="1" px="2">
                <VStack align="start" gap="0">
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

export default memo(BookCard);
