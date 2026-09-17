"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    Body,
    PageHeading,
    SimpleButton,
    LoansDesktopTable,
    LoansMobileTable,
    LoanFiltersBar,
    ConfirmDialog
} from "components";
import { Box, Flex, useBreakpointValue, Spinner, Center, Skeleton, Text, VStack } from "@chakra-ui/react";
import { LuBookPlus, LuChevronDown } from "react-icons/lu";
import { useLoans } from "hooks";

export default function Collection() {
    const t = useTranslations("Loans");
    const isDesktop = useBreakpointValue({ base: false, lg: true });
    const router = useRouter();

    // Todo o estado e regras de negócio encapsuladas!
    const {
        loans,
        isLoansLoading,
        isLoansLoadingFirstPage,
        isLoansReloading,
        isLoansLoadingFailed,
        loadMoreRef,
        pagination,
        canAutoLoad,
        loadMore,
        userSearch,
        setUserSearch,
        volumeSearch,
        setVolumeSearch,
        state,
        setState,
        sort,
        setSort,
        pendingAction,
        isActionSubmitting,
        requestReturnLoan,
        requestRenewLoan,
        cancelPendingAction,
        confirmPendingAction
    } = useLoans();

    return (
        <Body>
            <Flex
                pb="24px"
                w="100%"
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "flex-end" }}
                justify="space-between"
                gap={4}
            >
                <PageHeading header={t("title")} description={t("description")} />

                <SimpleButton flexShrink={0} onClick={() => router.push("/emprestimos/novo")}>
                    <LuBookPlus /> {t("newLoanButton")}
                </SimpleButton>
            </Flex>

            <LoanFiltersBar
                userSearch={userSearch}
                onUserSearchChange={setUserSearch}
                volumeSearch={volumeSearch}
                onVolumeSearchChange={setVolumeSearch}
                state={state}
                onStateChange={setState}
                sort={sort}
                onSortChange={setSort}
            />

            <Box w="full">
                {isLoansLoadingFirstPage ? (
                    <Center py={16}>
                        <Spinner size="lg" color="fealRed.solid" />
                    </Center>
                ) : isLoansLoadingFailed ? (
                    <Center py={16}>
                        <Text color="fg.muted">{t("loadingError")}</Text>
                    </Center>
                ) : loans.length === 0 ? (
                    <Center py={16}>
                        <Text color="fg.muted">{t("nothingFound")}</Text>
                    </Center>
                ) : (
                    <Skeleton loading={isLoansReloading}>
                        {isDesktop ? (
                            <LoansDesktopTable loans={loans} onRequestReturn={requestReturnLoan} onRequestRenew={requestRenewLoan} />
                        ) : (
                            <LoansMobileTable loans={loans} onRequestReturn={requestReturnLoan} onRequestRenew={requestRenewLoan} />
                        )}
                    </Skeleton>
                )}

                {!isLoansLoadingFirstPage && loans.length > 0 && (
                    <>
                        {canAutoLoad ? (
                            <Box ref={loadMoreRef} h="40px" w="full">
                                {isLoansLoading && (
                                    <Center h="full">
                                        <Spinner size="md" />
                                    </Center>
                                )}
                            </Box>
                        ) : pagination.has_next ? (
                            <Center py={8}>
                                <SimpleButton onClick={loadMore} disabled={isLoansLoading}>
                                    {isLoansLoading ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <>
                                            <LuChevronDown />
                                            {t("loadMoreButtonWithCount", {
                                                shown: loans.length,
                                                total: pagination.total_elements
                                            })}
                                        </>
                                    )}
                                </SimpleButton>
                            </Center>
                        ) : (
                            <VStack py={8}>
                                <Text color="fg.muted" fontSize="sm">
                                    {t("endOfResults", { total: pagination.total_elements })}
                                </Text>
                            </VStack>
                        )}
                    </>
                )}
            </Box>

            <ConfirmDialog
                open={!!pendingAction}
                onOpenChange={(open) => !open && cancelPendingAction()}
                title={pendingAction?.type === "renew" ? t("confirmRenewTitle") : t("confirmReturnTitle")}
                description={
                    pendingAction
                        ? pendingAction.type === "renew"
                            ? t("confirmRenewDescription", {
                                  title: pendingAction.loan.volume.book.title,
                                  name: pendingAction.loan.user.name
                              })
                            : t("confirmReturnDescription", {
                                  title: pendingAction.loan.volume.book.title,
                                  name: pendingAction.loan.user.name
                              })
                        : undefined
                }
                confirmLabel={pendingAction?.type === "renew" ? t("confirmRenewAction") : t("confirmReturnAction")}
                cancelLabel={t("confirmCancel")}
                onConfirm={confirmPendingAction}
                isLoading={isActionSubmitting}
            />
        </Body>
    );
}
