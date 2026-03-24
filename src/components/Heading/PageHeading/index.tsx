"use client";

import { memo } from "react";
import { Heading, Text, Flex } from "@chakra-ui/react";

import type { PageHeadingProps } from "types";

const PageHeading = (props: PageHeadingProps) => {
    return (
        <>
            <Flex w="100%" direction="column" gap={2} align={"flex-start"}>
                <Heading w="100%" fontSize={"4xl"} fontWeight={"bold"} textAlign={"justify"}>
                    {props.header}
                </Heading>

                <Text w="100%" ml={"2px"} fontSize={"lg"} textAlign={"justify"}>
                    {props.description}
                </Text>
            </Flex>
        </>
    );
};

export default memo(PageHeading);
