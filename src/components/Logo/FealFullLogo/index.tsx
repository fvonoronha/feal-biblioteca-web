"use client";

import { memo } from "react";
import { Image, HStack, VStack } from "@chakra-ui/react";
import { FealLogoProps } from "types";
import { fealIdentity } from "assets";
import { useColorMode } from "components";

const FealFullLogo = (props: FealLogoProps) => {
    const colorMode = useColorMode();
    const name = props.name || null;
    return (
        <VStack align={"center"} {...props}>
            <HStack align={"center"} {...props}>
                <Image
                    src={
                        colorMode.colorMode === "dark"
                            ? fealIdentity.logo_name_white.src
                            : fealIdentity.logo_name_black.src
                    }
                    alt={name || "Feal"}
                    h="80px"
                />
            </HStack>
        </VStack>
    );
};

export default memo(FealFullLogo);
