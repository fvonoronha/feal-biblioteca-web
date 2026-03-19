"use client";

import { memo } from "react";
import { Button } from "@chakra-ui/react";
import { SimpleButtonProps } from "types";

const SimpleButton = (props: SimpleButtonProps) => {
    return (
        <>
            <Button
                variant="plain"
                fontSize={"md"}
                color={"white"}
                bg={`fealRed`}
                // _hover={{ bg: { base: `fealPurple`, _dark: `${color}.800` } }}
                {...props}
            >
                {props.children}
            </Button>
        </>
    );
};

export default memo(SimpleButton);
