"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge, Card, Center, Field, Grid, HStack, Input, NativeSelect, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { LuSave, LuKeyRound, LuFileText, LuShield } from "react-icons/lu";
import { Body, PageHeading, SimpleButton, GhostButton, ErrorBanner, SuccessBanner } from "components";
import { useProfile, useChangePassword } from "hooks";
import { maskCPF, maskPhone, parseDateFullText } from "utils";

export default function ProfilePage() {
    const t = useTranslations("ProfilePage");
    const router = useRouter();
    const { user, form, updateField, errors, isSubmitting, successMessage, handleSubmit } = useProfile();
    const {
        form: passwordForm,
        updateField: updatePasswordField,
        errors: passwordErrors,
        isSubmitting: isChangingPassword,
        successMessage: passwordSuccessMessage,
        handleSubmit: handlePasswordSubmit
    } = useChangePassword();

    const SEX_OPTIONS = [
        { value: "", label: t("sexOptionUnspecified") },
        { value: "M", label: t("sexOptionMale") },
        { value: "F", label: t("sexOptionFemale") },
        { value: "N", label: t("sexOptionOther") }
    ];

    if (!user) {
        return (
            <Body>
                <Center minH="50vh">
                    <Spinner size="lg" />
                </Center>
            </Body>
        );
    }

    return (
        <Body>
            <VStack pb="24px" align="start">
                <PageHeading header={t("title")} description={t("description")} />
            </VStack>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} alignItems="start" w="100%">
                <Card.Root variant="outline" w="100%">
                    <Card.Body p={{ base: 4, md: 6 }}>
                        <form onSubmit={handleSubmit}>
                            <Stack gap={5}>
                                <HStack wrap="wrap" justify="space-between">
                                    <Text fontSize="sm" color="fg.muted">
                                        {t("memberSince", { date: parseDateFullText(user.created_at as unknown as Date) })}
                                    </Text>

                                    {user.status === "P" && <Badge colorPalette="yellow">{t("preRegisteredBadge")}</Badge>}
                                </HStack>

                                {errors.length > 0 && (
                                    <Stack gap={2}>
                                        {errors.map((message, index) => (
                                            <ErrorBanner key={index} message={message} />
                                        ))}
                                    </Stack>
                                )}

                                {successMessage && (
                                    <Stack gap={2}>
                                        <SuccessBanner message={t("saveSuccessMessage")} />
                                    </Stack>
                                )}

                                <Field.Root required>
                                    <Field.Label>
                                        {t("fullName")}
                                        <Field.RequiredIndicator />
                                    </Field.Label>

                                    <Input
                                        placeholder={t("fullNamePlaceholder")}
                                        value={form.name}
                                        onChange={(event) => updateField("name", event.target.value)}
                                        autoComplete="name"
                                        disabled={isSubmitting}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>{t("displayName")}</Field.Label>

                                    <Input
                                        placeholder={t("displayNamePlaceholder")}
                                        value={form.display_name}
                                        onChange={(event) => updateField("display_name", event.target.value)}
                                        disabled={isSubmitting}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        {t("email")}
                                        <Field.RequiredIndicator />
                                    </Field.Label>

                                    <Input
                                        type="email"
                                        placeholder={t("emailPlaceholder")}
                                        value={form.email}
                                        onChange={(event) => updateField("email", event.target.value)}
                                        autoComplete="email"
                                        disabled={isSubmitting}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        {t("phone")}
                                        <Field.RequiredIndicator />
                                    </Field.Label>

                                    <Input
                                        placeholder={t("phonePlaceholder")}
                                        value={form.phone}
                                        onChange={(event) => updateField("phone", maskPhone(event.target.value))}
                                        inputMode="tel"
                                        autoComplete="tel"
                                        maxLength={15}
                                        disabled={isSubmitting}
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>{t("sex")}</Field.Label>
                                    <NativeSelect.Root size="sm" disabled={isSubmitting}>
                                        <NativeSelect.Field
                                            value={form.sex}
                                            onChange={(event) => updateField("sex", event.target.value)}
                                        >
                                            {SEX_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>{t("cpf")}</Field.Label>

                                    <Input
                                        value={maskCPF(user.document || user.login || "")}
                                        disabled
                                        readOnly
                                        variant="flushed"
                                        fontSize="sm"
                                        borderBottomWidth="2px"
                                    />

                                    <Field.HelperText>{t("cpfHelper")}</Field.HelperText>
                                </Field.Root>

                                <SimpleButton
                                    type="submit"
                                    w={{ base: "100%", sm: "auto" }}
                                    disabled={isSubmitting}
                                    alignSelf="flex-start"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner size="sm" />
                                            {t("saving")}
                                        </>
                                    ) : (
                                        <>
                                            <LuSave />
                                            {t("save")}
                                        </>
                                    )}
                                </SimpleButton>
                            </Stack>
                        </form>
                    </Card.Body>
                </Card.Root>

                <VStack gap={6} align="stretch" w="100%">
                    <Card.Root variant="outline" w="100%">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <form onSubmit={handlePasswordSubmit}>
                                <Stack gap={5}>
                                    <VStack align="start" gap={1}>
                                        <HStack color="fealRed.solid" gap={2}>
                                            <LuKeyRound size={18} />
                                            <Text fontWeight="bold">{t("changePasswordTitle")}</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="fg.muted">
                                            {t("changePasswordDescription")}
                                        </Text>
                                    </VStack>

                                    {passwordErrors.length > 0 && (
                                        <Stack gap={2}>
                                            {passwordErrors.map((message, index) => (
                                                <ErrorBanner key={index} message={message} />
                                            ))}
                                        </Stack>
                                    )}

                                    {passwordSuccessMessage && (
                                        <Stack gap={2}>
                                            <SuccessBanner message={t("changePasswordSuccessTitle")} />
                                        </Stack>
                                    )}

                                    <Field.Root required>
                                        <Field.Label>
                                            {t("currentPassword")}
                                            <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            type="password"
                                            placeholder={t("currentPasswordPlaceholder")}
                                            value={passwordForm.current_password}
                                            onChange={(event) => updatePasswordField("current_password", event.target.value)}
                                            autoComplete="current-password"
                                            disabled={isChangingPassword}
                                            variant="flushed"
                                            fontSize="sm"
                                            borderBottomWidth="2px"
                                        />
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>
                                            {t("newPassword")}
                                            <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            type="password"
                                            placeholder={t("newPasswordPlaceholder")}
                                            value={passwordForm.new_password}
                                            onChange={(event) => updatePasswordField("new_password", event.target.value)}
                                            autoComplete="new-password"
                                            disabled={isChangingPassword}
                                            variant="flushed"
                                            fontSize="sm"
                                            borderBottomWidth="2px"
                                        />
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>
                                            {t("confirmPassword")}
                                            <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            type="password"
                                            placeholder={t("confirmPasswordPlaceholder")}
                                            value={passwordForm.confirm_password}
                                            onChange={(event) => updatePasswordField("confirm_password", event.target.value)}
                                            autoComplete="new-password"
                                            disabled={isChangingPassword}
                                            variant="flushed"
                                            fontSize="sm"
                                            borderBottomWidth="2px"
                                        />
                                    </Field.Root>

                                    <SimpleButton
                                        type="submit"
                                        w={{ base: "100%", sm: "auto" }}
                                        disabled={isChangingPassword}
                                        alignSelf="flex-start"
                                    >
                                        {isChangingPassword ? (
                                            <>
                                                <Spinner size="sm" />
                                                {t("changingPassword")}
                                            </>
                                        ) : (
                                            <>
                                                <LuKeyRound />
                                                {t("changePasswordButton")}
                                            </>
                                        )}
                                    </SimpleButton>
                                </Stack>
                            </form>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root variant="outline" w="100%">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <VStack align="start" gap={3}>
                                <Text fontWeight="bold">{t("legalTitle")}</Text>
                                <GhostButton p={0} onClick={() => router.push("/termos-de-uso")}>
                                    <LuFileText size={16} /> {t("termsOfUseLink")}
                                </GhostButton>
                                <GhostButton p={0} onClick={() => router.push("/politica-de-privacidade")}>
                                    <LuShield size={16} /> {t("privacyPolicyLink")}
                                </GhostButton>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </VStack>
            </Grid>
        </Body>
    );
}
