"use client";

import { useRouter } from "next/navigation";
import { DialogRoot, DialogBackdrop, DialogContent, Portal } from "@chakra-ui/react";
import { useModalDialog } from "hooks";
import SearchDialogContent from "./SearchDialogContent";

interface Props {
    // Por padrão fecha voltando uma entrada no histórico (caso interceptado, aberto por cima
    // de uma página já existente). A página de fallback (/buscar carregado direto) passa
    // `() => router.push("/")` aqui, já que não há uma entrada anterior própria da SPA pra
    // voltar - ver buscarPage.tsx.
    onDismiss?: () => void;
}

/**
 * Renderizado pela rota interceptada (@modal/(.)buscar) e, com um `onDismiss` diferente, pelo
 * fallback direto (/buscar) - mesmo diálogo, mesmo visual, só muda o que "fechar" significa.
 */
export default function SearchDialog({ onDismiss }: Props) {
    const router = useRouter();
    const { open, close, leaveTo } = useModalDialog(onDismiss ?? (() => router.back()));

    return (
        <DialogRoot open={open} onOpenChange={(e) => !e.open && close()} size="xl">
          <Portal>
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "10%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "1500px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "80vh" }}
                margin="0"
                overflow="hidden"
            >
                <SearchDialogContent onNavigate={leaveTo} />
            </DialogContent>
          </Portal>
        </DialogRoot>
    );
}
