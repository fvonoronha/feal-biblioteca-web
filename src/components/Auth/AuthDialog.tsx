"use client";

import { useRouter } from "next/navigation";
import { DialogRoot, DialogBackdrop, DialogContent, Portal } from "@chakra-ui/react";
import { useModalDialog } from "hooks";
import AuthViewContent, { AuthView } from "./AuthViewContent";

interface Props {
    view: AuthView;
    // Ver SearchDialog - por padrão fecha voltando uma entrada no histórico; a página de
    // fallback (/login, /registro, /recuperar-senha carregados direto) passa
    // `() => router.push("/")`.
    onDismiss?: () => void;
}

/**
 * Renderizado pelas rotas interceptadas (@modal/(.)login, etc.) e, com um `onDismiss`
 * diferente, pelo fallback direto de cada uma - mesmo diálogo, mesmo visual. Trocar entre
 * login/registro/recuperar-senha (goToLogin/goToRegister/goToResetPassword, em
 * useAuthNavigation) continua sendo um router.push comum: são rotas interceptadas irmãs, o
 * slot @modal só troca de conteúdo entre elas sem "fechar" nada visualmente.
 */
export default function AuthDialog({ view, onDismiss }: Props) {
    const router = useRouter();
    const { open, close } = useModalDialog(onDismiss ?? (() => router.back()));

    return (
        <DialogRoot open={open} onOpenChange={(e) => !e.open && close()} size="xl">
          <Portal>
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                // No mobile o diálogo começa quase colado no topo (só uma folga mínima) em vez
                // dos 10% de altura de tela usados no desktop para centralizar - nesse tamanho
                // de tela aquele espaço só empurrava conteúdo longo (ex.: o formulário de
                // registro) para fora da viewport, forçando scroll desnecessário.
                top={{ base: "12px", md: "10%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "500px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "90vh" }}
                overflowY="auto"
            >
                <AuthViewContent view={view} onClose={close} />
            </DialogContent>
          </Portal>
        </DialogRoot>
    );
}
