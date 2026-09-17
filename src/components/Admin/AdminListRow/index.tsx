"use client";

import { memo, ReactNode } from "react";
import { Card, Flex, HStack, VStack } from "@chakra-ui/react";

interface Props {
    avatar?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    meta?: ReactNode;
    badges?: ReactNode;
    actions?: ReactNode;
    onClick?: () => void;
}

/**
 * Linha de listagem administrativa compartilhada por usuários/autores/livros/editoras/
 * categorias/temas - antes cada tela desenhava sua própria `HStack` com só uma borda fina e
 * o mesmo fundo da página, o que fazia a interface parecer "morta"/sem hierarquia visual.
 * Usar `Card.Root` de verdade (com o fundo e a sombra do tema) resolve isso de uma vez para
 * todas as telas administrativas, em vez de corrigir cada uma separadamente.
 */
function AdminListRow({ avatar, title, subtitle, meta, badges, actions, onClick }: Props) {
    return (
        <Card.Root
            variant="outline"
            w="100%"
            cursor={onClick ? "pointer" : "default"}
            onClick={onClick}
            transition="border-color .15s, box-shadow .15s"
            _hover={onClick ? { borderColor: "fealRed.solid", boxShadow: "sm" } : undefined}
        >
            <Card.Body p={3}>
                <Flex direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }} gap={3}>
                    <HStack gap={3} minW={0} flex={1}>
                        {avatar}

                        <VStack align="start" gap={0} minW={0} flex={1}>
                            <HStack gap={2} wrap="wrap">
                                {title}
                                {badges}
                            </HStack>
                            {subtitle}
                            {meta}
                        </VStack>
                    </HStack>

                    {actions && (
                        <HStack gap={1} flexShrink={0} justify={{ base: "flex-end", sm: "flex-start" }}>
                            {actions}
                        </HStack>
                    )}
                </Flex>
            </Card.Body>
        </Card.Root>
    );
}

export default memo(AdminListRow);
