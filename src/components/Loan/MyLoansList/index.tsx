"use client";

import { memo } from "react";
import { Card, HStack, VStack, Text, Box, Center, Spinner, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoanStatus, BookCoverFlip } from "components";
import { GhostButton } from "components";
import { useMyLoans } from "hooks";
import { parseDateFullText } from "utils";

function MyLoansList() {
    const t = useTranslations("ProfilePage");
    const router = useRouter();
    const { loans, isLoansLoading, isLoansLoadingFirstPage, isLoansLoadingFailed, pagination, canAutoLoad, loadMore } = useMyLoans();

    if (isLoansLoadingFirstPage) {
        return (
            <Center py={10}>
                <Spinner size="md" color="fealRed.solid" />
            </Center>
        );
    }

    if (isLoansLoadingFailed) {
        return (
            <Text fontSize="sm" color="fg.muted">
                {t("loansLoadError")}
            </Text>
        );
    }

    if (loans.length === 0) {
        return (
            <Text fontSize="sm" color="fg.muted">
                {t("loansEmpty")}
            </Text>
        );
    }

    return (
        <VStack align="stretch" gap={3} w="full">
            {loans.map((loan) => (
                <Card.Root
                    key={loan.id}
                    p={3}
                    variant="outline"
                    shadow="sm"
                    cursor="pointer"
                    onClick={() => router.push(`/v/${loan.volume.slug}`)}
                    _hover={{ borderColor: "fealRed.solid" }}
                    transition="border-color .15s"
                >
                    <HStack align="start" gap={3}>
                        <BookCoverFlip coverUrl={loan.volume.cover_url} alt={loan.volume.book?.title || ""} w="48px" />

                        <VStack align="start" gap={0} flex={1}>
                            <Text fontWeight="bold" lineClamp={1}>
                                {loan.volume.book?.title}
                            </Text>
                            <Text fontSize="xs" color="fg.muted">
                                {t("loansTakenAt", { date: parseDateFullText(loan.loan_date) })}
                            </Text>
                        </VStack>

                        <Box textAlign="right" flexShrink={0}>
                            <LoanStatus loan={loan} isDesktop />
                        </Box>
                    </HStack>
                </Card.Root>
            ))}

            {!canAutoLoad && pagination.has_next && (
                <Center pt={2}>
                    <GhostButton onClick={loadMore} loading={isLoansLoading}>
                        <Heading size="sm">{t("loansLoadMore")}</Heading>
                    </GhostButton>
                </Center>
            )}
        </VStack>
    );
}

export default memo(MyLoansList);
