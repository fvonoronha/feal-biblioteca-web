"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Box, Grid, Image, HStack, VStack, Spinner, Heading } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { EntityGridProps } from "types";
import { LoadingIcons } from "assets";
import { useTranslations } from "next-intl";
import { GhostButton } from "components/Button";
import { useScrollWiggleHint } from "hooks";

// Quanto cada clique na seta rola, como fração da largura visível da fileira.
const SCROLL_ARROW_STEP_RATIO = 0.85;

const arrowButtonStyle = {
    p: 2,
    borderRadius: "full",
    color: "fealRed.solid",
    bg: { base: "white", _dark: "gray.700" },
    boxShadow: "md",
    cursor: "pointer",
    transition: "all .2s",
    _hover: { bg: "fealRed.solid", color: "white" }
} as const;

const EntityGrid = (props: EntityGridProps) => {
    const t = useTranslations("Utils");

    const { variant = "grid", eWidth = "150px", isLoadingMore = false, loadingFailed = false, children, ...rest } = props;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Só entra em jogo pro variant "scroll" (o hook em si já não faz nada se não houver o que
    // rolar, então é seguro chamar sempre).
    useScrollWiggleHint(scrollRef);

    useEffect(() => {
        if (variant !== "scroll") return;

        const el = scrollRef.current;
        if (!el) return;

        const updateScrollButtons = () => {
            setCanScrollLeft(el.scrollLeft > 4);
            setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        };

        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons, { passive: true });

        const resizeObserver = new ResizeObserver(updateScrollButtons);
        resizeObserver.observe(el);

        return () => {
            el.removeEventListener("scroll", updateScrollButtons);
            resizeObserver.disconnect();
        };
    }, [variant, children]);

    const scrollByStep = (direction: "prev" | "next") => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollBy({
            left: el.clientWidth * SCROLL_ARROW_STEP_RATIO * (direction === "prev" ? -1 : 1),
            behavior: "smooth"
        });
    };

    const hasLoadingFailed = !!loadingFailed;

    if (hasLoadingFailed) {
        return (
            <VStack align={"center"} py="50px">
                <Image w="300px" src={LoadingIcons.failed.src} alt={t("somethingIsWrong")} />
                <Heading textAlign={"center"}>{t("somethingIsWrong")}</Heading>
                <GhostButton onClick={() => window.location.reload()}>{t("somethingIsWrongRefresh")}</GhostButton>
            </VStack>
        );
    }

    // Estilos comuns para o modo Scroll
    const scrollStyles = {
        overflowX: "auto" as const,
        pb: 4, // Espaço para não cortar a sombra dos cards ao rolar
        px: 1,
        width: "100%",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": { display: "none" } // Chrome/Safari
    };

    return (
        <Box w="100%">
            {variant === "grid" ? (
                <Grid
                    templateColumns={`repeat(auto-fill, minmax(${eWidth}, 1fr))`}
                    gap="15px"
                    justifyContent="start"
                    {...rest}
                >
                    {children}
                </Grid>
            ) : (
                <Box position="relative">
                    <HStack ref={scrollRef} gap="15px" align="stretch" {...scrollStyles}>
                        {/* No modo scroll, garantimos que os filhos mantenham a largura definida */}
                        {Array.isArray(children)
                            ? children.map((child, index) => (
                                  <Box key={index} minW={eWidth} maxW={eWidth} flexShrink={0}>
                                      {child}
                                  </Box>
                              ))
                            : children}
                    </HStack>

                    {canScrollLeft && (
                        <Box position="absolute" left="8px" top="0" bottom="4" display="flex" alignItems="center">
                            <Box {...arrowButtonStyle} onClick={() => scrollByStep("prev")}>
                                <FaChevronLeft size={14} />
                            </Box>
                        </Box>
                    )}

                    {canScrollRight && (
                        <Box position="absolute" right="8px" top="0" bottom="4" display="flex" alignItems="center">
                            <Box {...arrowButtonStyle} onClick={() => scrollByStep("next")}>
                                <FaChevronRight size={14} />
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            {isLoadingMore && (
                <HStack justify="center" align="center" pt="50px">
                    <Spinner size="lg" color="fealRed.solid" />
                    <Heading size="md">{t("loadingMore")}</Heading>
                </HStack>
            )}
        </Box>
    );
};

export default memo(EntityGrid);
