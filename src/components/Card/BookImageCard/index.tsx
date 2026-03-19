"use client";

import { memo } from "react";
import { Image, Box } from "@chakra-ui/react";
import { BookCardProps } from "types";
import { LoanBadge } from "components";
import { bookCover } from "assets";

const BookImageCard = (props: BookCardProps) => {
    const book = props.book;

    // ToDo: Aqui nós vamos adicionar a lista de imagens e o hover vai alternar entre a primeira e o carrossel das próximas
    return (
        <Box
            aspectRatio={8 / 11}
            position="relative"
            overflow="hidden"
            bg="none"
            boxShadow="none"
            border="none"
            w="100%"
            cursor="pointer"
            borderRadius="lg"
            transition="all .2s"
            _hover={{
                filter: "saturate(1.2) brightness(1.1)",
                transform: "scale(1.02)"
            }}
        >
            <Image
                borderRadius="lg"
                src={book.cover_url || bookCover.default.src}
                alt={book.title}
                objectFit="cover"
                w="100%"
                h="100%"
            />
            {/* ToDo: tratar também a condição de disponvível ou emprestado para mostar o indicador */}
            {/* {true && <LoanBadge position="absolute" bottom="6px" left="6px" />} */}

            {/* ToDo: Outra coisa que eu quero fazer é preservar os livros que saírem de circulação aqui no app 
            mantendo o marcador de fora de circulação. Com isso é possível:
            * Manter o livro como uma opção para download do PDF;
            * Integrando com o sistema da livraria para que o usuário possa adquirir o livro novo;
            * Fomentar para que o usuário doe o livro, caso ele tenha. */}
        </Box>
    );
};

export default memo(BookImageCard);
