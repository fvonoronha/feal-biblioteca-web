"use client";

import { memo } from "react";
import { Badge, Image } from "@chakra-ui/react";
import type { LabelBadgeProps } from "types";
import { fealIdentity } from "assets";

const LoanBadge = (props: LabelBadgeProps) => {
    const label = props.label || null;
    const blue500 = "#0b94db";
    const red500 = "#ef4444";

    const imgSize = props.size === "md" ? "20px" : props.size === "lg" ? "30px" : "15px";

    return (
        <Badge
            px={"4px"}
            py={"0px"}
            bg={{ base: "white", _dark: "white" }}
            color={{ base: "black", _dark: "black" }}
            cursor="pointer"
            boxShadow={`0 0 0 2px ${red500}, 0 0 0 4px ${blue500}, 0 0 0 6px white`}
            {...props}
            fontSize={props.size}
            // ToDo: Ajustar para negrito talvez?
        >
            <Image src={fealIdentity.logo.src} w={imgSize} alt="Feal" />
            {label}
        </Badge>
    );
};

export default memo(LoanBadge);
