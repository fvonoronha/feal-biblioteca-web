import { callAPI } from "utils";
import { AuthResponse } from "types";

export const login = async (login: string, password: string): Promise<AuthResponse | undefined> => {
    const response = await callAPI<AuthResponse>({
        method: "POST",
        url: `/login`,
        data: { login, password, keep: true }
    });

    return response?.body?.user?.id ? response.body : undefined;
};

export const checkAuthToken = async (jwt: string): Promise<AuthResponse | undefined> => {
    const response = await callAPI<AuthResponse>({
        method: "GET",
        url: `/is-auth`,
        headers: { Authorization: jwt }
    });

    return response?.body?.user?.id ? response.body : undefined;
};

// Sempre resolve `true` quando a chamada teve sucesso - o back responde genérico mesmo se o
// CPF não existir ou não tiver e-mail cadastrado, então não há um "false" de verdade aqui,
// só o reject de uma falha de rede/validação (tratado por quem chama).
export const requestPasswordReset = async (login: string): Promise<boolean> => {
    const response = await callAPI<{ passwordReset?: { requested?: boolean } }>({
        method: "POST",
        url: `/password-reset/request`,
        data: { login }
    });

    return !!response?.body?.passwordReset?.requested;
};

// Validação "silenciosa": nunca lança - um token inválido/expirado/inexistente só faz
// resolver `false`, para o chamador decidir a UI sem precisar de try/catch.
export const validateResetToken = async (token: string): Promise<boolean> => {
    try {
        const response = await callAPI<{ passwordReset?: { valid?: boolean } }>({
            method: "POST",
            url: `/password-reset/validate`,
            data: { token }
        });

        return !!response?.body?.passwordReset?.valid;
    } catch {
        return false;
    }
};

export const resetPassword = async (token: string, password: string): Promise<boolean> => {
    const response = await callAPI<{ passwordReset?: { reset?: boolean } }>({
        method: "POST",
        url: `/password-reset/reset`,
        data: { token, password }
    });

    return !!response?.body?.passwordReset?.reset;
};
