"use client";

import { memo } from "react";
import { Badge } from "@chakra-ui/react";
// import { SimpleTooltip } from "components";
import type { LabelBadgeProps } from "types";
// import { parseDateFullText } from "utils";
// import { useTranslations } from "next-intl";
import { LuTag } from "react-icons/lu";

const LoanBadge = (props: LabelBadgeProps) => {
    // const t = useTranslations("Utils");

    const label = props.label || null;
    return (
        <>
            <Badge
                px={"10px"}
                py={"3px"}
                bg={{ base: "white", _dark: "white" }}
                color={{ base: "black", _dark: "black" }}
                variant="solid"
                cursor="pointer"
                {...props}
            >
                {label}
                <LuTag />
            </Badge>
        </>
    );
};

export default memo(LoanBadge);
