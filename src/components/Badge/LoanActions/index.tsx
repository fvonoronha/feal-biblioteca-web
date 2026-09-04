import { HStack, Button } from "@chakra-ui/react";
import { LuPhone, LuBookDown } from "react-icons/lu";
import { Loan } from "types";

interface LoanActionsProps {
    loan: Loan;
    returningLoanId: string | number | null;
    onReturnLoan: (id: number) => void;
}

export function LoanActions({ loan, returningLoanId, onReturnLoan }: LoanActionsProps) {
    return (
        <HStack gap={2} pt={2} w="full" justifyContent="flex-end">
            <a
                href={`https://wa.me/55${loan.user.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1 }}
            >
                <Button w="full" colorPalette="green">
                    <LuPhone /> Whatsapp
                </Button>
            </a>

            {!loan.return_date && (
                <Button flex={1} onClick={() => onReturnLoan(loan.id)} loading={returningLoanId === loan.id}>
                    <LuBookDown /> Baixa
                </Button>
            )}
        </HStack>
    );
}
