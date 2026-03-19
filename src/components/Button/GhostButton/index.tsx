"use client";

import { memo } from "react";
import { Button } from "@chakra-ui/react";
import { SimpleButtonProps } from "types";

const SimpleButton = (props: SimpleButtonProps) => {
    return (
        <>
            <Button
                variant="ghost"
                fontSize={"md"}
                color={{ base: `black`, _dark: "white" }}
                _hover={{ color: { base: `fealRed`, _dark: `fealRed` } }}
                {...props}
            >
                {props.children}
            </Button>
        </>
    );
};

export default memo(SimpleButton);
