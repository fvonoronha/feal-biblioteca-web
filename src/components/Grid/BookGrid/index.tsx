import { memo } from "react";
import { Grid, Image, HStack, VStack, Spinner, Heading } from "@chakra-ui/react";
import { BookGridProps } from "types";
import { LoadingIcons } from "assets";
import { useTranslations } from "next-intl";
import { GhostButton } from "components/Button";

const BookGrid = (props: BookGridProps) => {
    const t = useTranslations("Utils");

    const elementWidth = props.eWidth || "100px";
    const isLoading: boolean = props.isLoading;
    const hasLoadingFailed = !!props.loadingFailed;

    return hasLoadingFailed ? (
        <VStack align={"center"}>
            <HStack align={"center"} pt="50px">
                <VStack align={"center"}>
                    <Image w="300px" src={LoadingIcons.failed.src} alt={t("somethingIsWrong")} />{" "}
                    <Heading textAlign={"center"}>{t("somethingIsWrong")}</Heading>
                    <GhostButton
                        // ToDO: Remover isso daqui. Não deve ser responsabilidade do componente recarregar a página.
                        /// Essa é apenas uma solução temporária e preguiçosa
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        {t("somethingIsWrongRefresh")}
                    </GhostButton>
                </VStack>
            </HStack>
        </VStack>
    ) : (
        <>
            <Grid
                templateColumns={`repeat(auto-fill, minmax(${elementWidth}, 1fr))`}
                gap="15px"
                justifyContent="start"
                {...props}
            >
                {props.children}
            </Grid>

            {isLoading && (
                <VStack align={"center"}>
                    <HStack align={"center"} pt="50px">
                        <Spinner /> <Heading>{t("loading")}...</Heading>
                    </HStack>
                </VStack>
            )}
        </>
    );
};

export default memo(BookGrid);
