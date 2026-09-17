"use client";

import { useRouter } from "next/navigation";
import { SearchDialog } from "components";
import HomePage from "../homePage";

// Renderizado só num carregamento direto de /buscar (URL digitada, favorito, refresh) - sem
// uma página anterior da SPA pra sobrepor. Em vez de mostrar a busca isolada numa tela própria
// (o que fazia "fechar" parecer trocar de página), mostra a própria home por baixo e o mesmo
// diálogo de busca por cima dela - visualmente idêntico a ter aberto a busca a partir da home.
export default function BuscarPage() {
    const router = useRouter();

    return (
        <>
            <HomePage />
            <SearchDialog onDismiss={() => router.push("/")} />
        </>
    );
}
