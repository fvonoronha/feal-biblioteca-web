"use client";

import { ReactNode } from "react";
import { Badge, HStack, Skeleton, Text, Wrap } from "@chakra-ui/react";

type ChipItem = {
    key: string | number;
    label: string;
    onClick?: () => void;
};

type Props = {
    icon: ReactNode;
    label: string;
    items: ChipItem[];
    isLoading: boolean;
};

/**
 * A "label + wrap of chips" block shared by keywords and tags on a volume's page.
 */
export default function VolumeChipList({ icon, label, items, isLoading }: Props) {
    if (!items || items.length === 0) return null;

    return (
        <Skeleton loading={isLoading} w="100%">
            <HStack mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                {icon}
                <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                    {label}
                </Text>
            </HStack>

            <Wrap gap={2}>
                {items.map((item) => (
                    <Badge
                        key={item.key}
                        variant="outline"
                        borderWidth="1.5px"
                        borderRadius="full"
                        px={3}
                        py={1}
                        cursor={item.onClick ? "pointer" : "default"}
                        transition="all 0.2s"
                        onClick={item.onClick}
                        _hover={item.onClick ? { bg: "fealRed.solid", color: "white", borderColor: "fealRed.solid" } : undefined}
                    >
                        {item.label}
                    </Badge>
                ))}
            </Wrap>
        </Skeleton>
    );
}
