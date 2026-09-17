"use client";

import { useRouter } from "next/navigation";
import { Box, Field, Heading, Input, SimpleGrid, Spinner, Stack, Text, VStack, Card } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { LuArrowLeft, LuBookPlus } from "react-icons/lu";
import { Body, PageHeading, GhostButton, SimpleButton, ErrorBanner, VolumeLoanPicker, UserLoanPicker } from "components";
import { useCreateLoan } from "hooks";
import { parseDateYMD } from "utils";

export default function NewLoanPage() {
    const router = useRouter();
    const t = useTranslations("NewLoanPage");

    const {
        volumeQuery,
        setVolumeQuery,
        volumes,
        isVolumesLoading,
        selectedVolume,
        selectVolume,
        clearSelectedVolume,

        userPanelMode,
        setUserPanelMode,
        userQuery,
        setUserQuery,
        users,
        isUsersLoading,
        selectedUser,
        selectUser,
        clearSelectedUser,
        selectedUserLoans,
        isSelectedUserLoansLoading,

        newUserForm,
        updateNewUserField,
        newUserErrors,
        isCreatingUser,
        handleCreateUser,

        dueDate,
        setDueDate,
        description,
        setDescription,

        canSubmit,
        isSubmitting,
        submitErrors,
        handleSubmit
    } = useCreateLoan();

    return (
        <Body>
            <VStack pb="24px" align="start" gap={3}>
                <GhostButton size="sm" p={0} onClick={() => router.push("/emprestimos")}>
                    <LuArrowLeft /> {t("backToLoans")}
                </GhostButton>

                <PageHeading header={t("title")} description={t("description")} />
            </VStack>

            {/* alignItems="stretch" (padrão do Grid) faz os dois cards terem a mesma altura -
                cada Card.Root/Card.Body/VStack interno usa h="100%"/flex="1" pra que o conteúdo
                realmente preencha essa altura, não só a borda do card. */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 4, lg: 6 }} w="100%" alignItems="stretch">
                <Card.Root variant="outline" w="100%" h="100%">
                    <Card.Body p={{ base: 4, md: 6 }} display="flex" flexDirection="column">
                        <VStack align="stretch" gap={4} flex="1">
                            <Heading size="md">{t("volumeCardTitle")}</Heading>
                            <VolumeLoanPicker
                                query={volumeQuery}
                                onQueryChange={setVolumeQuery}
                                volumes={volumes}
                                isLoading={isVolumesLoading}
                                selectedVolume={selectedVolume}
                                onSelectVolume={selectVolume}
                                onClearVolume={clearSelectedVolume}
                            />
                        </VStack>
                    </Card.Body>
                </Card.Root>

                <Card.Root variant="outline" w="100%" h="100%">
                    <Card.Body p={{ base: 4, md: 6 }} display="flex" flexDirection="column">
                        <VStack align="stretch" gap={4} flex="1">
                            <Heading size="md">{t("userCardTitle")}</Heading>
                            <UserLoanPicker
                                mode={userPanelMode}
                                onModeChange={setUserPanelMode}
                                query={userQuery}
                                onQueryChange={setUserQuery}
                                users={users}
                                isLoading={isUsersLoading}
                                selectedUser={selectedUser}
                                onSelectUser={selectUser}
                                onClearUser={clearSelectedUser}
                                recentLoans={selectedUserLoans}
                                isRecentLoansLoading={isSelectedUserLoansLoading}
                                newUserForm={newUserForm}
                                onUpdateNewUserField={updateNewUserField}
                                newUserErrors={newUserErrors}
                                isCreatingUser={isCreatingUser}
                                onCreateUser={handleCreateUser}
                            />
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </SimpleGrid>

            <Card.Root variant="outline" w="100%" mt={{ base: 4, lg: 6 }}>
                <Card.Body p={{ base: 4, md: 6 }}>
                    <VStack align="stretch" gap={4}>
                        <Heading size="md">{t("detailsCardTitle")}</Heading>

                        {submitErrors.length > 0 && (
                            <VStack gap={2} align="stretch">
                                {submitErrors.map((message, index) => (
                                    <ErrorBanner key={index} message={message} />
                                ))}
                            </VStack>
                        )}

                        <Stack direction={{ base: "column", md: "row" }} gap={4}>
                            <Field.Root flex="1">
                                <Field.Label>{t("dueDateLabel")}</Field.Label>
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) => setDueDate(event.target.value)}
                                    min={parseDateYMD(new Date())}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                />
                            </Field.Root>

                            <Field.Root flex="2">
                                <Field.Label>{t("descriptionLabel")}</Field.Label>
                                <Input
                                    placeholder={t("descriptionPlaceholder")}
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    variant="flushed"
                                    fontSize="sm"
                                    borderBottomWidth="2px"
                                />
                            </Field.Root>
                        </Stack>

                        <Box>
                            <SimpleButton w="100%" disabled={!canSubmit} onClick={handleSubmit}>
                                {isSubmitting ? (
                                    <>
                                        <Spinner size="sm" /> {t("submitting")}
                                    </>
                                ) : (
                                    <>
                                        <LuBookPlus /> {t("submitButton")}
                                    </>
                                )}
                            </SimpleButton>

                            {(!selectedVolume || !selectedUser) && (
                                <Text fontSize="xs" color="fg.muted" textAlign="center" mt={2}>
                                    {t("submitHint")}
                                </Text>
                            )}
                        </Box>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Body>
    );
}
