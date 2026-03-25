"use client";

import { HStack, Portal, Select, createListCollection, Text, Field } from "@chakra-ui/react";
import { SortSelectProps, SortOption, SORT_OPTIONS } from "types";
import { useTranslations } from "next-intl";

function getSortOptionByValue(value: string): SortOption {
    for (const i in SORT_OPTIONS()) {
        if (SORT_OPTIONS()[i].value === value) {
            return SORT_OPTIONS()[i];
        }
    }
    return SORT_OPTIONS()[0];
}

export default function SortSelect({ value, label, labelPosition = "top", onChange }: SortSelectProps) {
    const collection = createListCollection({
        items: SORT_OPTIONS()
    });

    const t = useTranslations("Collection");

    return (
        <HStack w="100%">
            {label && labelPosition === "left" && <Text whiteSpace="nowrap">{label}</Text>}

            <Select.Root
                collection={collection}
                value={[value.value]}
                onValueChange={(e) => onChange(getSortOptionByValue(e.value[0]) as SortOption)}
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
                    border="none"
                    borderBottom="2px solid"
                    borderColor="gray.emphasized"
                    borderRadius="0"
                    px="0"
                    _focus={{ boxShadow: "none", borderColor: "fealRed" }}
                    _hover={{ borderColor: "gray.fg" }}
                >
                    <Select.ValueText fontSize={"md"}>{t(value.value)}</Select.ValueText>
                    <Select.Indicator />
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
