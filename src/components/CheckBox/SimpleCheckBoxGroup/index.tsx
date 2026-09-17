"use client";

import { memo, useState } from "react";
import { VStack, Checkbox, Text, Box, Skeleton } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

type Option = {
    label: string;
    value: string;
};

type SimpleCheckBoxGroupProps = {
    maxElementsBeforeCollapse?: number;
    isLoading?: boolean;
    hide?: boolean;
    options: Option[];
    values: string[];
    setValues: (values: string[]) => void;
};

const CHECK_BOX_LIMIT_ITEMS_BEFORE_COLLAPSE = 7;

const SimpleCheckBoxGroup = ({
    maxElementsBeforeCollapse,
    hide = false,
    isLoading = false,
    options,
    values,
    setValues
}: SimpleCheckBoxGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const t = useTranslations("Collection");

    // Antes disso, `isLoading` chegava aqui e nunca era usado - a lista antiga (do filtro
    // anterior) ficava visível sem nenhum aviso e trocava de repente pra nova assim que a
    // busca terminava, cada grupo (categoria/tema/autor/editora) num instante ligeiramente
    // diferente. Isso que dava a sensação de "pisca e muda sozinho" ao filtrar - agora o
    // Skeleton cobre essa transição, deixando claro que aquela lista está atualizando.
    if (hide || (!isLoading && options.length === 0)) return <></>;

    // Lógica para limitar a exibição
    const limit = maxElementsBeforeCollapse ?? CHECK_BOX_LIMIT_ITEMS_BEFORE_COLLAPSE;
    const shouldShowToggle = !isLoading && options.length > limit;
    const visibleOptions = isExpanded ? options : options.slice(0, limit);

    return (
        <Box>
            <Skeleton loading={isLoading}>
                <Checkbox.Group value={values} onValueChange={setValues} px="0">
                    <VStack align="start" gap="2">
                        {visibleOptions.map((opt) => (
                            <Checkbox.Root key={opt.value} value={opt.value} cursor={"pointer"} disabled={isLoading}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control
                                    cursor={"pointer"}
                                    borderWidth="2px"
                                    _checked={{
                                        bg: "fealRed.solid",
                                        borderColor: "fealRed.solid",
                                        color: "white"
                                    }}
                                />
                                <Checkbox.Label cursor={"pointer"}>{opt.label}</Checkbox.Label>
                            </Checkbox.Root>
                        ))}
                    </VStack>
                </Checkbox.Group>
            </Skeleton>

            {shouldShowToggle && (
                <Box pl="4">
                    <Text
                        fontSize="sm"
                        color="fealRed.solid"
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
