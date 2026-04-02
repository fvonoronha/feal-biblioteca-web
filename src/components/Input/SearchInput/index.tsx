"use client";

import { useState } from "react";
import {
    IconButton,
    Input,
    Box,
    HStack,
    DialogRoot,
    DialogTrigger,
    DialogContent,
    DialogBody,
    DialogBackdrop,
    Group
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SimpleButton } from "components/Button";
import { QUERY_PARAMS_FOR_SEARCH } from "utils";

const SearchInput = () => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const t = useTranslations("Collection");

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (query.trim()) {
            router.push(`/?${QUERY_PARAMS_FOR_SEARCH}=${encodeURIComponent(query)}`);
            setOpen(false);
            setQuery("");
        }
    };

    return (
        <DialogRoot
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size="lg"
            // Removemos o 'placement' padrão para controlar manualmente
        >
            <DialogTrigger asChild>
                <IconButton
                    aria-label={t("filterSearchLabel")}
                    variant="ghost"
                    size="sm"
                    css={{
                        _icon: { width: "5", height: "5" }
                    }}
                >
                    <LuSearch />
                </IconButton>
            </DialogTrigger>

            <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

            <DialogContent
                borderRadius="lg"
                bg="gray.subtle"
                position="fixed"
                top="20vh"
                left="50%"
                transform="translateX(-50%)"
                width={{ base: "90vw", md: "600px" }}
                margin="0"
            >
                <DialogBody py={4} px={0}>
                    <form onSubmit={handleSearch}>
                        <Group w="full" attached>
                            <Box display="flex" alignItems="center" px="3">
                                <LuSearch color="gray.emphasized" size={20} />
                            </Box>

                            <Input
                                type="text"
                                value={query}
                                placeholder={t("filterSearchPlaceholder")}
                                onChange={(e) => setQuery(e.target.value)}
                                variant="flushed"
                                fontSize="sm"
                                borderBottomWidth="2px"
                                colorPalette="primary"
                                _focus={{ borderColor: "fealRed" }}
                                _hover={{ borderColor: "gray.fg" }}
                                autoFocus
                            />

                            <HStack gap="2" px="4" display={{ base: "none", md: "flex" }}>
                                <SimpleButton onClick={() => handleSearch()}>{"Pesquisar"}</SimpleButton>
                            </HStack>
                        </Group>
                    </form>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
};

export default SearchInput;
// Apenas salvanod pra olhar depois
//  {query.length === 0 && (
//                     <Stack gap="3" mt="4" px="4" pb="4">
//                         <Text fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="wider">
//                             EXPLORAR CATEGORIAS
//                         </Text>
//                         <HStack gap="2" wrap="wrap">
//                             {["Ficção", "Tecnologia", "Design", "História"].map((tag) => (
//                                 <Box
//                                     key={tag}
//                                     as="button"
//                                     px="4"
//                                     py="1.5"
//                                     bg="gray.50"
//                                     borderRadius="full"
//                                     fontSize="sm"
//                                     fontWeight="medium"
//                                     transition="all 0.2s"
//                                     _hover={{ bg: "blue.600", color: "white" }}
//                                     onClick={() => {
//                                         router.push(`/search?q=${tag}`);
//                                         setOpen(false);
//                                     }}
//                                 >
//                                     {tag}
//                                 </Box>
//                             ))}
//                         </HStack>
//                     </Stack>
//                 )}
