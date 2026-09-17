"use client";

import {
    Avatar,
    Badge,
    Button,
    Card,
    Center,
    Field,
    HStack,
    Input,
    Separator,
    Spinner,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react";
import { LuSearch, LuUserPlus, LuUserCheck, LuX, LuTriangleAlert } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { ErrorBanner, GhostButton, SimpleButton } from "components";
import { Loan, User } from "types";
import { maskCPF, maskPhone, parseDateFullText } from "utils";

type UserPanelMode = "search" | "create";
type NewUserField = "name" | "phone" | "document";

interface Props {
    mode: UserPanelMode;
    onModeChange: (mode: UserPanelMode) => void;

    query: string;
    onQueryChange: (value: string) => void;
    users: User[];
    isLoading: boolean;

    selectedUser: User | null;
    onSelectUser: (user: User) => void;
    onClearUser: () => void;
    recentLoans: Loan[];
    isRecentLoansLoading: boolean;

    newUserForm: Record<NewUserField, string>;
    onUpdateNewUserField: (field: NewUserField, value: string) => void;
    newUserErrors: string[];
    isCreatingUser: boolean;
    onCreateUser: () => void;
}

function isLoanOverdue(loan: Loan): boolean {
    return !loan.return_date && new Date(loan.due_date) < new Date();
}

export function UserLoanPicker({
    mode,
    onModeChange,
    query,
    onQueryChange,
    users,
    isLoading,
    selectedUser,
    onSelectUser,
    onClearUser,
    recentLoans,
    isRecentLoansLoading,
    newUserForm,
    onUpdateNewUserField,
    newUserErrors,
    isCreatingUser,
    onCreateUser
}: Props) {
    const t = useTranslations("NewLoanPage");
    const overdueLoans = recentLoans.filter(isLoanOverdue);

    if (selectedUser) {
        return (
            <VStack align="stretch" gap={3} w="100%" flex="1">
                <Card.Root variant="outline" w="100%">
                    <Card.Body p={4}>
                        <HStack align="start" gap={3}>
                            <Avatar.Root variant="subtle" flexShrink={0}>
                                <Avatar.Fallback name={selectedUser.name} />
                            </Avatar.Root>

                            <VStack align="start" gap={1} flex={1} minW={0}>
                                <HStack wrap="wrap" gap={2}>
                                    <Text fontWeight="bold" lineClamp={1}>
                                        {selectedUser.name}
                                    </Text>
                                    {selectedUser.status === "P" && (
                                        <Badge colorPalette="yellow" size="sm">
                                            {t("preRegisteredBadge")}
                                        </Badge>
                                    )}
                                </HStack>

                                {selectedUser.phone && (
                                    <Text fontSize="sm" color="fg.muted">
                                        {maskPhone(selectedUser.phone)}
                                    </Text>
                                )}

                                {selectedUser.document && (
                                    <Text fontSize="xs" color="fg.muted">
                                        {t("cpfLabel")}: {maskCPF(selectedUser.document)}
                                    </Text>
                                )}
                            </VStack>

                            <GhostButton size="sm" p={2} flexShrink={0} onClick={onClearUser}>
                                <LuX /> {t("changeButton")}
                            </GhostButton>
                        </HStack>
                    </Card.Body>
                </Card.Root>

                {/* Atraso é o sinal mais importante que o operador pode receber aqui - por isso
                    vem destacado, antes até da lista normal de últimos empréstimos. */}
                {isRecentLoansLoading ? (
                    <Center py={3}>
                        <Spinner size="sm" />
                    </Center>
                ) : (
                    <>
                        {overdueLoans.length > 0 && (
                            <HStack
                                align="start"
                                gap={2}
                                p={3}
                                borderRadius="md"
                                borderWidth="1px"
                                bg={{ base: "orange.50", _dark: "rgba(194, 120, 3, 0.15)" }}
                                borderColor={{ base: "orange.200", _dark: "orange.700" }}
                            >
                                <Text as="span" color="orange.600" pt="1px" flexShrink={0}>
                                    <LuTriangleAlert size={18} />
                                </Text>
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold" fontSize="sm" color={{ base: "orange.800", _dark: "orange.300" }}>
                                        {t("overdueWarningTitle")}
                                    </Text>
                                    <Text fontSize="sm" color={{ base: "gray.700", _dark: "gray.300" }}>
                                        {overdueLoans.length === 1
                                            ? t("overdueWarningMessageSingular", { title: overdueLoans[0].volume.book.title })
                                            : t("overdueWarningMessagePlural", { count: overdueLoans.length })}
                                    </Text>
                                </VStack>
                            </HStack>
                        )}

                        {recentLoans.length > 0 && (
                            <VStack align="stretch" gap={2}>
                                <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                                    {t("recentLoansTitle")}
                                </Text>
                                <VStack align="stretch" gap={1} maxH="140px" overflowY="auto">
                                    {recentLoans.map((loan) => {
                                        const overdue = isLoanOverdue(loan);
                                        return (
                                            <HStack key={loan.id} justify="space-between" fontSize="xs" px={1}>
                                                <Text lineClamp={1} flex={1} color="fg.muted">
                                                    {loan.volume.book.title}
                                                </Text>
                                                <Text
                                                    flexShrink={0}
                                                    fontWeight={overdue ? "bold" : "normal"}
                                                    color={overdue ? "fealRed.solid" : loan.return_date ? "green.600" : "fg.muted"}
                                                >
                                                    {loan.return_date
                                                        ? t("recentLoansReturned", { date: parseDateFullText(loan.return_date) })
                                                        : overdue
                                                          ? t("recentLoansOverdue", { date: parseDateFullText(loan.due_date) })
                                                          : t("recentLoansOpen", { date: parseDateFullText(loan.due_date) })}
                                                </Text>
                                            </HStack>
                                        );
                                    })}
                                </VStack>
                            </VStack>
                        )}
                    </>
                )}
            </VStack>
        );
    }

    return (
        <VStack align="stretch" gap={4} w="100%" flex="1">
            <Stack direction={{ base: "column", sm: "row" }} gap={2}>
                <Button
                    size="sm"
                    flex={1}
                    minW={0}
                    variant={mode === "search" ? "solid" : "outline"}
                    colorPalette="fealRed"
                    onClick={() => onModeChange("search")}
                >
                    <LuSearch /> {t("searchUserTab")}
                </Button>
                <Button
                    size="sm"
                    flex={1}
                    minW={0}
                    variant={mode === "create" ? "solid" : "outline"}
                    colorPalette="fealRed"
                    onClick={() => onModeChange("create")}
                >
                    <LuUserPlus /> {t("preRegisterTab")}
                </Button>
            </Stack>

            {mode === "search" ? (
                <VStack align="stretch" gap={3} flex="1">
                    <HStack borderBottomWidth="2px" borderColor="border" pb={1} px={1}>
                        <LuSearch color="gray" />
                        <Input
                            placeholder={t("searchUserPlaceholder")}
                            value={query}
                            onChange={(event) => onQueryChange(event.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            border="none"
                            _focus={{ boxShadow: "none" }}
                            autoComplete="off"
                        />
                    </HStack>

                    {isLoading && (
                        <Center py={4}>
                            <Spinner size="sm" />
                        </Center>
                    )}

                    {!isLoading && query.trim() !== "" && users.length === 0 && (
                        <VStack py={2} gap={2}>
                            <Text fontSize="sm" color="fg.muted" textAlign="center">
                                {t("noUsersFound")}
                            </Text>
                            <GhostButton size="sm" onClick={() => onModeChange("create")}>
                                <LuUserPlus /> {t("preRegisterFromEmptyResults")}
                            </GhostButton>
                        </VStack>
                    )}

                    {!isLoading && query.trim() === "" && (
                        <Text fontSize="sm" color="fg.muted" textAlign="center" py={2}>
                            {t("searchUserHint")}
                        </Text>
                    )}

                    {!isLoading && users.length > 0 && (
                        <VStack align="stretch" gap={1} maxH="300px" overflowY="auto">
                            {users.map((user) => (
                                <HStack
                                    key={String(user.id)}
                                    p={2}
                                    borderRadius="md"
                                    cursor="pointer"
                                    _hover={{ bg: "gray.subtle" }}
                                    onClick={() => onSelectUser(user)}
                                >
                                    <Avatar.Root size="sm" variant="subtle" flexShrink={0}>
                                        <Avatar.Fallback name={user.name} />
                                    </Avatar.Root>

                                    <VStack align="start" gap={0} flex={1} minW={0}>
                                        <Text fontWeight="bold" fontSize="sm" lineClamp={1}>
                                            {user.name}
                                        </Text>
                                        {user.phone && (
                                            <Text fontSize="xs" color="fg.muted">
                                                {maskPhone(user.phone)}
                                            </Text>
                                        )}
                                    </VStack>

                                    {user.status === "P" && (
                                        <Badge colorPalette="yellow" size="sm" flexShrink={0}>
                                            {t("preRegisteredBadge")}
                                        </Badge>
                                    )}
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </VStack>
            ) : (
                <VStack align="stretch" gap={3}>
                    {newUserErrors.length > 0 && (
                        <VStack gap={2} align="stretch">
                            {newUserErrors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </VStack>
                    )}

                    <Field.Root>
                        <Field.Label>{t("fullNameLabel")}</Field.Label>
                        <Input
                            placeholder={t("fullNamePlaceholder")}
                            value={newUserForm.name}
                            onChange={(event) => onUpdateNewUserField("name", event.target.value)}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                            autoComplete="name"
                            disabled={isCreatingUser}
                        />
                    </Field.Root>

                    <HStack gap={4} align="start" wrap="wrap">
                        <Field.Root flex="1" minW="180px">
                            <Field.Label>{t("phoneLabel")}</Field.Label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={newUserForm.phone}
                                onChange={(event) => onUpdateNewUserField("phone", maskPhone(event.target.value))}
                                inputMode="tel"
                                maxLength={15}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                autoComplete="tel"
                                disabled={isCreatingUser}
                            />
                        </Field.Root>

                        <Field.Root flex="1" minW="180px">
                            <Field.Label>{t("cpfLabel")}</Field.Label>
                            <Input
                                placeholder="000.000.000-00"
                                value={newUserForm.document}
                                onChange={(event) => onUpdateNewUserField("document", maskCPF(event.target.value))}
                                inputMode="numeric"
                                maxLength={14}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                autoComplete="off"
                                disabled={isCreatingUser}
                            />
                        </Field.Root>
                    </HStack>

                    <Separator />

                    <SimpleButton onClick={onCreateUser} disabled={isCreatingUser} w={{ base: "100%", sm: "auto" }}>
                        {isCreatingUser ? <Spinner size="sm" /> : <LuUserCheck />} {t("preRegisterSubmit")}
                    </SimpleButton>
                </VStack>
            )}
        </VStack>
    );
}
