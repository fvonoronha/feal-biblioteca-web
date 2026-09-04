"use client";

import { useState } from "react";
import { Button, Field, Input, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { maskCPF, USER_JWT_TOKEN_NAME, getOnlyNumbers, isCPFValid, setStorage } from "utils";
import { LuUserPlus, LuEye, LuEyeOff } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useColorModeValue, ErrorBanner, SectionHeading, toaster, SuccessBanner } from "components";
import { useAuthContext } from "contexts";

// importe sua função aqui
import { login } from "endpoints";

interface LoginPageProps {
    onCreateAccount: () => void;
    onClose: () => void;
    justCreatedAccount?: boolean;
}

const LoginPage = ({ onCreateAccount, onClose, justCreatedAccount }: LoginPageProps) => {
    const t = useTranslations("LoginPage");
    const { setUser } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const [form, setForm] = useState({
        cpf: "",
        password: ""
    });

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const ValidationErrors: string[] = [];

        const cpf = getOnlyNumbers(form.cpf);

        if (!cpf) {
            newErrors.cpf = t("cpfRequired");
            ValidationErrors.push(t("cpfRequired"));
        } else if (!isCPFValid(cpf)) {
            newErrors.cpf = t("cpfNotValid");
            ValidationErrors.push(t("cpfNotValid"));
        }

        if (!form.password) {
            newErrors.password = t("passwordRequired");
            ValidationErrors.push(t("passwordRequired"));
        } else if (form.password.length < 8) {
            newErrors.password = t("passwordNotValid");
            ValidationErrors.push(t("passwordNotValid"));
        }

        setErrors(ValidationErrors);

        return Object.keys(newErrors).length === 0;
    };

    const fealLogo = useColorModeValue(
        "https://r2.biblioteca.feal.espirita.casa/identidade/Fraternidade_Light.png",
        "https://r2.biblioteca.feal.espirita.casa/identidade/Fraternidade_Dark.png"
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setErrors([]);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await login(getOnlyNumbers(form.cpf) || "", form.password || "");

            if (response?.token) {
                setStorage(USER_JWT_TOKEN_NAME, `Bearer ${response?.token.jwt_token}`);

                toaster.create({
                    type: "success",
                    title: "Log In com sucesso",
                    description: "redirecion"
                });
                setUser(response.user);
                onClose();
                // router.push("/");
            } else {
                // setIsLoadingFailed(true);
                // focusOnPasswordInput();
            }

            // Problema aqui??
            // onLogin(t("accountCreatedMessage"));
        } catch {
            setErrors([t("loginGenericError")]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap={6} p={{ base: 5, md: 8 }}>
                <Stack align="center" gap={4}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fealLogo}
                        alt="Fraternidade Espírita Amor e Luz - FEAL"
                        style={{
                            display: "block",
                            maxWidth: "260px",
                            width: "100%",
                            height: "auto",
                            maxHeight: "65px",
                            objectFit: "contain"
                        }}
                    />

                    <SectionHeading header={t("title")} description={t("description")} align="center" />
                </Stack>

                {justCreatedAccount && (
                    <Stack gap={2}>
                        <SuccessBanner message={t("accountCreatedMessage")} />
                    </Stack>
                )}

                {errors.length > 0 && (
                    <Stack gap={2}>
                        {errors.map((message, index) => (
                            <ErrorBanner
                                key={index}
                                // O ideal seria tratar cada campo e fazer o highlight do campo específico, mas por enquanto vamos apenas mostrar a mensagem de erro
                                // Esse caso do Taken está sendo tratado como gambiarra pq o único campo que passa por essa validação é o CPF, mas o tratamento não está ideal
                                message={message == "Taken" ? t("accountAlreadyExists") : message}
                            />
                        ))}
                    </Stack>
                )}

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {/* CPF */}
                    <Field.Root gridColumn={{ base: "auto", md: "1 / -1" }}>
                        <Field.Label>{t("cpf")}</Field.Label>

                        <Input
                            placeholder={t("cpfPlaceholder")}
                            value={form.cpf}
                            onChange={(event) => updateField("cpf", maskCPF(event.target.value))}
                            inputMode="numeric"
                            autoComplete="username"
                            maxLength={14}
                            disabled={isLoading}
                        />
                    </Field.Root>

                    {/* Senha */}
                    <Field.Root gridColumn={{ base: "auto", md: "1 / -1" }}>
                        <Field.Label>{t("password")}</Field.Label>

                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("passwordPlaceholder")}
                            value={form.password}
                            onChange={(event) => updateField("password", event.target.value)}
                            autoComplete="new-password"
                            pr="45px"
                            disabled={isLoading}
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            _hover={{ bg: "transparent" }}
                            right="2px"
                            bottom="0"
                            height="40px"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                            disabled={isLoading}
                        >
                            {showPassword ? <LuEyeOff /> : <LuEye />}
                        </Button>
                    </Field.Root>

                    {/* <Span> </Span> */}

                    {/* Esqueci minha senha */}
                    {/* <Button
                        // gridColumn={{ base: "auto", md: "1 / -1" }}
                        // type="button"
                        variant="ghost"
                        colorPalette="fealLightBlue"
                        onClick={() => onCreateAccount()}
                        disabled={isLoading}
                        display="flex"
                        justifyContent="flex-end"
                        m={0}
                    >
                        {t("forgotPassword")}
                    </Button> */}
                </SimpleGrid>

                <Button type="submit" width="100%" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner size="sm" />
                            {t("loggingIn")}
                        </>
                    ) : (
                        t("login")
                    )}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    colorPalette="fealLightBlue"
                    onClick={() => onCreateAccount()}
                    disabled={isLoading}
                >
                    <LuUserPlus />
                    {t("dontHaveAccount")}
                </Button>

                <Text textAlign="center" fontSize="xs" color="fg.muted">
                    {t("LoginDisclaimer")}
                </Text>

                <Button
                    type="button"
                    variant="subtle"
                    colorPalette="fealRed"
                    onClick={() => onClose()}
                    disabled={isLoading}
                >
                    {t("keepWithoutLogin")}
                </Button>
            </Stack>
        </form>
    );
};

export default LoginPage;
