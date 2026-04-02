"use client";

import { memo } from "react";
import { Grid, Image, HStack, VStack, Spinner, Heading, Box } from "@chakra-ui/react";
import { BookGridProps } from "types";
import { LoadingIcons } from "assets";
import { useTranslations } from "next-intl";
import { GhostButton } from "components/Button";

// Extendemos a interface para suportar a nova variante
interface ExtendedBookGridProps extends BookGridProps {
    variant?: "grid" | "scroll";
}

const BookGrid = (props: ExtendedBookGridProps) => {
    const t = useTranslations("Utils");

    const {
        variant = "grid",
        eWidth = "150px",
        // isLoading = false,
        isLoadingMore = false,
        loadingFailed = false,
        children,
        ...rest
    } = props;

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
                <HStack gap="15px" align="stretch" {...scrollStyles}>
                    {/* <HStack gap="15px" align="stretch" {...scrollStyles} {...rest}> */}
                    {/* ToDo: Implementar algum Scrol hint */}
                    {/* No modo scroll, garantimos que os filhos mantenham a largura definida */}
                    {Array.isArray(children)
                        ? children.map((child, index) => (
                              <Box key={index} minW={eWidth} maxW={eWidth}>
                                  {child}
                              </Box>
                          ))
                        : children}
                </HStack>
            )}

            {isLoadingMore && (
                <HStack justify="center" align="center" pt="50px">
                    <Spinner size="lg" color="fealRed" />
                    <Heading size="md">{t("loadingMore")}</Heading>
                </HStack>
            )}
        </Box>
    );
};

export default memo(BookGrid);
