"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/registro";
export const RESET_PASSWORD_ROUTE = "/recuperar-senha";

const JUST_CREATED_PARAM = "criado";
const JUST_RESET_PARAM = "senha-redefinida";

/**
 * Navigation between the three auth screens (login/registro/recuperar-senha), shared by both
 * the intercepted modal (opens over whatever page you were on) and the standalone fallback
 * page (direct link/hard refresh). Success flags travel as query params instead of component
 * state, since login and registro are separate intercepted routes - a fresh mount each - so
 * they can't share state the way two views of the same dialog used to.
 */
export function useAuthNavigation() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToLogin = (flags?: { justCreated?: boolean; justReset?: boolean }) => {
        const params = new URLSearchParams();
        if (flags?.justCreated) params.set(JUST_CREATED_PARAM, "1");
        if (flags?.justReset) params.set(JUST_RESET_PARAM, "1");

        const query = params.toString();
        router.push(`${LOGIN_ROUTE}${query ? `?${query}` : ""}`);
    };

    const goToRegister = () => router.push(REGISTER_ROUTE);
    const goToResetPassword = () => router.push(RESET_PASSWORD_ROUTE);

    return {
        goToLogin,
        goToRegister,
        goToResetPassword,
        justCreatedAccount: searchParams.get(JUST_CREATED_PARAM) === "1",
        justResetPassword: searchParams.get(JUST_RESET_PARAM) === "1"
    };
}
