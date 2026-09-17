"use client";

import { memo, ReactNode, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { volumeCover } from "assets";

interface Props {
    coverUrl?: string;
    alt: string;
    w?: string;
    // Overlays (etiqueta, bolinha de indisponível, etc.) posicionados por cima da capa -
    // função em vez de nó pronto pra quem precisa esconder algo durante o hover (ex.: a
    // etiqueta do VolumeGridCard, que some quando a capa "abre").
    children?: (isHovered: boolean) => ReactNode;
}

/**
 * A capa 3D com a animação de "abrir a página" no hover, usada na home (VolumeGridCard) e
 * reaproveitada em qualquer outro lugar que mostre uma capa clicável (ex.: a linha de livros
 * do admin) - mesma sensação de interface em toda a aplicação, só o tamanho muda.
 */
function BookCoverFlip({ coverUrl, alt, w = "100%", children }: Props) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            w={w}
            flexShrink={0}
            aspectRatio={8 / 11}
            position="relative"
            perspective="1500px"
            style={{ transformStyle: "preserve-3d" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Bloco de páginas atrás da capa */}
            <Box
                position="absolute"
                top="2%"
                bottom="2%"
                left="2px"
                right="5px"
                bg="white"
                borderRadius="sm"
                transform="translateZ(-1px)"
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

            {/* A capa em si */}
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
                <Image borderRadius="sm" src={coverUrl || volumeCover.default.src} alt={alt} objectFit="cover" w="100%" h="100%" />
            </Box>

            {children?.(isHovered)}
        </Box>
    );
}

export default memo(BookCoverFlip);
