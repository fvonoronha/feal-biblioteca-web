"use client";

import { memo } from "react";
import { Badge } from "@chakra-ui/react";
import { SimpleTooltip } from "components";
import type { LoanBadgeProps } from "types";
import { parseDateFullText } from "utils";
import { useTranslations } from "next-intl";
import { LuCalendarX } from "react-icons/lu";

const LoanBadge = ({ isAvailable, dueDate, ...props }: LoanBadgeProps) => {
    const t = useTranslations("Utils");

    if (isAvailable) return null;

    return (
        <SimpleTooltip
            content={dueDate ? t("loanedTooltip", { due_date: parseDateFullText(new Date(dueDate)) }) : t("loaned")}
            openDelay={500}
            closeDelay={0}
            showArrow
        >
            <Badge px="10px" py="3px" bg="fealRed.solid" color="white" variant="solid" cursor="default" {...props}>
                {t("loaned")}
                <LuCalendarX />
            </Badge>
        </SimpleTooltip>
    );
};

export default memo(LoanBadge);
