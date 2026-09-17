"use client";

import { useRouter } from "next/navigation";
import { DialogRoot, DialogBackdrop, DialogContent } from "@chakra-ui/react";
import { useModalDialog } from "hooks";
import AuthorDetailContent from "./AuthorDetailContent";

interface Props {
    authorSlug: string;
    // Ver SearchDialog - por padrão fecha voltando uma entrada no histórico; a página de
    // fallback (/a/[slug] carregado direto) passa `() => router.push("/")`.
    onDismiss?: () => void;
}

/**
 * Renderizado pela rota interceptada (@modal/(.)a/[authorSlug]) e, com um `onDismiss`
 * diferente, pelo fallback direto (/a/[slug]) - mesmo diálogo, mesmo visual.
 */
export default function AuthorDetailDialog({ authorSlug, onDismiss }: Props) {
    const router = useRouter();
    const { open, close, leaveTo } = useModalDialog(onDismiss ?? (() => router.back()));

    return (
        <DialogRoot open={open} onOpenChange={(e) => !e.open && close()} size="xl">
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "12px", md: "6%" }}
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "calc(100vw - 24px)", md: "820px" }}
                maxH={{ base: "calc(100dvh - 24px)", md: "88vh" }}
                overflow="hidden"
            >
                <AuthorDetailContent authorSlug={authorSlug} onClose={close} onNavigate={leaveTo} />
            </DialogContent>
        </DialogRoot>
    );
}
