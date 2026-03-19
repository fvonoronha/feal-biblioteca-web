import { memo } from "react";
import { Grid, Image, HStack, VStack, Spinner, Heading } from "@chakra-ui/react";
import { BookGridProps } from "types";
import { LoadingIcons } from "assets";
import { useTranslations } from "next-intl";

const BookGrid = (props: BookGridProps) => {
    const t = useTranslations("Utils");

    const elementWidth = props.eWidth || "100px";
    const isLoading: boolean = props.isLoading;
    const hasLoadingFailed = !!props.loadingFailed;

    return hasLoadingFailed ? (
        <VStack align={"center"}>
            <HStack align={"center"} pt="50px">
                <VStack align={"center"}>
                    <Image w="200px" src={LoadingIcons.failed.src} alt="Falha a carregar os dados" />{" "}
                    <Heading>{t("somethingIsWrong")}</Heading>
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
