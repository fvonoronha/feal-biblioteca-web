import { memo } from "react";
import { Badge } from "@chakra-ui/react";
import { SimpleTooltip } from "components";
import type { LoanBadgeProps } from "types";
import { useTranslations } from "next-intl";

const LoanBadge = (props: LoanBadgeProps) => {
    const t = useTranslations("Utils");

    return (
        <>
            <SimpleTooltip
                content={`Este volume está previsto para ser entregue em DATA AQUI`}
                openDelay={500}
                closeDelay={0}
                showArrow
            >
                <Badge
                    px={"10px"}
                    py={"3px"}
                    bg={{ base: "fealRed", _dark: "fealRed" }}
                    color={{ base: "white", _dark: "white" }}
                    variant="solid"
                    cursor="pointer"
                    {...props}
                >
                    {t("loaned")}
                </Badge>
            </SimpleTooltip>
        </>
    );
};

export default memo(LoanBadge);
