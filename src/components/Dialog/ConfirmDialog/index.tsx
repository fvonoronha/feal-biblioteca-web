"use client";

import { memo } from "react";
import { DialogRoot, DialogBackdrop, DialogContent, Portal, VStack, HStack, Heading, Text } from "@chakra-ui/react";
import { SimpleButton, GhostButton } from "components";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

// Diálogo de confirmação genérico - hoje usado por "renovar"/"dar baixa" na listagem de
// empréstimos, mas escrito sem nada específico de empréstimos para servir qualquer ação
// destrutiva/irreversível futura que mereça uma checagem antes de disparar (ver posicionamento
// mobile: mesma correção de AuthDialog, sem a folga grande no topo que só faz sentido no desktop).
function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel, onConfirm, isLoading }: ConfirmDialogProps) {
    return (
        <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)} size="sm">
          <Portal>
            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top={{ base: "auto", md: "50%" }}
                bottom={{ base: "0", md: "auto" }}
                left="50%"
                transform={{ base: "translateX(-50%)", md: "translate(-50%, -50%)" }}
                width={{ base: "100vw", md: "420px" }}
                maxH={{ base: "85dvh", md: "90vh" }}
                borderBottomRadius={{ base: 0, md: "lg" }}
                overflowY="auto"
                p={5}
            >
                <VStack align="stretch" gap={4}>
                    <VStack align="stretch" gap={1}>
                        <Heading size="md">{title}</Heading>
                        {description && (
                            <Text fontSize="sm" color="fg.muted">
                                {description}
                            </Text>
                        )}
                    </VStack>

                    <HStack justify="flex-end" gap={3}>
                        <GhostButton onClick={() => onOpenChange(false)} disabled={isLoading}>
                            {cancelLabel}
                        </GhostButton>
                        <SimpleButton onClick={onConfirm} loading={isLoading}>
                            {confirmLabel}
                        </SimpleButton>
                    </HStack>
                </VStack>
            </DialogContent>
          </Portal>
        </DialogRoot>
    );
}

export default memo(ConfirmDialog);
