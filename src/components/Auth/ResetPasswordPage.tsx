"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Center, Field, Input, Spinner, Stack } from "@chakra-ui/react";
import { LuArrowLeft, LuEye, LuEyeOff, LuKeyRound } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useColorModeValue, ErrorBanner, SectionHeading } from "components";
import {
    getOnlyNumbers,
    isCPFValid,
    maskCPF,
    getStorage,
    setStorage,
    deleteStorage,
    PASSWORD_RESET_TOKEN_STORAGE_NAME
} from "utils";

import { requestPasswordReset, validateResetToken, resetPassword } from "endpoints";

interface ResetPasswordPageProps {
    onLogin: (options?: { justResetPassword?: boolean }) => void;
}

type Mode = "checking" | "request" | "requested" | "reset" | "invalid";

const ResetPasswordPage = ({ onLogin }: ResetPasswordPageProps) => {
    const t = useTranslations("PasswordResetPage");
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mode, setMode] = useState<Mode>("checking");
    const [token, setToken] = useState<string | null>(null);

    const [cpf, setCpf] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Decide, sem gastar o token, se cai direto no formulário de nova senha (link do
    // e-mail, ou um token ainda válido salvo de uma visita anterior) ou se pede pra
    // solicitar um novo link - isso é o que evita ter que reenviar e-mail toda vez que a
    // página é recarregada ou o usuário navega para /login e volta.
    useEffect(() => {
        let cancelled = false;

        const urlToken = searchParams.get("token");
        const cachedToken = getStorage(PASSWORD_RESET_TOKEN_STORAGE_NAME);
        const candidateToken = urlToken || cachedToken;

        if (!candidateToken) {
            setMode("request");
            return;
        }

        setMode("checking");

        validateResetToken(candidateToken).then((valid) => {
            if (cancelled) return;

            if (valid) {
                setToken(candidateToken);
                setStorage(PASSWORD_RESET_TOKEN_STORAGE_NAME, candidateToken);
                setMode("reset");
            } else {
                deleteStorage(PASSWORD_RESET_TOKEN_STORAGE_NAME);
                setMode("invalid");
            }
        });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fealLogo = useColorModeValue(
        "https://r2.biblioteca.feal.espirita.casa/identidade/Fraternidade_Light.png",
        "https://r2.biblioteca.feal.espirita.casa/identidade/Fraternidade_Dark.png"
    );

    const Header = ({ title, description }: { title: string; description: string }) => (
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

            <SectionHeading header={title} description={description} align="center" />
        </Stack>
    );

    const handleRequestNewLink = () => {
        setErrors([]);
        deleteStorage(PASSWORD_RESET_TOKEN_STORAGE_NAME);
        // Limpa o ?token= da URL pra não revalidar o mesmo token inválido num refresh.
        router.replace("/recuperar-senha");
        setMode("request");
    };

    const handleRequestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setErrors([]);

        const cleanCpf = getOnlyNumbers(cpf);

        if (!cleanCpf) {
            setErrors([t("cpfRequired")]);
            return;
        }

        if (!isCPFValid(cleanCpf)) {
            setErrors([t("cpfNotValid")]);
            return;
        }

        setIsSubmitting(true);

        try {
            await requestPasswordReset(cleanCpf);
            setMode("requested");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.passwordReset?.error;
            setErrors(
                Array.isArray(apiErrors)
                    ? apiErrors.map((item: { message: string }) => item.message)
                    : [t("requestGenericError")]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || !token) return;

        setErrors([]);

        if (!password) {
            setErrors([t("passwordRequired")]);
            return;
        }

        if (password.length < 8) {
            setErrors([t("passwordNotValid")]);
            return;
        }

        if (password !== confirmPassword) {
            setErrors([t("passwordsDontMatch")]);
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword(token, password);
            deleteStorage(PASSWORD_RESET_TOKEN_STORAGE_NAME);
            onLogin({ justResetPassword: true });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const httpStatus = error?.response?.status;

            if (httpStatus === 404) {
                deleteStorage(PASSWORD_RESET_TOKEN_STORAGE_NAME);
                router.replace("/recuperar-senha");
                setMode("invalid");
                return;
            }

            const apiErrors = error?.response?.data?.body?.passwordReset?.error;
            setErrors(
                Array.isArray(apiErrors)
                    ? apiErrors.map((item: { message: string }) => item.message)
                    : [t("resetGenericError")]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (mode === "checking") {
        return (
            <Stack gap={6} p={{ base: 5, md: 8 }}>
                <Header title={t("checkingTitle")} description={t("checkingDescription")} />

                <Center py={4}>
                    <Spinner size="lg" />
                </Center>
            </Stack>
        );
    }

    if (mode === "invalid") {
        return (
            <Stack gap={6} p={{ base: 5, md: 8 }}>
                <Header title={t("invalidTitle")} description={t("invalidDescription")} />

                <Button type="button" width="100%" onClick={handleRequestNewLink}>
                    <LuKeyRound />
                    {t("requestNewLink")}
                </Button>

                <Button type="button" variant="ghost" colorPalette="fealLightBlue" onClick={() => onLogin()}>
                    <LuArrowLeft />
                    {t("backToLogin")}
                </Button>
            </Stack>
        );
    }

    if (mode === "requested") {
        return (
            <Stack gap={6} p={{ base: 5, md: 8 }}>
                <Header title={t("requestedTitle")} description={t("requestedDescription")} />

                <Button
                    type="button"
                    variant="ghost"
                    colorPalette="fealLightBlue"
                    onClick={() => {
                        setCpf("");
                        setMode("request");
                    }}
                >
                    {t("tryAnotherCpf")}
                </Button>

                <Button type="button" variant="subtle" colorPalette="fealRed" onClick={() => onLogin()}>
                    <LuArrowLeft />
                    {t("backToLogin")}
                </Button>
            </Stack>
        );
    }

    if (mode === "reset") {
        return (
            <form onSubmit={handleResetSubmit}>
                <Stack gap={6} p={{ base: 5, md: 8 }}>
                    <Header title={t("resetTitle")} description={t("resetDescription")} />

                    {errors.length > 0 && (
                        <Stack gap={2}>
                            {errors.map((message, index) => (
                                <ErrorBanner key={index} message={message} />
                            ))}
                        </Stack>
                    )}

                    <Field.Root>
                        <Field.Label>{t("newPassword")}</Field.Label>

                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("newPasswordPlaceholder")}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            pr="45px"
                            disabled={isSubmitting}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
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
                            disabled={isSubmitting}
                        >
                            {showPassword ? <LuEyeOff /> : <LuEye />}
                        </Button>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>{t("confirmPassword")}</Field.Label>

                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("confirmPasswordPlaceholder")}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            variant="flushed"
                            fontSize="sm"
                            borderBottomWidth="2px"
                        />
                    </Field.Root>

                    <Button type="submit" width="100%" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" />
                                {t("resetting")}
                            </>
                        ) : (
                            t("resetPassword")
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        colorPalette="fealLightBlue"
                        onClick={() => onLogin()}
                        disabled={isSubmitting}
                    >
                        <LuArrowLeft />
                        {t("backToLogin")}
                    </Button>
                </Stack>
            </form>
        );
    }

    // mode === "request"
    return (
        <form onSubmit={handleRequestSubmit}>
            <Stack gap={6} p={{ base: 5, md: 8 }}>
                <Header title={t("requestTitle")} description={t("requestDescription")} />

                {errors.length > 0 && (
                    <Stack gap={2}>
                        {errors.map((message, index) => (
                            <ErrorBanner key={index} message={message} />
                        ))}
                    </Stack>
                )}

                <Field.Root>
                    <Field.Label>{t("cpf")}</Field.Label>

                    <Input
                        placeholder={t("cpfPlaceholder")}
                        value={cpf}
                        onChange={(event) => setCpf(maskCPF(event.target.value))}
                        inputMode="numeric"
                        autoComplete="username"
                        maxLength={14}
                        disabled={isSubmitting}
                        variant="flushed"
                        fontSize="sm"
                        borderBottomWidth="2px"
                    />
                </Field.Root>

                <Button type="submit" width="100%" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner size="sm" />
                            {t("sending")}
                        </>
                    ) : (
                        <>
                            <LuKeyRound />
                            {t("sendLink")}
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    colorPalette="fealLightBlue"
                    onClick={() => onLogin()}
                    disabled={isSubmitting}
                >
                    <LuArrowLeft />
                    {t("backToLogin")}
                </Button>
            </Stack>
        </form>
    );
};

export default ResetPasswordPage;
