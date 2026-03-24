"use client";

import { memo } from "react";
import { Heading, Text, VStack } from "@chakra-ui/react";

import type { SectionHeadingProps } from "types";

const SectionHeading = (props: SectionHeadingProps) => {
    return (
        <>
            <VStack w="100%" flex={1} align={{ base: "center", md: "start" }}>
                <Heading fontSize={"2xl"} fontWeight={"bold"} textAlign={"justify"}>
                    {props.header}
                </Heading>
                {props.description && (
                    <Text ml={"2px"} fontSize={"lg"} textAlign={{ base: "center", md: "start" }}>
                        {props.description}
                    </Text>
                )}
            </VStack>
        </>
    );
};

export default memo(SectionHeading);
