import { HStack, Button } from "@chakra-ui/react";
import { LuPhone, LuBookDown, LuRotateCw } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { Loan } from "types";

interface LoanActionsProps {
    loan: Loan;
    onRequestReturn: (loan: Loan) => void;
    onRequestRenew: (loan: Loan) => void;
}

export function LoanActions({ loan, onRequestReturn, onRequestRenew }: LoanActionsProps) {
    const t = useTranslations("Loans");
    const isReturned = !!loan.return_date;

    return (
        <HStack gap={2} pt={2} w="full" flexWrap="wrap" justifyContent="flex-end">
            <a
                href={`https://wa.me/55${loan.user.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, minWidth: "120px" }}
            >
                <Button w="full" colorPalette="green">
                    <LuPhone /> {t("whatsappButton")}
                </Button>
            </a>

            {!isReturned && (
                <>
                    <Button flex={1} minW="120px" variant="outline" onClick={() => onRequestRenew(loan)}>
                        <LuRotateCw /> {t("renewButton")}
                    </Button>

                    <Button flex={1} minW="120px" onClick={() => onRequestReturn(loan)}>
                        <LuBookDown /> {t("returnButton")}
                    </Button>
                </>
            )}
        </HStack>
    );
}
