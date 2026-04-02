"use client";

import { memo } from "react";
import { Heading, Image, HStack, VStack } from "@chakra-ui/react";
import { FealLogoProps } from "types";
import { fealIdentity } from "assets";

const FealLogo = (props: FealLogoProps) => {
    const sz = props.size || "big";
    const name = props.name || null;
    return sz === "big" ? (
        <VStack align={"center"} {...props}>
            <HStack align={"center"} {...props}>
                <Image w="70px" src={fealIdentity.logo.src} alt={name || "Feal"} />

                <Heading ml={"10px"} fontSize={60} color={{ base: "black", _dark: "white" }} mt={"-3"}>
                    {name}
                </Heading>
            </HStack>
        </VStack>
    ) : (
        <VStack align={"center"} {...props}>
            <HStack align={"center"} {...props}>
                <Image w="30px" src={fealIdentity.logo.src} alt={name || "Feal"} />

                <Heading ml={"5px"} color={{ base: "black", _dark: "white" }}>
                    {name}
                </Heading>
            </HStack>
        </VStack>
    );
};

export default memo(FealLogo);
