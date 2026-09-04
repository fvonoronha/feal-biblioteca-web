import { Box, Text, VStack } from "@chakra-ui/react";
import { parseDateFullText, getDatesDistance } from "utils";
import { Loan } from "types";

export function LoanStatus({ loan, isDesktop = false }: { loan: Loan; isDesktop?: boolean }) {
    const Container = isDesktop ? VStack : Box;
    const containerProps = isDesktop ? { align: "start", gap: 0 } : { textAlign: "right" as const };
    const labelColor = isDesktop ? "fg.muted" : "fg.subtle";

    if (loan.return_date) {
        return (
            <Container {...containerProps}>
                {!isDesktop && <Text color="fg.muted">Devolvido em:</Text>}
                <Text fontWeight="bold">{parseDateFullText(loan.return_date)}</Text>
                <Text color={labelColor} textStyle="xs">
                    {getDatesDistance(loan.loan_date, loan.return_date) === 0
                        ? "No mesmo dia"
                        : getDatesDistance(loan.loan_date, loan.return_date) === 1
                          ? "Após 1 dia"
                          : `Após ${getDatesDistance(loan.loan_date, loan.return_date)} dias`}
                </Text>
            </Container>
        );
    }

    if (new Date() > new Date(loan.due_date)) {
        return (
            <Container {...containerProps}>
                <Text fontWeight="bold" color="fealRed">
                    Em atraso!!!
                </Text>
                <Text color={labelColor} textStyle="xs">
                    {getDatesDistance(loan.due_date, new Date()) === 0
                        ? "prazo vence hoje"
                        : getDatesDistance(loan.due_date, new Date()) === 1
                          ? "prazo venceu ontem"
                          : `atrasado há ${getDatesDistance(loan.due_date, new Date())} dias`}
                </Text>
            </Container>
        );
    }

    return (
        <Container {...containerProps}>
            {!isDesktop && <Text color="fg.muted">Status:</Text>}
            <Text
                fontWeight={!isDesktop ? "bold" : "normal"}
                color={!isDesktop ? "yellow.600" : "fg.muted"}
                textStyle={isDesktop ? "xs" : undefined}
            >
                Em Aberto
            </Text>
        </Container>
    );
}
