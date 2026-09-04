import { Card, HStack, Avatar, VStack, Text, Image, Box, Separator, Stack } from "@chakra-ui/react";
import { LabelBadge, LoanStatus, LoanActions } from "components";
import { parseDateFullText, getDatesDistance } from "utils";
import { Loan } from "types";

interface Props {
    loans: Loan[];
    returningLoanId: string | number | null;
    onReturnLoan: (id: number) => void;
}

export function LoansMobileTable({ loans, returningLoanId, onReturnLoan }: Props) {
    return (
        <VStack align="stretch" gap={4} w="full">
            {loans.map((obj: Loan) => (
                <Card.Root key={obj.id} p={4} variant="outline" shadow="sm">
                    <Card.Body gap={3} p={0}>
                        {/* Informações do Usuário */}
                        <HStack justify="space-between" align="center">
                            <HStack gap={3}>
                                <Avatar.Root variant="subtle">
                                    <Avatar.Fallback name={obj.user.name} />
                                </Avatar.Root>
                                <Box>
                                    <Text fontWeight="bold">{obj.user.name}</Text>
                                    <Text textStyle="xs" color="fg.muted">
                                        {obj.user.phone}
                                    </Text>
                                </Box>
                            </HStack>
                        </HStack>

                        <Separator />

                        {/* Detalhes do Livro */}
                        <HStack align="start" gap={3}>
                            <Image
                                borderRadius="sm"
                                src={obj.volume.cover_url}
                                alt={obj.volume.book.title}
                                objectFit="cover"
                                w="60px"
                                flexShrink={0}
                            />
                            <VStack align="start" gap={1} flex="1">
                                <Text fontWeight="bold" lineClamp={2}>
                                    {obj.volume.book.title}
                                </Text>
                                <Text textStyle="xs" color="fg.muted">
                                    {obj.volume.publisher?.abbreviation
                                        ? `${obj.volume.publisher?.abbreviation} - `
                                        : ""}
                                    {obj.volume.publisher?.name}
                                </Text>
                                <LabelBadge w="65px" label={obj.volume.label} />
                            </VStack>
                        </HStack>

                        <Separator />

                        {/* Datas do Empréstimo */}
                        <Stack direction="row" justify="space-between" textStyle="xs">
                            <Box>
                                <Text color="fg.muted">Retirado em:</Text>
                                <Text fontWeight="bold">{parseDateFullText(obj.loan_date)}</Text>
                                <Text color="fg.subtle">
                                    {getDatesDistance(obj.loan_date, new Date()) === 0
                                        ? "Hoje"
                                        : getDatesDistance(obj.loan_date, new Date()) === 1
                                          ? "Ontem"
                                          : `Há ${getDatesDistance(obj.loan_date, new Date())} dias`}
                                </Text>
                            </Box>

                            <Box textAlign="right">
                                <LoanStatus loan={obj} isDesktop />
                            </Box>
                        </Stack>

                        {/* Botões de Ação */}
                        <LoanActions loan={obj} returningLoanId={returningLoanId} onReturnLoan={onReturnLoan} />
                    </Card.Body>
                </Card.Root>
            ))}
        </VStack>
    );
}
