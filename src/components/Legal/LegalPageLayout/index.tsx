"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Box, Heading, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { Body, GhostButton } from "components";

interface Props {
    title: string;
    lastUpdated: string;
    children: ReactNode;
}

/**
 * Casca compartilhada pelas páginas de Termos de Uso e Política de Privacidade - só tipografia
 * simples (título, data de vigência, separador, conteúdo em Heading/Text), sem nenhuma
 * animação: são documentos legais, não uma página de marketing, então a prioridade aqui é
 * leitura fácil e uma aparência confiável, não impressionar.
 */
export default function LegalPageLayout({ title, lastUpdated, children }: Props) {
    const t = useTranslations("LegalPages");
    const router = useRouter();

    return (
        <Body>
            <Box maxW="760px" mx="auto" w="100%">
                <GhostButton p={0} mb={6} onClick={() => router.back()}>
                    <HStack>
                        <LuArrowLeft />
                        <Text>{t("back")}</Text>
                    </HStack>
                </GhostButton>

                <VStack align="start" gap={1} pb={6}>
                    <Heading fontSize={{ base: "2xl", md: "3xl" }}>{title}</Heading>
                    <Text fontSize="sm" color="fg.muted">
                        {t("lastUpdated", { date: lastUpdated })}
                    </Text>
                </VStack>

                <Separator mb={6} />

                <VStack align="stretch" gap={6}>
                    {children}
                </VStack>
            </Box>
        </Body>
    );
}
