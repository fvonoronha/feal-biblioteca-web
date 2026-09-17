import { Card, HStack, Avatar, VStack, Text, Box, Separator, Stack, Badge } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { LabelBadge, LoanStatus, LoanActions, BookCoverFlip } from "components";
import { parseDateFullText, getDatesDistance } from "utils";
import { Loan } from "types";

interface Props {
    loans: Loan[];
    onRequestReturn: (loan: Loan) => void;
    onRequestRenew: (loan: Loan) => void;
}

export function LoansMobileTable({ loans, onRequestReturn, onRequestRenew }: Props) {
    const t = useTranslations("Loans");

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
                            <BookCoverFlip coverUrl={obj.volume.cover_url} alt={obj.volume.book.title} w="60px" />
                            <VStack align="start" gap={1} flex="1">
                                <HStack gap={1.5} wrap="wrap">
                                    <Text fontWeight="bold" lineClamp={2}>
                                        {obj.volume.book.title}
                                    </Text>
                                    {obj.renewed_from_loan_id && (
                                        <Badge size="xs" colorPalette="blue" variant="subtle">
                                            {t("statusRenewedTag")}
                                        </Badge>
                                    )}
                                </HStack>
                                <Text textStyle="xs" color="fg.muted">
                                    {obj.volume.publisher?.abbreviation ? `${obj.volume.publisher?.abbreviation} - ` : ""}
                                    {obj.volume.publisher?.name}
                                </Text>
                                <LabelBadge w="65px" label={obj.volume.label} />
                            </VStack>
                        </HStack>

                        <Separator />

                        {/* Datas do Empréstimo */}
                        <Stack direction="row" justify="space-between" textStyle="xs">
                            <Box>
                                <Text color="fg.muted">{t("columnTakenAt")}:</Text>
                                <Text fontWeight="bold">{parseDateFullText(obj.loan_date)}</Text>
                                <Text color="fg.subtle">
                                    {getDatesDistance(obj.loan_date, new Date()) === 0
                                        ? t("relativeToday")
                                        : getDatesDistance(obj.loan_date, new Date()) === 1
                                          ? t("relativeYesterday")
                                          : t("relativeDaysAgo", { days: getDatesDistance(obj.loan_date, new Date()) })}
                                </Text>
                                {obj.created_by_user && (
                                    <Text color="fg.subtle" fontStyle="italic">
                                        {t("registeredBy", {
                                            name: obj.created_by_user.display_name || obj.created_by_user.name
                                        })}
                                    </Text>
                                )}
                            </Box>

                            <Box textAlign="right">
                                <LoanStatus loan={obj} isDesktop />
                            </Box>
                        </Stack>

                        {/* Botões de Ação */}
                        <LoanActions loan={obj} onRequestReturn={onRequestReturn} onRequestRenew={onRequestRenew} />
                    </Card.Body>
                </Card.Root>
            ))}
        </VStack>
    );
}
