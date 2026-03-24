"use client";

import { memo } from "react";
import { Badge } from "@chakra-ui/react";
// import { SimpleTooltip } from "components";
import type { ShelfBadgeProps } from "types";
// import { parseDateFullText } from "utils";
// import { useTranslations } from "next-intl";
import { LuLibraryBig } from "react-icons/lu";

const ShelfBadge = (props: ShelfBadgeProps) => {
    // const t = useTranslations("Utils");

    const shelf = props.shelf || null;
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
                {shelf}
                <LuLibraryBig />
            </Badge>
        </>
    );
};

export default memo(ShelfBadge);
