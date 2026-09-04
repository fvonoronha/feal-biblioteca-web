"use client";

import { useTranslations } from "next-intl";
import { Body, PageHeading, LoansDesktopTable, LoansMobileTable } from "components";
import { Box, useBreakpointValue, VStack, Spinner, Center } from "@chakra-ui/react";
import { useLoans } from "hooks";

export default function Collection() {
    const t = useTranslations("Loans");
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    // Todo o estado e regras de negócio encapsuladas!
    const { loans, isLoansLoading, returningLoanId, loadMoreRef, handleReturnLoan } = useLoans();

    return (
        <Body>
            <VStack pb="24px" align="start">
                <PageHeading header={t("title")} description={t("description")} />
            </VStack>

            <Box w="full">
                {isDesktop ? (
                    <LoansDesktopTable
                        loans={loans}
                        returningLoanId={returningLoanId}
                        onReturnLoan={handleReturnLoan}
                    />
                ) : (
                    <LoansMobileTable loans={loans} returningLoanId={returningLoanId} onReturnLoan={handleReturnLoan} />
                )}

                {/* Ref para o Infinite Scroll */}
                <Box ref={loadMoreRef} h="40px" w="full">
                    {isLoansLoading && (
                        <Center h="full">
                            <Spinner size="md" />
                        </Center>
                    )}
                </Box>
            </Box>
        </Body>
    );
}
