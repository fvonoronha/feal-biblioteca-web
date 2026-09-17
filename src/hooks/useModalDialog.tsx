"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Local open/close state for a Dialog rendered by an intercepted route (or its standalone
 * fallback page). Next's parallel-route `@modal` slot is supposed to unmount this component
 * the instant the URL moves to something it no longer matches, but that reset doesn't reliably
 * win the race against a plain `router.push` - the previous route's modal could stay on screen
 * after the page behind it has already changed. Controlling `open` locally and flipping it to
 * `false` the moment any navigation leaves this modal makes the close deterministic instead of
 * depending on the framework's own teardown timing.
 */
export function useModalDialog(onDismiss: () => void) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const close = useCallback(() => {
        setOpen(false);
        onDismiss();
    }, [onDismiss]);

    // Para navegações que abandonam esse modal de vez (ex.: clicar num volume dentro da busca
    // e ir para /v/slug) - diferente de trocar para outra rota interceptada irmã (ex.: busca ->
    // autor, ou login -> registro), que deve continuar trocando o conteúdo do slot @modal sem
    // fechar visualmente nada.
    // A ordem aqui importa: dispara a navegação PRIMEIRO, com o diálogo ainda totalmente
    // montado, e só then desmonta localmente - fazer o `setOpen(false)` antes do push corria o
    // risco de o React desmontar `DialogContent` (e o que estiver dentro) no meio do próprio
    // clique que iniciou o push, atrapalhando a navegação do Next nessa mesma janela de evento.
    const leaveTo = useCallback(
        (path: string) => {
            router.push(path);
            setOpen(false);
        },
        [router]
    );

    return { open, close, leaveTo };
}
