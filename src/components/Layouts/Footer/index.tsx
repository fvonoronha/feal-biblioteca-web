// "use client";

import { memo } from "react";
import { Box, Container, Stack, Text, Image, VStack, HStack, Icon, Separator } from "@chakra-ui/react";
// import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "components"; // Ajuste o path conforme seu projeto
import { LuMapPin, LuMail, LuLanguages } from "react-icons/lu";
// import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function Footer() {
    const t = useTranslations("Footer");
    // const locale = useLocale();
    // const router = useRouter();
    // const pathname = usePathname();

    // Coleção para o seletor de idiomas
    // const languages = createListCollection({
    //     items: [
    //         { label: "Português", value: "pt" },
    //         { label: "English", value: "en" },
    //         { label: "Español", value: "es" }
    //     ]
    // });

    // const handleLocaleChange = (details: { value: string[] }) => {
    //     const nextLocale = details.value[0];
    //     // Remove o locale atual e redireciona para o novo
    //     const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    //     router.push(newPath || `/${nextLocale}`);
    // };

    return (
        <Box as="footer" bg="bg.subtle" color="fg.muted" mt="auto" borderTopWidth="1px">
            <Container maxW="container.xl" py="10">
                <Stack
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "center", md: "start" }}
                    gap="8"
                >
                    {/* Coluna 1: Logo e Nome */}
                    <VStack align={{ base: "center", md: "start" }} maxW="300px">
                        <Image
                            src="/logo-fraternidade.png" // Certifique-se de ter essa logo em /public
                            alt="Logo Fraternidade"
                            h="60px"
                            // fallbackSrc="https://via.placeholder.com/60"
                        />
                        <Text fontWeight="bold" fontSize="lg" textAlign={{ base: "center", md: "left" }}>
                            Fraternidade Espírita Amor e Luz
                        </Text>
                        <Text fontSize="sm">
                            {t("missionText", {
                                defaultValue: "Promovendo a caridade e o estudo da doutrina espírita."
                            })}
                        </Text>
                    </VStack>

                    {/* Coluna 2: Endereço e Contato */}
                    <VStack align={{ base: "center", md: "start" }} gap="3">
                        <Text fontWeight="bold" color="fg">
                            {t("contactTitle", { defaultValue: "Contato" })}
                        </Text>

                        <HStack gap="3">
                            <Icon as={LuMapPin} boxSize="4" color="blue.500" />
                            <Text fontSize="sm">Rua Exemplo, 123 - Bairro, Cidade/UF</Text>
                        </HStack>

                        <HStack gap="3">
                            <Icon as={LuMail} boxSize="4" color="blue.500" />
                            <Text fontSize="sm">contato@amorefe.org.br</Text>
                        </HStack>
                    </VStack>

                    {/* Coluna 3: Idioma */}
                    <VStack align={{ base: "center", md: "end" }} gap="3">
                        <Text fontWeight="bold" color="fg">
                            {t("languageTitle", { defaultValue: "Idioma" })}
                        </Text>

                        {/* <SelectRoot
                            collection={languages}
                            size="sm"
                            w="150px"
                            value={[locale]}
                            onValueChange={handleLocaleChange}
                        >
                            <SelectTrigger>
                                <HStack gap="2">
                                    <LuLanguages />
                                    <SelectValueText placeholder={t("selectLanguage", { defaultValue: "Selecione" })} />
                                </HStack>
                            </SelectTrigger>
                            <SelectContent>
                                {languages.items.map((lang) => (
                                    <SelectItem item={lang} key={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot> */}
                    </VStack>
                </Stack>

                <Separator mt="10" mb="6" />

                <Text fontSize="xs" textAlign="center">
                    &copy; {new Date().getFullYear()} Fraternidade Espírita Amor e Luz.{" "}
                    {t("allRightsReserved", { defaultValue: "Todos os direitos reservados." })}
                </Text>
            </Container>
        </Box>
    );
}

export default memo(Footer);
