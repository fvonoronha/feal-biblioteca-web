"use client";

import { memo } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { APP_MAX_WIDTH_IN_PX } from "utils";

const Body = (props: BoxProps) => {
    return (
        <Box bg="gray.subtle" w="100%" py={{ base: "4", md: "8" }}>
            <Box maxW={`${APP_MAX_WIDTH_IN_PX}px`} mx="auto" w="100%" px={{ base: "4", md: "6", lg: "10" }} {...props}>
                {props.children}
            </Box>
        </Box>
    );
};

export default memo(Body);
