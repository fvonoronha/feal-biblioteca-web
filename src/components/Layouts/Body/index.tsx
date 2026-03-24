"use client";

import { memo } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { APP_MAX_WIDTH_IN_PX } from "utils";

const Body = (props: BoxProps) => {
    return (
        <Box
            minH="calc(100vh - 50px)"
            bg={{ base: "gray.100", _dark: "gray.900" }}
            w="100%"
            py={{ base: "4", md: "8" }} // Um respiro vertical ajuda na estética
        >
            <Box
                // Alteração: 1600px é o "sweet spot" para layouts modernos
                maxW={`${APP_MAX_WIDTH_IN_PX}px`}
                mx="auto"
                w="100%"
                px={{ base: "4", md: "6", lg: "10" }}
                {...props}
            >
                {props.children}
            </Box>
        </Box>
    );

    return (
        <Box minH="calc(100vh - 50px)" bg={{ base: "gray.100", _dark: "gray.900" }} w="100%">
            <Box bg="yellow" maxW="1440px" mx="auto" px={{ base: "10px", md: "20px", lg: "40px" }} {...props}>
                {props.children}
            </Box>
        </Box>
    );
};

export default memo(Body);
