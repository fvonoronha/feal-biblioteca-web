"use client";

import { useAuthNavigation } from "hooks";
import Login from "./LoginPage";
import CreateAccount from "./RegisterPage";
import ResetPassword from "./ResetPasswordPage";

export type AuthView = "login" | "register" | "reset-password";

interface Props {
    view: AuthView;
    onClose: () => void;
}

/**
 * Picks which of the three auth forms to render. Shared by the intercepted modal and the
 * standalone fallback page, so both stay in sync without duplicating this switch.
 */
export default function AuthViewContent({ view, onClose }: Props) {
    const { goToLogin, goToRegister, goToResetPassword, justCreatedAccount, justResetPassword } = useAuthNavigation();

    if (view === "register") {
        return (
            <CreateAccount
                onLogin={(options) => goToLogin({ justCreated: options.justCreatedAccount })}
                onClose={onClose}
            />
        );
    }

    if (view === "reset-password") {
        return <ResetPassword onLogin={(options) => goToLogin({ justReset: options?.justResetPassword })} />;
    }

    return (
        <Login
            justCreatedAccount={justCreatedAccount}
            justResetPassword={justResetPassword}
            onCreateAccount={goToRegister}
            onForgotPassword={goToResetPassword}
            onClose={onClose}
        />
    );
}
