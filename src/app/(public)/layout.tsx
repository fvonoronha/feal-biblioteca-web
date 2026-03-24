"use client";

import { Box, Container, Stack, Text, Image, VStack, HStack, Separator, Flex, Spacer, Link } from "@chakra-ui/react";
import { LuMapPin, LuInstagram, LuYoutube, LuFacebook, LuClock7 } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { APP_MAX_WIDTH_IN_PX } from "utils";
import { fealIdentity } from "assets";
import { LocaleSelect, useColorMode } from "components";

import { useTranslations } from "next-intl";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const t = useTranslations("Footer");

    const colorMode = useColorMode();

    // ToDo: COmponentizar tudo e transformar isso em um layout

    return (
        <>
            {children}
            <Box as="footer" bg="bg.subtle" mt="auto" borderTopWidth="1px">
                <Container maxW={`${APP_MAX_WIDTH_IN_PX}px`} pt="10">
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "center", md: "start" }}
                        gap="6"
                    >
                        <VStack flex={10} align={{ base: "center", md: "start" }}>
                            <Image
                                src={
                                    colorMode.colorMode === "dark"
                                        ? fealIdentity.logo_name_white.src
                                        : fealIdentity.logo_name_black.src
                                } // Certifique-se de ter essa logo em /public
                                alt={t("feal")}
                                h="60px"
                            />
                            <Text fontWeight="bold" fontSize="lg" textAlign={{ base: "center", md: "left" }}>
                                {t("description")}
                            </Text>

                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed"}>
                                    <LuMapPin size={"16"} />
                                </Box>

                                <Text fontSize="sm">{t("address")}</Text>
                            </HStack>

                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed"}>
                                    <LuClock7 size={"16"} />
                                </Box>

                                <Text fontSize="sm">{t("workingHours")}</Text>
                            </HStack>
                        </VStack>

                        <VStack flex={8} align={{ base: "center", md: "start" }}>
                            <Text fontWeight="bold" color="fg">
                                {t("socialNetwork")}
                            </Text>

                            <Link
                                p={0}
                                as="a"
                                style={{ textDecoration: "none" }}
                                href="https://chat.whatsapp.com/ItJs8VaJqgu9cIpyPMYBDC?mode=gi_t"
                                target="_blank"
                            >
                                <HStack gap="2" color="fg.muted">
                                    <Box color={"fealRed"}>
                                        <FaWhatsapp size={"20"} />
                                    </Box>

                                    <Text fontSize="md">{t("whatsappGroup")}</Text>
                                </HStack>
                            </Link>

                            <Link
                                p={0}
                                as="a"
                                style={{ textDecoration: "none" }}
                                href="https://www.instagram.com/fealrr"
                                target="_blank"
                            >
                                <HStack gap="2" color="fg.muted">
                                    <Box color={"fealRed"}>
                                        <LuInstagram size={"20"} />
                                    </Box>

                                    <Text fontSize="md">{t("instagram")}</Text>
                                </HStack>
                            </Link>

                            <Link
                                p={0}
                                as="a"
                                style={{ textDecoration: "none" }}
                                href="https://www.youtube.com/@fealrr"
                                target="_blank"
                            >
                                <HStack gap="2" color="fg.muted">
                                    <Box color={"fealRed"}>
                                        <LuYoutube size={"20"} />
                                    </Box>

                                    <Text fontSize="md">{t("youtube")}</Text>
                                </HStack>
                            </Link>

                            <Link
                                p={0}
                                as="a"
                                style={{ textDecoration: "none" }}
                                href="https://www.facebook.com/FEALRR"
                                target="_blank"
                            >
                                <HStack gap="2" color="fg.muted">
                                    <Box color={"fealRed"}>
                                        <LuFacebook size={"20"} />
                                    </Box>

                                    <Text fontSize="md">{t("facebook")}</Text>
                                </HStack>
                            </Link>
                        </VStack>

                        <VStack flex={10} align={{ base: "center", md: "start" }}>
                            <Text fontWeight="bold" color="fg">
                                {t("donateTitle")}
                            </Text>
                            <Text fontSize="sm" color="fg.muted">
                                {t("donateDescription")}
                            </Text>
                            <Link
                                p={0}
                                as="a"
                                style={{ textDecoration: "none" }}
                                href="https://api.whatsapp.com/send?phone=5595991385816&text=Olá%2C%20eu%20gostaria%20de%20doar%20livros%20para%20a%20Biblioteca%20da%20FEAL%20📚%EF%B8%8F"
                                target="_blank"
                            >
                                <HStack gap="2" color="fg.muted">
                                    <Box color={"fealRed"}>
                                        <FaWhatsapp size={"20"} />
                                    </Box>

                                    <Text fontSize="md">{"+55 95 99138 5816"}</Text>
                                </HStack>
                            </Link>

                            <HStack pt={"12px"}>
                                <Text fontWeight="bold" color="fg" w={"100%"}>
                                    {t("language")}
                                </Text>

                                <Stack>
                                    <LocaleSelect />
                                </Stack>
                            </HStack>
                        </VStack>
                    </Flex>

                    <Separator mt="10" mb="5" />

                    <Text fontSize="xs" textAlign="center">
                        &copy;{` ${new Date().getFullYear()} ${t("feal")} — ${t("allRightsReserved")}`}
                    </Text>
                    <Spacer mb="5" />
                </Container>
            </Box>
        </>
    );
}
