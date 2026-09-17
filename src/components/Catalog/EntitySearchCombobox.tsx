"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Box, Combobox, Portal, Spinner, createListCollection } from "@chakra-ui/react";
import { useDebounce } from "hooks";

interface EntityLike {
    id: number;
    name: string;
}

interface Props<T extends EntityLike> {
    selected: T | null;
    onSelect: (item: T | null) => void;
    // Busca no servidor (ver listAuthorsAdmin/listPublishersAdmin) - nunca carrega a lista
    // inteira no cliente, essencial quando há milhares de registros (autores, por exemplo).
    // Chamada de novo a cada mudança no texto digitado (com debounce) e também uma vez vazia
    // no início, pra já mostrar algumas opções antes do usuário digitar.
    search: (query: string) => Promise<T[]>;
    placeholder: string;
    emptyText: string;
    renderItem: (item: T) => ReactNode;
    disabled?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;

export default function EntitySearchCombobox<T extends EntityLike>({
    selected,
    onSelect,
    search,
    placeholder,
    emptyText,
    renderItem,
    disabled
}: Props<T>) {
    const t = useTranslations("AdminCatalog");
    const [inputValue, setInputValue] = useState(selected?.name || "");
    const [results, setResults] = useState<T[]>(selected ? [selected] : []);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedQuery = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);

    // Se a seleção mudar por fora (ex.: autor recém-criado já vem pré-selecionado, ou o
    // formulário troca de volume), reflete o nome dela no campo de texto.
    useEffect(() => {
        setInputValue(selected?.name || "");
    }, [selected]);

    useEffect(() => {
        let cancelled = false;
        setIsSearching(true);

        search(debouncedQuery)
            .then((items) => {
                if (!cancelled) setResults(items);
            })
            .finally(() => {
                if (!cancelled) setIsSearching(false);
            });

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, search]);

    const collection = useMemo(
        () =>
            createListCollection<T>({
                items: results,
                itemToValue: (item) => String(item.id),
                itemToString: (item) => item.name
            }),
        [results]
    );

    return (
        <Combobox.Root
            collection={collection}
            value={selected ? [String(selected.id)] : []}
            inputValue={inputValue}
            onInputValueChange={(details) => setInputValue(details.inputValue)}
            onValueChange={(details) => {
                const item = results.find((candidate) => String(candidate.id) === details.value[0]) || null;
                onSelect(item);
            }}
            openOnClick
            size="sm"
            disabled={disabled}
        >
            <Combobox.Control>
                <Combobox.Input placeholder={placeholder} />
                <Combobox.IndicatorGroup>
                    {isSearching && <Spinner size="xs" />}
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content maxH="320px" overflowY="auto">
                        <Combobox.Empty>{isSearching ? t("searchingLabel") : emptyText}</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item item={item} key={item.id} p={0}>
                                <Box w="100%" py={1} px={1}>
                                    {renderItem(item)}
                                </Box>
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
}
