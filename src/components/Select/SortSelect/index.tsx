"use client";

import { HStack, Portal, Select, createListCollection, Text, Field } from "@chakra-ui/react";
import { SortSelectProps, SortOption, SORT_OPTIONS } from "types";
import { useTranslations } from "next-intl";

function getSortOptionByValue(options: SortOption[], value: string): SortOption {
    return options.find((option) => option.value === value) || options[0];
}

export default function SortSelect({
    value,
    label,
    labelPosition = "top",
    onChange,
    options,
    namespace = "Collection"
}: SortSelectProps) {
    const sortOptions = options || SORT_OPTIONS();
    const collection = createListCollection({
        items: sortOptions
    });

    const t = useTranslations(namespace);

    return (
        <HStack w="100%">
            {label && labelPosition === "left" && <Text whiteSpace="nowrap">{label}</Text>}

            <Select.Root
                collection={collection}
                value={[value.value]}
                onValueChange={(e) => onChange(getSortOptionByValue(sortOptions, e.value[0]))}
                size="sm"
                width="100%"
                positioning={{ placement: "bottom-start" }}
            >
                {label && labelPosition === "top" && (
                    <Field.Root>
                        <Field.Label fontWeight="bold">{label}</Field.Label>
                    </Field.Root>
                )}

                <Select.Trigger
                    w="100%"
                    justifyContent="space-between"
                    border="none"
                    borderBottom="2px solid"
                    borderColor="gray.emphasized"
                    borderRadius="0"
                    px="0"
                    _focus={{ boxShadow: "none", borderColor: "fealRed.solid" }}
                    _hover={{ borderColor: "gray.fg" }}
                >
                    {/* O recipe padrão do Chakra trunca o valueText em 1 linha com "..." (lineClamp:
                        1, maxW: 80%) - opções mais longas (ex.: "Nº de Acessos (Geral)") ficavam
                        ilegíveis. Aqui removemos os dois limites para sempre mostrar o texto
                        inteiro, quebrando linha quando precisar em vez de cortar. */}
                    <Select.ValueText fontSize="md" flex="1" maxW="none" lineClamp="none" textAlign="left" whiteSpace="normal">
                        {t(value.value)}
                    </Select.ValueText>
                    <Select.Indicator flexShrink={0} />
                </Select.Trigger>

                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    {t(item.label)}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </HStack>
    );
}
