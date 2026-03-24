"use client";

import { memo } from "react";
import { Badge } from "@chakra-ui/react";
import type { MultipleImagesBadgeProps } from "types";
import { LuFileImage } from "react-icons/lu";

const LoanBadge = (props: MultipleImagesBadgeProps) => {
    const imagesLen = (props.images || []).length;
    return imagesLen > 1 ? (
        <>
            <Badge
                px={"10px"}
                py={"3px"}
                bg={{ base: "white", _dark: "white" }}
                color={{ base: "black", _dark: "black" }}
                // color={{ base: "fealLightBlue", _dark: "fealLightBlue" }}
                variant="solid"
                cursor="pointer"
                gap={1}
                {...props}
            >
                {imagesLen}
                <LuFileImage />
            </Badge>
        </>
    ) : (
        <></>
    );
};

export default memo(LoanBadge);
