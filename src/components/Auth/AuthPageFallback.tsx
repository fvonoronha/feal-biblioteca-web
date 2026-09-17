"use client";

import { useRouter } from "next/navigation";
import AuthDialog from "./AuthDialog";
import { AuthView } from "./AuthViewContent";
import HomePage from "app/(public)/(homepage)/homePage";

interface Props {
    view: AuthView;
}

/**
 * Renderizado só num carregamento direto de /login, /registro ou /recuperar-senha (URL
 * digitada, favorito, refresh) - sem uma página anterior da SPA pra sobrepor. Mostra a própria
 * home por baixo e o mesmo diálogo de autenticação por cima dela, igual ao fallback da busca e
 * do autor - fechar aqui é só uma volta visual pra home, nunca uma troca de página perceptível.
 */
export default function AuthPageFallback({ view }: Props) {
    const router = useRouter();

    return (
        <>
            <HomePage />
            <AuthDialog view={view} onDismiss={() => router.push("/")} />
        </>
    );
}
