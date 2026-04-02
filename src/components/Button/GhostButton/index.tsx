"use client";

import { memo } from "react";
import { Button } from "@chakra-ui/react";
import { SimpleButtonProps } from "types";

const SimpleButton = (props: SimpleButtonProps) => {
    return (
        <>
            <Button
                p={0}
                variant="ghost"
                fontSize={"md"}
                bg={"none"}
                color={{ base: `black`, _dark: "white" }}
                _hover={{ color: { base: `fealRedHover`, _dark: `fealRed` } }}
                {...props}
            >
                {props.children}
            </Button>
        </>
    );
};

export default memo(SimpleButton);
