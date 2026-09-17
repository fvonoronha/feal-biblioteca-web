"use client";

import { ReactNode } from "react";
import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";

type Props = {
    icon: ReactNode;
    label: string;
    text?: string;
    isLoading: boolean;
};

/**
 * An "icon + label heading + paragraph" block, shared by the description,
 * summary and recommended-for sections of a volume's details.
 */
export default function VolumeTextSection({ icon, label, text, isLoading }: Props) {
    if (!text) return null;

    return (
        <Skeleton loading={isLoading} w="100%">
            <Box w="100%">
                <HStack mb={2} color="fealRed.solid">
                    {icon}
                    <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" color={{ base: "gray.700", _dark: "gray.300" }}>
                        {label}
                    </Text>
                </HStack>

                <Text color="fg.muted" textAlign="justify" lineHeight="tall">
                    {text}
                </Text>
            </Box>
        </Skeleton>
    );
}
