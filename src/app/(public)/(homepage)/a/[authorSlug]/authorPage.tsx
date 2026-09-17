"use client";

import { useRouter } from "next/navigation";
import { AuthorDetailDialog } from "components";
import HomePage from "../../homePage";

interface Props {
    authorSlug: string;
}

// Renderizado só num carregamento direto de /a/[slug] (URL digitada, favorito, refresh) - sem
// uma página anterior da SPA pra sobrepor. Mostra a própria home por baixo e o mesmo modal de
// autor por cima dela, igual ao fallback da busca (buscarPage.tsx) - fechar aqui é só uma volta
// visual pra home, nunca uma troca de página perceptível.
export default function AuthorPage({ authorSlug }: Props) {
    const router = useRouter();

    return (
        <>
            <HomePage />
            <AuthorDetailDialog authorSlug={authorSlug} onDismiss={() => router.push("/")} />
        </>
    );
}
