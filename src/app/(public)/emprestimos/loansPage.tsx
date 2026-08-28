"use client";

import { useState, useEffect, useRef } from "react";
// Importada a função returnLoan fictícia de endpoints
import { listLoans, returnLoan } from "endpoints";
import { APIPaginatedResponse, Loan, SortOption } from "types";
import { useTranslations } from "next-intl";
import { Body, PageHeading, LabelBadge, SimpleButton } from "components";
import {
    HStack,
    Box,
    useBreakpointValue,
    VStack,
    Text,
    Image,
    Table,
    Avatar,
    Card,
    Stack,
    Separator
} from "@chakra-ui/react";

import {
    PAGINATION_DEFAULT_LOANS_PER_PAGE,
    DEFAULT_LOAN_SORT_OPTION,
    parseDateFullText,
    getDatesDistance
} from "utils";
import { LuPhone, LuBookDown } from "react-icons/lu";

const INTERSECTION_ROOT_MARGIN_IN_PX = 200;

export default function Collection() {
    const t = useTranslations("Loans");
    const isDesktop = useBreakpointValue({ base: false, md: true });

    const pageRef = useRef(1);
    const [hasNext, setHasNext] = useState(true);
    const loadMoreVolumesRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [isLoansLoading, setIsLoansLoading] = useState(true);
    const [, setIsLoansLoadingFailed] = useState(false);

    // Estado para controlar qual empréstimo está sendo baixado no momento (loading individual do botão)
    const [returningLoanId, setReturningLoanId] = useState<string | number | null>(null);

    const [loans, setLoans] = useState<APIPaginatedResponse<Loan>>({
        elements: [],
        pagination: {
            page: 1,
            limit: PAGINATION_DEFAULT_LOANS_PER_PAGE,
            total_elements: PAGINATION_DEFAULT_LOANS_PER_PAGE,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [sort] = useState<SortOption>(DEFAULT_LOAN_SORT_OPTION);

    const loadLoans = async (reset: boolean = false) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoansLoading(true);
        setIsLoansLoadingFailed(false);

        try {
            if (reset) pageRef.current = 1;

            const pagination = {
                limit: PAGINATION_DEFAULT_LOANS_PER_PAGE,
                page: pageRef.current,
                sort: [
                    { by: sort.field, order: sort.direction },
                    { by: DEFAULT_LOAN_SORT_OPTION.field, order: DEFAULT_LOAN_SORT_OPTION.direction }
                ]
            };
            const response = await listLoans({}, pagination, { signal: controller.signal });

            setLoans((prev) => ({
                elements: reset ? response.elements : [...prev.elements, ...response.elements],
                pagination: response.pagination
            }));

            setHasNext(response.pagination.has_next);
            pageRef.current += 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setIsLoansLoadingFailed(true);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsLoansLoading(false);
            }
        }
    };

    // Função para dar baixa no empréstimo
    const handleReturnLoan = async (loanId: number) => {
        try {
            setReturningLoanId(loanId);

            // 1. Chamada para a API
            await returnLoan(loanId);

            // 2. Atualização reativa do estado local se o retorno for positivo
            const todayDate = new Date();

            setLoans((prev) => ({
                ...prev,
                elements: prev.elements.map((item) => (item.id === loanId ? { ...item, return_date: todayDate } : item))
            }));
        } catch (error) {
            console.error("Erro ao dar baixa no empréstimo:", error);
            // Aqui você pode adicionar um toast de erro se desejar
        } finally {
            setReturningLoanId(null);
        }
    };

    useEffect(() => {
        const el = loadMoreVolumesRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNext && !isLoansLoading) {
                    loadLoans();
                }
            },
            { rootMargin: `${INTERSECTION_ROOT_MARGIN_IN_PX}px` }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNext, isLoansLoading]);

    useEffect(() => {
        loadLoans();
    }, []);

    // Renderização dos cards para telas pequenas
    const renderMobileCards = () => (
        <VStack align="stretch" gap={4} w="full">
            {loans.elements.map((obj: Loan) => (
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
                                {obj.return_date ? (
                                    <>
                                        <Text color="fg.muted">Devolvido em:</Text>
                                        <Text fontWeight="bold">{parseDateFullText(obj.return_date)}</Text>
                                        <Text color="fg.subtle">
                                            {getDatesDistance(obj.loan_date, obj.return_date) === 0
                                                ? "No mesmo dia"
                                                : getDatesDistance(obj.loan_date, obj.return_date) === 1
                                                  ? "Após 1 dia"
                                                  : `Após ${getDatesDistance(obj.loan_date, obj.return_date)} dias`}
                                        </Text>
                                    </>
                                ) : new Date() > new Date(obj.due_date) ? (
                                    <>
                                        <Text fontWeight="bold" color="fealRed">
                                            Em atraso!
                                        </Text>
                                        <Text color="fg.subtle">
                                            {getDatesDistance(obj.due_date, new Date()) === 0
                                                ? "prazo vence hoje"
                                                : getDatesDistance(obj.due_date, new Date()) === 1
                                                  ? "prazo venceu ontem"
                                                  : `atrasado há ${getDatesDistance(obj.due_date, new Date())} dias`}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text color="fg.muted">Status:</Text>
                                        <Text fontWeight="bold" color="yellow.600">
                                            Em Aberto
                                        </Text>
                                    </>
                                )}
                            </Box>
                        </Stack>

                        {/* Botões de Ação */}
                        <HStack gap={2} pt={2}>
                            <a
                                href={`https://wa.me/55${obj.user.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ flex: 1 }}
                            >
                                <SimpleButton w="full">
                                    <LuPhone /> Whatsapp
                                </SimpleButton>
                            </a>
                            {!obj.return_date && (
                                <SimpleButton
                                    flex={1}
                                    onClick={() => handleReturnLoan(obj.id)}
                                    loading={returningLoanId === obj.id}
                                >
                                    <LuBookDown /> Baixa
                                </SimpleButton>
                            )}
                        </HStack>
                    </Card.Body>
                </Card.Root>
            ))}
        </VStack>
    );

    // Renderização em tabela para Desktop
    const renderDesktopTable = () => (
        <Table.Root interactive size="sm" variant="line">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Usuário</Table.ColumnHeader>
                    <Table.ColumnHeader>Título</Table.ColumnHeader>
                    <Table.ColumnHeader>Retirado em</Table.ColumnHeader>
                    <Table.ColumnHeader>Devolvido em</Table.ColumnHeader>
                    <Table.ColumnHeader>Ações</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {loans.elements.map((obj: Loan) => (
                    <Table.Row key={obj.id}>
                        <Table.Cell>
                            <HStack gap={3}>
                                <Avatar.Root variant="subtle">
                                    <Avatar.Fallback name={obj.user.name} />
                                </Avatar.Root>
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold">{obj.user.name}</Text>
                                    <a
                                        href={`https://wa.me/55${obj.user.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Text color="fg.muted" textStyle="xs">
                                            {obj.user.phone}
                                        </Text>
                                    </a>
                                </VStack>
                            </HStack>
                        </Table.Cell>
                        <Table.Cell>
                            <HStack align="start" gap={2}>
                                <Image
                                    borderRadius="sm"
                                    src={obj.volume.cover_url}
                                    alt={obj.volume.book.title}
                                    objectFit="cover"
                                    w="50px"
                                />
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold">{obj.volume.book.title}</Text>
                                    <Text color="fg.muted" textStyle="xs" pb={1}>
                                        {obj.volume.publisher?.abbreviation
                                            ? `${obj.volume.publisher?.abbreviation} - `
                                            : ""}
                                        {obj.volume.publisher?.name}
                                    </Text>
                                    <LabelBadge w="65px" label={obj.volume.label} />
                                </VStack>
                            </HStack>
                        </Table.Cell>
                        <Table.Cell>
                            <VStack align="start" gap={0}>
                                <Text fontWeight="bold">{parseDateFullText(obj.loan_date)}</Text>
                                <Text color="fg.muted" textStyle="xs">
                                    {getDatesDistance(obj.loan_date, new Date()) === 0
                                        ? "Hoje"
                                        : getDatesDistance(obj.loan_date, new Date()) === 1
                                          ? "Ontem"
                                          : `Há ${getDatesDistance(obj.loan_date, new Date())} dias`}
                                </Text>
                            </VStack>
                        </Table.Cell>
                        <Table.Cell>
                            {obj.return_date ? (
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold">{parseDateFullText(obj.return_date)}</Text>
                                    <Text color="fg.muted" textStyle="xs">
                                        {getDatesDistance(obj.loan_date, obj.return_date) === 0
                                            ? "No mesmo dia"
                                            : getDatesDistance(obj.loan_date, obj.return_date) === 1
                                              ? "Após 1 dia"
                                              : `Após ${getDatesDistance(obj.loan_date, obj.return_date)} dias`}
                                    </Text>
                                </VStack>
                            ) : new Date() > new Date(obj.due_date) ? (
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold" color="fealRed">
                                        Em atraso!!!
                                    </Text>
                                    <Text color="fg.muted" textStyle="xs">
                                        {getDatesDistance(obj.due_date, new Date()) === 0
                                            ? "prazo vence hoje"
                                            : getDatesDistance(obj.due_date, new Date()) === 1
                                              ? "prazo venceu ontem"
                                              : `atrasado há ${getDatesDistance(obj.due_date, new Date())} dias`}
                                    </Text>
                                </VStack>
                            ) : (
                                <Text color="fg.muted" textStyle="xs">
                                    Em aberto
                                </Text>
                            )}
                        </Table.Cell>
                        <Table.Cell>
                            <HStack gap={2}>
                                <a href={`https://wa.me/55${obj.user.phone}`} target="_blank" rel="noopener noreferrer">
                                    <SimpleButton>
                                        <LuPhone /> Whatsapp
                                    </SimpleButton>
                                </a>
                                {!obj.return_date && (
                                    <SimpleButton
                                        onClick={() => handleReturnLoan(obj.id)}
                                        loading={returningLoanId === obj.id}
                                    >
                                        <LuBookDown /> Baixa
                                    </SimpleButton>
                                )}
                            </HStack>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );

    return (
        <Body>
            <VStack pb="24px">
                <PageHeading header={t("title")} description={t("description")} />
            </VStack>

            <Box w="full">
                {isDesktop ? renderDesktopTable() : renderMobileCards()}
                <Box ref={loadMoreVolumesRef} h="40px" />
            </Box>
        </Body>
    );
}
