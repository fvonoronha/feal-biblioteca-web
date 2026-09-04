"use client";

import { memo } from "react";
import { Text, Stack } from "@chakra-ui/react";

import type { BannerProps } from "types";

const PageHeading = (props: BannerProps) => {
    return (
        <>
            <Stack p={2} borderRadius="md" bg="fealRed.200" color="fealRed.600">
                <Text fontSize="sm">{props.message}</Text>
            </Stack>
        </>
    );
};

export default memo(PageHeading);
