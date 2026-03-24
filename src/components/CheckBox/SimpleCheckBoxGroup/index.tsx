"use client";

import { memo, useState } from "react";
import { VStack, Checkbox, Field, Text, Box } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

type Option = {
    label: string;
    value: string;
};

type SimpleCheckBoxGroupProps = {
    isLoading?: boolean;
    hide?: boolean;
    label: string;
    options: Option[];
    values: string[];
    setValues: (values: string[]) => void;
};

const CHECK_BOX_LIMIT_ITEMS_BEFORE_COLLAPSE = 7;

const SimpleCheckBoxGroup = ({
    label,
    hide = false,
    // isLoading = false,
    options,
    values,
    setValues
}: SimpleCheckBoxGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const t = useTranslations("Collection");

    if (hide || options.length === 0) return <></>;

    // Lógica para limitar a exibição
    const limit = CHECK_BOX_LIMIT_ITEMS_BEFORE_COLLAPSE;
    const shouldShowToggle = options.length > limit;
    const visibleOptions = isExpanded ? options : options.slice(0, limit);

    return (
        <Box>
            <Field.Root>
                <Field.Label fontWeight="bold">{label}</Field.Label>
            </Field.Root>

            <Checkbox.Group value={values} onValueChange={setValues} p="4">
                <VStack align="start" gap="2">
                    {visibleOptions.map((opt) => (
                        <Checkbox.Root key={opt.value} value={opt.value} cursor={"pointer"}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control
                                cursor={"pointer"}
                                borderWidth="2px"
                                _checked={{
                                    bg: "fealRed",
                                    borderColor: "fealRed",
                                    color: "white"
                                }}
                            />
                            <Checkbox.Label cursor={"pointer"}>{opt.label}</Checkbox.Label>
                        </Checkbox.Root>
                    ))}
                </VStack>
            </Checkbox.Group>

            {shouldShowToggle && (
                <Box pl="4">
                    <Text
                        fontSize="sm"
                        color="fealRed"
                        fontWeight="semibold"
                        cursor="pointer"
                        display="inline-block"
                        onClick={() => setIsExpanded(!isExpanded)}
                        _hover={{ textDecoration: "underline", opacity: 0.8 }}
                    >
                        {isExpanded
                            ? t("filterCheckBoxSeeLess")
                            : t("filterCheckBoxSeeMore", {
                                  total: options.length - limit
                              })}
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default memo(SimpleCheckBoxGroup);
