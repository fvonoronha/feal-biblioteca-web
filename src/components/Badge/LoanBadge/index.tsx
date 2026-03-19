import { memo } from "react";
import { Badge } from "@chakra-ui/react";
import { SimpleTooltip } from "components";
import type { LoanBadgeProps } from "types";
import { parseDateFullText } from "utils";
import { useTranslations } from "next-intl";

const LoanBadge = (props: LoanBadgeProps) => {
    const t = useTranslations("Utils");

    const loan = props.bookLoan || null;
    return (
        <>
            <SimpleTooltip
                content={
                    !loan
                        ? t("availableTooltip")
                        : t("loanedTooltip", { due_date: parseDateFullText(new Date(loan?.due_date)) })
                }
                openDelay={500}
                closeDelay={0}
                showArrow
            >
                <Badge
                    px={"10px"}
                    py={"3px"}
                    bg={!loan ? { base: "green", _dark: "green" } : { base: "fealRed", _dark: "fealRed" }}
                    color={{ base: "white", _dark: "white" }}
                    variant="solid"
                    cursor="pointer"
                    {...props}
                >
                    {!loan ? t("available") : t("loaned")}
                </Badge>
            </SimpleTooltip>
        </>
    );
};

export default memo(LoanBadge);
