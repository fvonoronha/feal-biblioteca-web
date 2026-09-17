"use client";

import { useState } from "react";
import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { LuCheck, LuShare } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { SimpleButton } from "components/Button";
import { Volume } from "types";
import { SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS } from "utils";

type Props = {
    volume: Volume;
    isLoading: boolean;
};

export default function VolumeShareButton({ volume, isLoading }: Props) {
    const t = useTranslations("VolumeDetails");
    const [copied, setCopied] = useState(false);

    const shareVolume = async () => {
        const shareData = {
            title: volume.book?.title,
            text: volume.book?.subtitle || volume.book?.description || "",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n\nAcesse: ${shareData.url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS);
        } catch {
            // The user dismissed the native share sheet or clipboard access was denied; nothing to recover here.
        }
    };

    return (
        <Skeleton loading={isLoading} w="100%">
            <VStack flex={1} align={{ base: "center", md: "start" }}>
                <SimpleButton onClick={shareVolume}>
                    <HStack>
                        {copied ? <LuCheck /> : <LuShare />}
                        <Text>{t("share")}</Text>
                    </HStack>
                </SimpleButton>
            </VStack>
        </Skeleton>
    );
}
