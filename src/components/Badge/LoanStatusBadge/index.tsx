import { Box, Text, VStack } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { parseDateFullText, getDatesDistance } from "utils";
import { Loan } from "types";

function relativeDaysLabel(
    t: ReturnType<typeof useTranslations>,
    days: number,
    keys: { same: string; one: string; many: string }
) {
    if (days === 0) return t(keys.same);
    if (days === 1) return t(keys.one);
    return t(keys.many, { days });
}

export function LoanStatus({ loan, isDesktop = false }: { loan: Loan; isDesktop?: boolean }) {
    const t = useTranslations("Loans");

    const Container = isDesktop ? VStack : Box;
    const containerProps = isDesktop ? { align: "start", gap: 0 } : { textAlign: "right" as const };
    const labelColor = isDesktop ? "fg.muted" : "fg.subtle";

    if (loan.return_date) {
        return (
            <Container {...containerProps}>
                {!isDesktop && <Text color="fg.muted">{t("statusReturnedAt")}</Text>}
                <Text fontWeight="bold">{parseDateFullText(loan.return_date)}</Text>
                <Text color={labelColor} textStyle="xs">
                    {relativeDaysLabel(t, getDatesDistance(loan.loan_date, loan.return_date), {
                        same: "relativeSameDay",
                        one: "relativeAfterOneDay",
                        many: "relativeAfterDays"
                    })}
                </Text>
                {loan.updated_by_user && (
                    <Text color="fg.subtle" textStyle="xs" fontStyle="italic">
                        {t("returnedBy", { name: loan.updated_by_user.display_name || loan.updated_by_user.name })}
                    </Text>
                )}
            </Container>
        );
    }

    if (new Date() > new Date(loan.due_date)) {
        return (
            <Container {...containerProps}>
                <Text fontWeight="bold" color="fealRed.solid">
                    {t("statusOverdue")}
                </Text>
                <Text color={labelColor} textStyle="xs">
                    {(() => {
                        const days = getDatesDistance(loan.due_date, new Date());
                        if (days === 0) return t("relativeDueToday");
                        if (days === 1) return t("relativeDueYesterday");
                        return t("relativeOverdueDays", { days });
                    })()}
                </Text>
            </Container>
        );
    }

    return (
        <Container {...containerProps}>
            {!isDesktop && <Text color="fg.muted">{t("statusOpenLabel")}</Text>}
            <Text
                fontWeight={!isDesktop ? "bold" : "normal"}
                color={!isDesktop ? "yellow.600" : "fg.muted"}
                textStyle={isDesktop ? "xs" : undefined}
            >
                {t("statusOpen")}
            </Text>
        </Container>
    );
}
