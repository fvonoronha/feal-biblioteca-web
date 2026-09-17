"use client";

import { NativeSelect, HStack, Icon } from "@chakra-ui/react";
import { LuArrowUpDown } from "react-icons/lu";

export type AdminSortOption = { value: string; label: string };

interface Props {
    value: string;
    options: AdminSortOption[];
    onChange: (value: string) => void;
}

// Select de ordenação compartilhado pelas telas administrativas (autores, livros, editoras,
// categorias, temas) - cada uma só define suas próprias opções (os campos ordenáveis mudam),
// mas o controle em si é sempre o mesmo, pro usuário não precisar reaprender a interface.
export default function AdminSortSelect({ value, options, onChange }: Props) {
    return (
        <HStack gap={2} flexShrink={0}>
            <Icon color="fg.muted" flexShrink={0}>
                <LuArrowUpDown size={16} />
            </Icon>
            <NativeSelect.Root size="sm" w={{ base: "full", md: "220px" }}>
                <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value)}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>
        </HStack>
    );
}
