"use client";

import { memo } from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { LuCalendarClock, LuBookMarked } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { Volume } from "types";
import { parseDateFullText } from "utils";

interface Props {
    volume: Volume;
}

/**
 * Aviso chamativo (mas não alarmante) de que o volume está emprestado - some por completo
 * quando disponível, já que essa é a situação comum e não merece destaque nenhum. A mensagem
 * muda quando é o próprio usuário logado quem está com o livro, para lembrá-lo do prazo.
 */
function VolumeLoanStatusBanner({ volume }: Props) {
    const t = useTranslations("VolumeDetails");

    if (volume.is_available !== false) return null;

    const dueDate = volume.loan_due_date ? parseDateFullText(new Date(volume.loan_due_date)) : "";
    const isMine = !!volume.loaned_to_current_user;

    return (
        <HStack
            w="100%"
            p={3}
            gap={3}
            align="start"
            borderRadius="md"
            borderWidth="1px"
            bg={isMine ? { base: "fealRed.50", _dark: "rgba(154, 39, 33, 0.15)" } : { base: "orange.50", _dark: "rgba(194, 120, 3, 0.15)" }}
            borderColor={isMine ? { base: "fealRed.200", _dark: "fealRed.700" } : { base: "orange.200", _dark: "orange.700" }}
        >
            <Text as="span" color={isMine ? "fealRed.solid" : "orange.600"} pt="1px" flexShrink={0}>
                {isMine ? <LuBookMarked size={18} /> : <LuCalendarClock size={18} />}
            </Text>

            <VStack align="start" gap={0}>
                <Text fontWeight="bold" fontSize="sm" color={isMine ? "fealRed.solid" : { base: "orange.800", _dark: "orange.300" }}>
                    {isMine ? t("loanedToYouBannerTitle") : t("loanedBannerTitle")}
                </Text>
                <Text fontSize="sm" color={{ base: "gray.700", _dark: "gray.300" }}>
                    {isMine ? t("loanedToYouBannerMessage", { due_date: dueDate }) : t("loanedBannerMessage", { due_date: dueDate })}
                </Text>
            </VStack>
        </HStack>
    );
}

export default memo(VolumeLoanStatusBanner);
