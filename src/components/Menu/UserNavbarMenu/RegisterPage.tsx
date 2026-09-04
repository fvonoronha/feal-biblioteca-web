"use client";

import { useState } from "react";
import { Button, Checkbox, Field, Input, Link, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { maskCPF, maskPhone, getOnlyNumbers, isCPFValid, isEmailValid } from "utils";
import { LuArrowLeft, LuEye, LuEyeOff } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useColorModeValue, ErrorBanner, SectionHeading } from "components";

// importe sua função aqui
import { registerUser } from "endpoints";

interface CreateAccountProps {
    onLogin: ({ justCreatedAccount }: { justCreatedAccount: boolean }) => void;
    onClose: () => void;
}

const CreateAccount = ({ onLogin, onClose }: CreateAccountProps) => {
    const t = useTranslations("RegisterPage");

    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: "",
        cpf: "",
        email: "",
        phone: "",
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

        if (!form.name.trim()) {
            newErrors.name = t("fullNameRequired");
            ValidationErrors.push(t("fullNameRequired"));
        }

        const cpf = getOnlyNumbers(form.cpf);

        if (!cpf) {
            newErrors.cpf = t("cpfRequired");
            ValidationErrors.push(t("cpfRequired"));
        } else if (!isCPFValid(cpf)) {
            newErrors.cpf = t("cpfNotValid");
            ValidationErrors.push(t("cpfNotValid"));
        }

        const phone = getOnlyNumbers(form.phone);

        if (!phone) {
            newErrors.phone = t("phoneRequired");
            ValidationErrors.push(t("phoneRequired"));
        } else if (phone.length < 10) {
            newErrors.phone = t("phoneNotValid");
            ValidationErrors.push(t("phoneNotValid"));
        }

        if (!form.email.trim()) {
            newErrors.email = t("emailRequired");
            ValidationErrors.push(t("emailRequired"));
        } else if (!isEmailValid(form.email)) {
            newErrors.email = t("emailNotValid");
            ValidationErrors.push(t("emailNotValid"));
        }

        if (!form.password) {
            newErrors.password = t("passwordRequired");
            ValidationErrors.push(t("passwordRequired"));
        } else if (form.password.length < 8) {
            newErrors.password = t("passwordNotValid");
            ValidationErrors.push(t("passwordNotValid"));
        }

        if (!acceptedTerms) {
            newErrors.terms = t("termsNotAccepted");
            ValidationErrors.push(t("termsNotAccepted"));
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
            await registerUser({
                name: form.name,
                login: getOnlyNumbers(form.cpf),
                email: form.email,
                phone: getOnlyNumbers(form.phone),
                password: form.password
            });

            // Problema aqui??
            onLogin({ justCreatedAccount: true });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;

            if (Array.isArray(apiErrors)) {
                setErrors(apiErrors.map((item) => item.message));
            } else {
                setErrors([t("accountGenericCreationError")]);
            }
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
                    {/* Nome */}
                    <Field.Root gridColumn={{ base: "auto", md: "1 / -1" }}>
                        <Field.Label>{t("fullName")}</Field.Label>

                        <Input
                            placeholder={t("fullNamePlaceholder")}
                            value={form.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            autoComplete="name"
                            disabled={isLoading}
                        />
                    </Field.Root>

                    {/* CPF */}
                    <Field.Root>
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

                    {/* Telefone */}
                    <Field.Root>
                        <Field.Label>{t("phone")}</Field.Label>

                        <Input
                            placeholder={t("phonePlaceholder")}
                            value={form.phone}
                            onChange={(event) => updateField("phone", maskPhone(event.target.value))}
                            inputMode="tel"
                            autoComplete="tel"
                            maxLength={15}
                            disabled={isLoading}
                        />
                    </Field.Root>

                    {/* E-mail */}
                    <Field.Root gridColumn={{ base: "auto", md: "1 / -1" }}>
                        <Field.Label>{t("email")}</Field.Label>
                        <Input
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            value={form.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            autoComplete="email"
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
                </SimpleGrid>

                {/* Termos */}
                <Checkbox.Root
                    checked={acceptedTerms}
                    onCheckedChange={(event) => setAcceptedTerms(!!event.checked)}
                    disabled={isLoading}
                >
                    <Checkbox.HiddenInput />

                    <Checkbox.Control />

                    <Checkbox.Label>
                        <Text fontSize="sm">
                            {t("userAgreementBefore")}{" "}
                            <Link
                                href="/termos-de-uso"
                                target="_blank"
                                color={{ base: "fealLightBlue.700", _dark: "fealLightBlue.400" }}
                                textDecoration="none"
                            >
                                {t("userAgreement")}
                            </Link>{" "}
                            {t("userAgreementAfter")}
                        </Text>
                    </Checkbox.Label>
                </Checkbox.Root>

                {/* Criar conta */}
                <Button type="submit" width="100%" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner size="sm" />
                            {t("creatingAccount")}
                        </>
                    ) : (
                        t("createAccount")
                    )}
                </Button>

                {/* Voltar para login */}
                <Button
                    type="button"
                    variant="ghost"
                    colorPalette="fealLightBlue"
                    onClick={() => onLogin({ justCreatedAccount: false })}
                    disabled={isLoading}
                >
                    <LuArrowLeft />
                    {t("alreadyHaveAccount")}
                </Button>

                <Text textAlign="center" fontSize="xs" color="fg.muted">
                    {t("accountCreationDisclaimer")}
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

export default CreateAccount;
