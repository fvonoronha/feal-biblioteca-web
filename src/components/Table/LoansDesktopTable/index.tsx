import { Table, HStack, Avatar, VStack, Text, Image } from "@chakra-ui/react";
import { LabelBadge, LoanStatus, LoanActions } from "components";
import { parseDateFullText, getDatesDistance } from "utils";
import { Loan } from "types";

interface Props {
    loans: Loan[];
    returningLoanId: string | number | null;
    onReturnLoan: (id: number) => void;
}

export function LoansDesktopTable({ loans, returningLoanId, onReturnLoan }: Props) {
    return (
        <Table.Root interactive size="sm" variant="line">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Usuário</Table.ColumnHeader>
                    <Table.ColumnHeader>Título</Table.ColumnHeader>
                    <Table.ColumnHeader>Retirado em</Table.ColumnHeader>
                    <Table.ColumnHeader>Status/Devolução</Table.ColumnHeader>
                    <Table.ColumnHeader>Ações</Table.ColumnHeader>
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
                                <Image
                                    borderRadius="sm"
                                    src={loan.volume.cover_url}
                                    alt={loan.volume.book.title}
                                    objectFit="cover"
                                    w="50px"
                                />
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold">{loan.volume.book.title}</Text>
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
                                        ? "Hoje"
                                        : `Há ${getDatesDistance(loan.loan_date, new Date())} dias`}
                                </Text>
                            </VStack>
                        </Table.Cell>

                        {/* Célula Status */}
                        <Table.Cell>
                            <LoanStatus loan={loan} isDesktop />
                        </Table.Cell>

                        {/* Célula Ações */}
                        <Table.Cell>
                            <LoanActions loan={loan} returningLoanId={returningLoanId} onReturnLoan={onReturnLoan} />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
