"use client";

import { Box, Container, Stack, Text, Image, VStack, HStack, Separator, Flex, Spacer } from "@chakra-ui/react";
import { LuMapPin, LuInstagram, LuYoutube, LuFacebook, LuClock7 } from "react-icons/lu";
import { fealIdentity } from "assets";
import { LocaleSelect } from "components";

import { useTranslations } from "next-intl";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const t = useTranslations("Footer");

    return (
        <>
            {children}
            <Box as="footer" bg="bg.subtle" mt="auto" borderTopWidth="1px">
                <Container maxW="container.xl" pt="10">
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "center", md: "start" }}
                        gap="6"
                    >
                        <VStack flex={1} align={{ base: "center", md: "start" }}>
                            <Image
                                src={fealIdentity.logo_name.src} // Certifique-se de ter essa logo em /public
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

                        <VStack flex={1} align={{ base: "center", md: "start" }} maxW="500px">
                            <Text fontWeight="bold" color="fg">
                                {t("followUs")}
                            </Text>

                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed"}>
                                    <LuInstagram size={"16"} />
                                </Box>

                                <Text fontSize="sm">@fealrr</Text>
                            </HStack>

                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed"}>
                                    <LuYoutube size={"16"} />
                                </Box>

                                <Text fontSize="sm">@fealrr</Text>
                            </HStack>

                            <HStack gap="2" color="fg.muted">
                                <Box color={"fealRed"}>
                                    <LuFacebook size={"16"} />
                                </Box>

                                <Text fontSize="sm">@fealrr</Text>
                            </HStack>
                        </VStack>

                        {/* Coluna 3: Idioma */}
                        <VStack flex={1} align={{ base: "center", md: "start" }} gap="3" w="100%">
                            <Text fontWeight="bold" color="fg">
                                {t("language")}
                            </Text>

                            <Stack w={"100%"}>
                                <LocaleSelect />
                            </Stack>
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
