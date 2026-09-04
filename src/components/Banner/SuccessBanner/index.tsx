"use client";

import { memo } from "react";
import { Text, Stack } from "@chakra-ui/react";

import type { BannerProps } from "types";

const SuccessBanner = (props: BannerProps) => {
    return (
        <>
            <Stack p={2} borderRadius="md" bg="green.100" color="green.700">
                <Text fontSize="sm">{props.message}</Text>
            </Stack>
        </>
    );
};

export default memo(SuccessBanner);
