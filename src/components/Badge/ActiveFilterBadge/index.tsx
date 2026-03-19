import { memo } from "react";
import { Badge } from "@chakra-ui/react";
import type { ActiveFilterBadgeProps } from "types";
import { LuX } from "react-icons/lu";

const MAX_BADGE_LENGTH = 25;

const ActiveFilterBadge = (props: ActiveFilterBadgeProps) => {
    return (
        <>
            <Badge
                display="inline-flex"
                px={2}
                py={1}
                bg={{ base: "white", _dark: "black" }}
                variant="outline"
                borderWidth="2px"
                cursor="pointer"
                {...props}
                _hover={{ bg: "fealRed", color: "white" }}
                onClick={() => {
                    console.log("removeFrom: ", props.value);
                    props.cancelFilter(props.value);
                }}
            >
                {props.label.length > MAX_BADGE_LENGTH ? props.label.slice(0, MAX_BADGE_LENGTH) + "..." : props.label}{" "}
                <LuX />
            </Badge>
        </>
    );
};

export default memo(ActiveFilterBadge);
