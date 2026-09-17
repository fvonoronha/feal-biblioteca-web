"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Box, Container, Grid, HStack, Heading, Image, Separator, Stack, Text, VStack } from "@chakra-ui/react";
import {
    LuBookOpen,
    LuCalendarCheck,
    LuClock7,
    LuHeartHandshake,
    LuLibraryBig,
    LuMapPin,
    LuSearch,
    LuSparkles,
    LuUserPlus
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { SimpleButton, GhostButton, FadeInSection } from "components";
import { fealIdentity, bgImages } from "assets";
import { APP_MAX_WIDTH_IN_PX } from "utils";

const WHATSAPP_PHONE_DISPLAY = "+55 95 99138 5816";
const WHATSAPP_DONATE_URL =
    "https://api.whatsapp.com/send?phone=5595991385816&text=Ol%C3%A1%2C%20eu%20gostaria%20de%20doar%20livros%20para%20a%20Biblioteca%20da%20FEAL%20%F0%9F%93%9A%EF%B8%8F";
const ADDRESS = "Av. Princesa Isabel, 1570, Jardim Floresta - Boa Vista, RR";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const LOAN_STEP_ICONS = [LuUserPlus, LuSearch, LuMapPin, LuBookOpen];

export default function SobrePage() {
    const t = useTranslations("AboutPage");
    const router = useRouter();

    const loanSteps = [0, 1, 2, 3].map((index) => ({
        icon: LOAN_STEP_ICONS[index],
        title: t(`loanStep${index + 1}Title`),
        description: t(`loanStep${index + 1}Description`)
    }));

    return (
        <Box overflow="hidden">
            {/* HERO */}
            <Box
                position="relative"
                bgGradient="to-br"
                gradientFrom={{ base: "fealRed.600", _dark: "fealRed.900" }}
                gradientTo={{ base: "fealRed.900", _dark: "black" }}
                color="white"
                pt={{ base: "80px", md: "120px" }}
                pb={{ base: "70px", md: "110px" }}
            >
                <Box
                    position="absolute"
                    inset={0}
                    opacity={0.08}
                    backgroundImage="radial-gradient(circle at 1px 1px, white 1px, transparent 0)"
                    backgroundSize="28px 28px"
                />

                <Container maxW={`${APP_MAX_WIDTH_IN_PX}px`} position="relative">
                    <VStack gap={6} textAlign="center" mx="auto" maxW="720px">
                        <FadeInSection>
                            <Image src={fealIdentity.logo.src} alt="FEAL" boxSize={{ base: "64px", md: "84px" }} mx="auto" />
                        </FadeInSection>

                        <FadeInSection delay={0.1}>
                            <Text fontSize="sm" fontWeight="bold" letterSpacing="widest" textTransform="uppercase" opacity={0.85}>
                                {t("eyebrow")}
                            </Text>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="extrabold" lineHeight="1.1">
                                {t("heroTitle")}
                            </Heading>
                        </FadeInSection>

                        <FadeInSection delay={0.3}>
                            <Text fontSize={{ base: "md", md: "xl" }} opacity={0.92} maxW="560px">
                                {t("heroSubtitle")}
                            </Text>
                        </FadeInSection>

                        <FadeInSection delay={0.4}>
                            <HStack gap={3} pt={2} wrap="wrap" justify="center">
                                <SimpleButton size="lg" bg="white" color="fealRed.solid" _hover={{ bg: "whiteAlpha.900" }} onClick={() => router.push("/")}>
                                    <LuLibraryBig /> {t("heroCtaCatalog")}
                                </SimpleButton>
                                <GhostButton
                                    size="lg"
                                    borderWidth="1px"
                                    borderColor="whiteAlpha.500"
                                    color="white"
                                    _hover={{ bg: "whiteAlpha.200", color: "white" }}
                                    onClick={() => document.getElementById("doar")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    <LuHeartHandshake /> {t("heroCtaDonate")}
                                </GhostButton>
                            </HStack>
                        </FadeInSection>
                    </VStack>
                </Container>
            </Box>

            <Container maxW={`${APP_MAX_WIDTH_IN_PX}px`} py={{ base: "60px", md: "100px" }}>
                {/* SOBRE A FEAL */}
                <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} gap={{ base: 10, md: 16 }} alignItems="center">
                    <FadeInSection direction="right">
                        <VStack align="start" gap={4}>
                            <HStack color="fealRed.solid" gap={2}>
                                <LuSparkles />
                                <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                                    {t("aboutEyebrow")}
                                </Text>
                            </HStack>
                            <Heading fontSize={{ base: "2xl", md: "3xl" }}>{t("aboutTitle")}</Heading>
                            <Text fontSize="md" color="fg.muted" whiteSpace="pre-line">
                                {t("aboutText")}
                            </Text>
                        </VStack>
                    </FadeInSection>

                    <FadeInSection direction="left" delay={0.15}>
                        <Box
                            borderRadius="2xl"
                            overflow="hidden"
                            boxShadow="xl"
                            bg={{ base: "gray.100", _dark: "gray.800" }}
                        >
                            <Image src={bgImages.login.src} alt={t("aboutTitle")} w="100%" objectFit="cover" />
                        </Box>
                    </FadeInSection>
                </Grid>

                <Separator my={{ base: "60px", md: "90px" }} />

                {/* COMO FUNCIONA O EMPRÉSTIMO */}
                <VStack gap={{ base: 10, md: 14 }}>
                    <FadeInSection>
                        <VStack gap={3} textAlign="center" maxW="640px" mx="auto">
                            <HStack color="fealRed.solid" gap={2}>
                                <LuCalendarCheck />
                                <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                                    {t("loanEyebrow")}
                                </Text>
                            </HStack>
                            <Heading fontSize={{ base: "2xl", md: "3xl" }}>{t("loanTitle")}</Heading>
                            <Text color="fg.muted">{t("loanSubtitle")}</Text>
                        </VStack>
                    </FadeInSection>

                    <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }} gap={5} w="100%">
                        {loanSteps.map((step, index) => (
                            <FadeInSection key={step.title} delay={index * 0.1}>
                                <VStack
                                    align="start"
                                    gap={3}
                                    p={6}
                                    h="100%"
                                    borderRadius="xl"
                                    borderWidth="1px"
                                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                                    transition="transform .2s, box-shadow .2s"
                                    _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                                >
                                    <HStack justify="space-between" w="100%">
                                        <Box p={3} borderRadius="full" bg={{ base: "fealRed.subtle", _dark: "fealRed.950" }} color="fealRed.solid">
                                            <step.icon size={20} />
                                        </Box>
                                        <Text fontSize="4xl" fontWeight="extrabold" color={{ base: "gray.100", _dark: "gray.700" }} lineHeight="1">
                                            {index + 1}
                                        </Text>
                                    </HStack>
                                    <Text fontWeight="bold">{step.title}</Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        {step.description}
                                    </Text>
                                </VStack>
                            </FadeInSection>
                        ))}
                    </Grid>
                </VStack>

                <Separator my={{ base: "60px", md: "90px" }} />

                {/* DOAR LIVROS */}
                <Grid id="doar" templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 8, md: 12 }} alignItems="center" scrollMarginTop="80px">
                    <FadeInSection direction="right">
                        <VStack align="start" gap={4}>
                            <HStack color="fealRed.solid" gap={2}>
                                <LuHeartHandshake />
                                <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                                    {t("donateEyebrow")}
                                </Text>
                            </HStack>
                            <Heading fontSize={{ base: "2xl", md: "3xl" }}>{t("donateTitle")}</Heading>
                            <Text color="fg.muted">{t("donateText")}</Text>

                            <SimpleButton asChild size="lg">
                                <a href={WHATSAPP_DONATE_URL} target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp /> {WHATSAPP_PHONE_DISPLAY}
                                </a>
                            </SimpleButton>
                        </VStack>
                    </FadeInSection>

                    <FadeInSection direction="left" delay={0.15}>
                        <VStack
                            align="start"
                            gap={4}
                            p={8}
                            borderRadius="2xl"
                            bg={{ base: "gray.subtle", _dark: "gray.800" }}
                        >
                            <Text fontWeight="bold" fontSize="lg">
                                {t("donateWhatTitle")}
                            </Text>
                            <VStack align="start" gap={2} fontSize="sm" color="fg.muted">
                                <Text>{t("donateWhatItem1")}</Text>
                                <Text>{t("donateWhatItem2")}</Text>
                                <Text>{t("donateWhatItem3")}</Text>
                            </VStack>
                        </VStack>
                    </FadeInSection>
                </Grid>

                <Separator my={{ base: "60px", md: "90px" }} />

                {/* VISITE-NOS */}
                <FadeInSection>
                    <Box
                        borderRadius="2xl"
                        p={{ base: 8, md: 12 }}
                        bgGradient="to-br"
                        gradientFrom={{ base: "fealRed.600", _dark: "fealRed.900" }}
                        gradientTo={{ base: "fealRed.800", _dark: "black" }}
                        color="white"
                    >
                        <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} gap={8}>
                            <VStack align="start" gap={3} maxW="480px">
                                <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" opacity={0.85}>
                                    {t("visitEyebrow")}
                                </Text>
                                <Heading fontSize={{ base: "xl", md: "2xl" }}>{t("visitTitle")}</Heading>

                                <HStack gap={2} align="start">
                                    <Box pt="2px">
                                        <LuMapPin />
                                    </Box>
                                    <Text>{ADDRESS}</Text>
                                </HStack>

                                <HStack gap={2} align="start">
                                    <Box pt="2px">
                                        <LuClock7 />
                                    </Box>
                                    <Text>{t("visitHours")}</Text>
                                </HStack>
                            </VStack>

                            <SimpleButton
                                asChild
                                size="lg"
                                bg="white"
                                color="fealRed.solid"
                                _hover={{ bg: "whiteAlpha.900" }}
                                flexShrink={0}
                            >
                                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                                    <LuMapPin /> {t("visitCta")}
                                </a>
                            </SimpleButton>
                        </Stack>
                    </Box>
                </FadeInSection>
            </Container>
        </Box>
    );
}
