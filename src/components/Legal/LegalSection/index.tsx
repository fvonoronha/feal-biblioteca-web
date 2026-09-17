"use client";

import { ReactNode } from "react";
import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

interface Props {
    title: string;
    children: ReactNode;
}

export function LegalSection({ title, children }: Props) {
    return (
        <VStack align="stretch" gap={2}>
            <Heading fontSize="lg">{title}</Heading>
            <VStack align="stretch" gap={3} color="fg.muted" fontSize="sm">
                {children}
            </VStack>
        </VStack>
    );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
    return (
        <Text fontSize="sm" color="fg.muted" lineHeight="tall">
            {children}
        </Text>
    );
}

// `List.Root`/`List.Item` do Chakra (Ark UI por baixo) estavam renderizando cada item em
// dobro nessa versão - em vez de investigar o componente da lib, uma lista simples de linhas
// com marcador manual evita o problema por completo e já é o padrão usado em /sobre.
export function LegalList({ items }: { items: string[] }) {
    return (
        <VStack align="stretch" gap={2} pl={2}>
            {items.map((item, index) => (
                <HStack key={index} align="start" gap={2}>
                    <Text fontSize="sm" color="fealRed.solid" lineHeight="tall">
                        •
                    </Text>
                    <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                        {item}
                    </Text>
                </HStack>
            ))}
        </VStack>
    );
}
