import { Table, HStack, Avatar, VStack, Text, Badge } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { LabelBadge, LoanStatus, LoanActions, BookCoverFlip } from "components";
import { parseDateFullText, getDatesDistance } from "utils";
import { Loan } from "types";

interface Props {
    loans: Loan[];
    onRequestReturn: (loan: Loan) => void;
    onRequestRenew: (loan: Loan) => void;
}

export function LoansDesktopTable({ loans, onRequestReturn, onRequestRenew }: Props) {
    const t = useTranslations("Loans");

    return (
        <Table.Root interactive size="sm" variant="line">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>{t("columnUser")}</Table.ColumnHeader>
                    <Table.ColumnHeader>{t("columnVolume")}</Table.ColumnHeader>
                    <Table.ColumnHeader>{t("columnTakenAt")}</Table.ColumnHeader>
                    <Table.ColumnHeader>{t("columnStatus")}</Table.ColumnHeader>
                    <Table.ColumnHeader>{t("columnActions")}</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {loans.map((loan) => (
                    <Table.Row key={loan.id}>
                        {/* Célula do Usuário */}
                        <Table.Cell>
                            <HStack gap={3}>
                                <Avatar.Root variant="subtle">
                                    <Avatar.Fallback name={loan.user.name} />
                                </Avatar.Root>
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold">{loan.user.name}</Text>
                                    <Text color="fg.muted" textStyle="xs">
                                        {loan.user.phone}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Table.Cell>

                        {/* Célula do Livro */}
                        <Table.Cell>
                            <HStack align="start" gap={2}>
                                <BookCoverFlip coverUrl={loan.volume.cover_url} alt={loan.volume.book.title} w="50px" />
                                <VStack align="start" gap={0}>
                                    <HStack gap={1.5}>
                                        <Text fontWeight="bold">{loan.volume.book.title}</Text>
                                        {loan.renewed_from_loan_id && (
                                            <Badge size="xs" colorPalette="blue" variant="subtle">
                                                {t("statusRenewedTag")}
                                            </Badge>
                                        )}
                                    </HStack>
                                    <Text color="fg.muted" textStyle="xs" pb={1}>
                                        {loan.volume.publisher?.abbreviation
                                            ? `${loan.volume.publisher?.abbreviation} - `
                                            : ""}
                                        {loan.volume.publisher?.name}
                                    </Text>
                                    <LabelBadge w="65px" label={loan.volume.label} />
                                </VStack>
                            </HStack>
                        </Table.Cell>

                        {/* Célula Data Retirada */}
                        <Table.Cell>
                            <VStack align="start" gap={0}>
                                <Text fontWeight="bold">{parseDateFullText(loan.loan_date)}</Text>
                                <Text color="fg.muted" textStyle="xs">
                                    {getDatesDistance(loan.loan_date, new Date()) === 0
                                        ? t("relativeToday")
                                        : t("relativeDaysAgo", { days: getDatesDistance(loan.loan_date, new Date()) })}
                                </Text>
                                {loan.created_by_user && (
                                    <Text color="fg.subtle" textStyle="xs" fontStyle="italic">
                                        {t("registeredBy", {
                                            name: loan.created_by_user.display_name || loan.created_by_user.name
                                        })}
                                    </Text>
                                )}
                            </VStack>
                        </Table.Cell>

                        {/* Célula Status */}
                        <Table.Cell>
                            <LoanStatus loan={loan} isDesktop />
                        </Table.Cell>

                        {/* Célula Ações */}
                        <Table.Cell>
                            <LoanActions
                                loan={loan}
                                onRequestReturn={onRequestReturn}
                                onRequestRenew={onRequestRenew}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
