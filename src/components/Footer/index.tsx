"use client";

import { Box, Container, Stack, Text, Image, VStack, HStack, Separator, Flex, Spacer, Link } from "@chakra-ui/react";
import {
    LuMapPin,
    LuInstagram,
    LuYoutube,
    LuFacebook,
    LuClock7,
    LuInfo,
    LuHouse,
    LuSearch,
    LuFileText,
    LuShield,
    LuLogIn
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { APP_MAX_WIDTH_IN_PX } from "utils";
import { fealIdentity } from "assets";
import { LocaleSelect, useColorMode } from "components";

import { useTranslations } from "next-intl";

// Extraído de src/app/(public)/layout.tsx para ser renderizado globalmente (ver
// src/app/layout.tsx e src/app/(private)/layout.tsx) - antes só existia dentro do layout
// público, então rotas privadas (empréstimos, perfil, ...) nunca mostravam endereço, horário
// de funcionamento ou o seletor de idioma.
export default function Footer() {
    const t = useTranslations("Footer");
    const router = useRouter();

    const colorMode = useColorMode();

    return (
        <Box as="footer" bg={{ base: "white", _dark: "gray.800" }} borderTop="1px solid" borderColor={"gray.muted"}>
            <Container maxW={`${APP_MAX_WIDTH_IN_PX}px`} pt="10">
                <Flex
                    direction={{ base: "column", md: "row" }}
                    wrap={{ base: "nowrap", md: "wrap" }}
                    justify="space-between"
                    align={{ base: "center", md: "start" }}
                    gap="6"
                >
                    <VStack flex={10} align={{ base: "center", md: "start" }}>
                        <Image
                            src={colorMode.colorMode === "dark" ? fealIdentity.logo_name_white.src : fealIdentity.logo_name_black.src}
                            alt={t("feal")}
                            h="60px"
                        />
                        <Text fontWeight="bold" fontSize="lg" textAlign={{ base: "center", md: "left" }}>
                            {t("description")}
                        </Text>

                        <HStack gap="2" color="fg.muted">
                            <Box color={"fealRed.solid"}>
                                <LuMapPin size={"16"} />
                            </Box>

                            <Text fontSize="sm">{t("address")}</Text>
                        </HStack>

                        <HStack gap="2" color="fg.muted">
                            <Box color={"fealRed.solid"}>
                                <LuClock7 size={"16"} />
                            </Box>

                            <Text fontSize="sm">{t("workingHours")}</Text>
                        </HStack>
                    </VStack>

                    <VStack flex={8} align={{ base: "center", md: "start" }}>
                        <Text fontWeight="bold" color="fg">
                            {t("sitemapTitle")}
                        </Text>

                        <Link p={0} as="button" style={{ textDecoration: "none" }} onClick={() => router.push("/")}>
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuHouse size={"16"} />
                                </Box>
                                <Text fontSize="sm">{t("sitemapHome")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="button" style={{ textDecoration: "none" }} onClick={() => router.push("/buscar")}>
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuSearch size={"16"} />
                                </Box>
                                <Text fontSize="sm">{t("sitemapSearch")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="button" style={{ textDecoration: "none" }} onClick={() => router.push("/sobre")}>
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuInfo size={"16"} />
                                </Box>
                                <Text fontSize="sm">{t("aboutLink")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="button" style={{ textDecoration: "none" }} onClick={() => router.push("/login")}>
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuLogIn size={"16"} />
                                </Box>
                                <Text fontSize="sm">{t("sitemapLogin")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="button" style={{ textDecoration: "none" }} onClick={() => router.push("/termos-de-uso")}>
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuFileText size={"16"} />
                                </Box>
                                <Text fontSize="sm">{t("sitemapTerms")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="button" style={{ textDecoration: "none" }} onClick={() => router.push("/politica-de-privacidade")}>
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuShield size={"16"} />
                                </Box>
                                <Text fontSize="sm">{t("sitemapPrivacy")}</Text>
                            </HStack>
                        </Link>
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
                                <Box color={"fealRed.solid"}>
                                    <FaWhatsapp size={"20"} />
                                </Box>

                                <Text fontSize="md">{t("whatsappGroup")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="a" style={{ textDecoration: "none" }} href="https://www.instagram.com/fealrr" target="_blank">
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuInstagram size={"20"} />
                                </Box>

                                <Text fontSize="md">{t("instagram")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="a" style={{ textDecoration: "none" }} href="https://www.youtube.com/@fealrr" target="_blank">
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
                                    <LuYoutube size={"20"} />
                                </Box>

                                <Text fontSize="md">{t("youtube")}</Text>
                            </HStack>
                        </Link>

                        <Link p={0} as="a" style={{ textDecoration: "none" }} href="https://www.facebook.com/FEALRR" target="_blank">
                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed.solid"}>
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
                                <Box color={"fealRed.solid"}>
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

                <Separator borderColor={{ base: "gray.muted", _dark: "gray.600" }} mt="10" mb="5" />

                <Text fontSize="xs" textAlign="center">
                    &copy;{` ${new Date().getFullYear()} ${t("feal")} — ${t("allRightsReserved")}`}
                </Text>
                <Spacer pb="5" />
            </Container>
        </Box>
    );
}
