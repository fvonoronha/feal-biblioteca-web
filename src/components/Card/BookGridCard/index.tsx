// "use client";

// import { memo, useEffect, useState, useRef } from "react";
// import { Card, VStack, Image, Text, Box, Flex, HStack } from "@chakra-ui/react";
// import { BookCardProps } from "types";
// import { useRouter } from "next/navigation";
// import { LoanBadge, MultipleImagesBadge } from "components";
// import { bookCover } from "assets";
// import { LuLibraryBig } from "react-icons/lu";

// const FIRST_IMAGE_SLIDE_TIME_IN_MS = 500;
// const IMAGE_SLIDE_TIME_IN_MS = 3600;

// const BookGridCardV2 = (props: BookCardProps) => {
//     const { book } = props;
//     const router = useRouter();

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isHovered, setIsHovered] = useState(false);

//     const intervalRef = useRef<NodeJS.Timeout | null>(null);
//     const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const allImages = [book.cover_url, ...(book.images_url || [])].filter(Boolean);
//     const images = allImages.length > 0 ? allImages : [bookCover.default.src];

//     const startCarousel = () => {
//         if (images.length <= 1) return;
//         setIsHovered(true);
//         timeoutRef.current = setTimeout(() => {
//             setCurrentIndex(1);
//             intervalRef.current = setInterval(() => {
//                 setCurrentIndex((prev) => (prev + 1) % images.length);
//             }, IMAGE_SLIDE_TIME_IN_MS);
//         }, FIRST_IMAGE_SLIDE_TIME_IN_MS);
//     };

//     const stopCarousel = () => {
//         setIsHovered(false);
//         if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         if (intervalRef.current) clearInterval(intervalRef.current);
//         setCurrentIndex(0);
//     };

//     useEffect(() => {
//         return () => {
//             if (timeoutRef.current) clearTimeout(timeoutRef.current);
//             if (intervalRef.current) clearInterval(intervalRef.current);
//         };
//     }, []);

//     const clickBook = () => {
//         router.push(`/b/${book.slug}`);
//     };

//     return (
//         <Card.Root
//             bg="none"
//             boxShadow="none"
//             border="none"
//             w="100%"
//             cursor="pointer"
//             overflow="hidden"
//             borderRadius="lg"
//             onClick={clickBook}
//             onMouseEnter={startCarousel}
//             onMouseLeave={stopCarousel}
//             transition="all .2s"
//             _hover={{
//                 filter: "saturate(1.1) brightness(1.1)",
//                 transform: "scale(1.04)"
//             }}
//         >
//             <Box aspectRatio={8 / 11} position="relative" overflow="hidden">
//                 <Flex
//                     w={`${images.length * 100}%`}
//                     h="100%"
//                     transform={`translateX(-${(currentIndex * 100) / images.length}%)`}
//                     transition={isHovered ? "transform 0.4s ease-in-out" : "none"}
//                     willChange="transform"
//                 >
//                     {images.map((imgSrc, index) => (
//                         <Image
//                             key={index}
//                             borderRadius="lg"
//                             src={imgSrc}
//                             alt={`${book.title} - ${index}`}
//                             objectFit="cover"
//                             w={`${100 / images.length}%`}
//                             h="100%"
//                         />
//                     ))}
//                 </Flex>

//                 {/*  Disponibilidade */}
//                 {book.loans?.length > 0 && (
//                     <LoanBadge bookLoan={book.loans[0]} position="absolute" top="6px" left="6px" zIndex="1" />
//                 )}

//                 {/*Multiplas imagens */}
//                 {images?.length > 1 && !isHovered && (
//                     <MultipleImagesBadge
//                         images={(images || []) as string[]}
//                         position="absolute"
//                         top="6px"
//                         right="6px"
//                         zIndex="1"
//                     />
//                 )}
//             </Box>

//             <Card.Body py="1" px="0">
//                 <VStack align="start" gap="0">
//                     <HStack justifyContent="space-between" width="100%">
//                         <HStack alignItems="center">
//                             {book.label && (
//                                 <Text fontSize="xs" lineClamp="1">
//                                     {book.label || ""}
//                                 </Text>
//                             )}
//                         </HStack>
//                         {book.shelf && (
//                             <HStack alignItems="center">
//                                 <Text fontSize="xs" lineClamp="1">
//                                     {book.shelf || ""}
//                                 </Text>
//                                 <LuLibraryBig size="12" />
//                             </HStack>
//                         )}
//                     </HStack>

//                     <Text fontWeight="bold" fontSize="sm" lineClamp="2">
//                         {book.title}
//                     </Text>
//                     <Text fontSize="xs" opacity={0.8} lineClamp="2">
//                         {book.subtitle || book.description || book.publisher}
//                     </Text>
//                 </VStack>
//             </Card.Body>
//         </Card.Root>
//     );
// };

// export default memo(BookGridCardV2);

// "use client";

// import { memo, useEffect, useState, useRef } from "react";
// import { Card, VStack, Image, Text, Box, Flex, HStack } from "@chakra-ui/react";
// import { BookCardProps } from "types";
// import { useRouter } from "next/navigation";
// import { LoanBadge, MultipleImagesBadge } from "components";
// import { bookCover } from "assets";
// import { LuLibraryBig } from "react-icons/lu";

// const FIRST_IMAGE_SLIDE_TIME_IN_MS = 500;
// const IMAGE_SLIDE_TIME_IN_MS = 3600;

// const BookGridCardV2 = (props: BookCardProps) => {
//     const { book } = props;
//     const router = useRouter();

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isHovered, setIsHovered] = useState(false);

//     const intervalRef = useRef<NodeJS.Timeout | null>(null);
//     const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const allImages = [book.cover_url, ...(book.images_url || [])].filter(Boolean);
//     const images = allImages.length > 0 ? allImages : [bookCover.default.src];

//     const startCarousel = () => {
//         setIsHovered(true);
//         if (images.length <= 1) return;
//         timeoutRef.current = setTimeout(() => {
//             setCurrentIndex(1);
//             intervalRef.current = setInterval(() => {
//                 setCurrentIndex((prev) => (prev + 1) % images.length);
//             }, IMAGE_SLIDE_TIME_IN_MS);
//         }, FIRST_IMAGE_SLIDE_TIME_IN_MS);
//     };

//     const stopCarousel = () => {
//         setIsHovered(false);
//         if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         if (intervalRef.current) clearInterval(intervalRef.current);
//         setCurrentIndex(0);
//     };

//     useEffect(() => {
//         return () => {
//             if (timeoutRef.current) clearTimeout(timeoutRef.current);
//             if (intervalRef.current) clearInterval(intervalRef.current);
//         };
//     }, []);

//     const clickBook = () => {
//         router.push(`/b/${book.slug}`);
//     };

//     return (
//         <Card.Root
//             bg="none"
//             boxShadow="none"
//             border="none"
//             w="100%"
//             cursor="pointer"
//             onClick={clickBook}
//             onMouseEnter={startCarousel}
//             onMouseLeave={stopCarousel}
//             transition="all .3s"
//             // Removido o overflow="hidden" daqui para o 3D não cortar
//         >
//             {/* Container com Perspectiva 3D */}
//             <Box
//                 aspectRatio={8 / 11}
//                 position="relative"
//                 perspective="1200px"
//                 style={{ transformStyle: "preserve-3d" }}
//             >
//                 {/* 1. AS PÁGINAS (Ficam atrás da capa) */}
//                 <Box
//                     position="absolute"
//                     top="2%"
//                     bottom="2%"
//                     left="2px"
//                     right="5px"
//                     bg="white"
//                     borderRadius="sm"
//                     zIndex="1"
//                     boxShadow="sm"
//                     overflow="hidden"
//                     _before={{
//                         content: '""',
//                         position: "absolute",
//                         top: 0, left: 0, right: 0, bottom: 0,
//                         opacity: 0.1,
//                         // Simula as linhas das páginas
//                         backgroundImage: "linear-gradient(90deg, transparent 90%, rgba(0,0,0,0.5) 100%)",
//                         backgroundSize: "3px 100%"
//                     }}
//                 />

//                 {/* 2. A CAPA (O Flex que já faz o carrossel) */}
//                 <Flex
//                     w={`${images.length * 100}%`}
//                     h="100%"
//                     zIndex="2"
//                     position="relative"
//                     transformOrigin="left center"
//                     // Combina o Slide do carrossel com a Rotação de abertura
//                     transform={`
//                         translateX(-${(currentIndex * 100) / images.length}%)
//                         rotateY(${isHovered ? "-28deg" : "0deg"})
//                     `}
//                     transition="transform 0.6s cubic-bezier(0.15, 0.85, 0.35, 1)"
//                     willChange="transform"
//                     boxShadow={isHovered ? "15px 10px 25px rgba(0,0,0,0.2)" : "2px 2px 10px rgba(0,0,0,0.1)"}
//                 >
//                     {images.map((imgSrc, index) => (
//                         <Image
//                             key={index}
//                             borderRadius="sm"
//                             src={imgSrc}
//                             alt={`${book.title} - ${index}`}
//                             objectFit="cover"
//                             w={`${100 / images.length}%`}
//                             h="100%"
//                         />
//                     ))}
//                 </Flex>

//                 {/* Badges fixas (Não rotacionam com a capa) */}
//                 <Box position="absolute" top="6px" left="6px" zIndex="3">
//                    {book.loans?.length > 0 && <LoanBadge bookLoan={book.loans[0]} />}
//                 </Box>

//                 {images?.length > 1 && !isHovered && (
//                     <MultipleImagesBadge
//                         images={(images || []) as string[]}
//                         position="absolute"
//                         top="6px"
//                         right="6px"
//                         zIndex="3"
//                     />
//                 )}
//             </Box>

//             <Card.Body py="2" px="0">
//                 <VStack align="start" gap="0">
//                     <HStack justifyContent="space-between" width="100%">
//                         <HStack alignItems="center">
//                             {book.label && <Text fontSize="xs" lineClamp="1">{book.label}</Text>}
//                         </HStack>
//                         {book.shelf && (
//                             <HStack alignItems="center">
//                                 <Text fontSize="xs" lineClamp="1">{book.shelf}</Text>
//                                 <LuLibraryBig size="12" />
//                             </HStack>
//                         )}
//                     </HStack>
//                     <Text fontWeight="bold" fontSize="sm" lineClamp="2">{book.title}</Text>
//                     <Text fontSize="xs" opacity={0.8} lineClamp="2">
//                         {book.subtitle || book.description || book.publisher}
//                     </Text>
//                 </VStack>
//             </Card.Body>
//         </Card.Root>
//     );
// };

// export default memo(BookGridCardV2);

"use client";

import { memo, useState } from "react";
import { Card, VStack, Image, Text, Box, HStack } from "@chakra-ui/react";
import { BookCardProps } from "types";
import { useRouter } from "next/navigation";
import { LoanBadge } from "components";
import { bookCover } from "assets";
import { LuLibraryBig } from "react-icons/lu";

const BookGridCardV2 = (props: BookCardProps) => {
    const { book } = props;
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    // Usamos apenas a imagem principal agora
    const coverImg = book.cover_url || bookCover.default.src;

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
            onClick={clickBook}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                    <Image borderRadius="sm" src={coverImg} alt={book.title} objectFit="cover" w="100%" h="100%" />
                </Box>

                {/* Badge de Empréstimo (Sempre visível e acima de tudo) */}
                {book.loans?.length > 0 && (
                    <Box position="absolute" top="6px" left="6px" zIndex="10" transform="translateZ(10px)">
                        <LoanBadge bookLoan={book.loans[0]} />
                    </Box>
                )}
            </Box>

            {/* Corpo do Card com as descrições devolvidas */}
            <Card.Body py="3" px="0">
                <VStack align="start" gap="1">
                    <HStack justifyContent="space-between" width="100%">
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
                    </HStack>

                    <Text fontWeight="bold" fontSize="sm" lineHeight="tight" lineClamp="2">
                        {book.title}
                    </Text>

                    {/* Descrição/Editora devolvida aqui */}
                    {(book.subtitle || book.description || book.publisher) && (
                        <Text fontSize="xs" color="gray.600" opacity={0.8} lineClamp="2">
                            {book.subtitle || book.description || book.publisher}
                        </Text>
                    )}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default memo(BookGridCardV2);
