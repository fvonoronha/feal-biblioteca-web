"use client";

import { Flex, HStack, Box } from "@chakra-ui/react";
import { FealLogo, UserNavbarMenu } from "components";
import { ColorModeButton } from "components/ui/color-mode";

import { createContext, ReactNode, useContext } from "react";
import { NavbarContextType } from "types";
import { useAuthContext } from "contexts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const defaultValues = {
    setUser: () => {}
};

export const NavbarContext = createContext<NavbarContextType>(defaultValues);

export function NavbarProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const router = useRouter();
    const t = useTranslations("NavBar");
    const clickMainLogo = () => {
        router.push("/");
    };

    return (
        <>
            {/* Wrapper fixo que ocupa toda a largura da tela */}
            <Box
                as="nav"
                position="fixed"
                top="0"
                left="0"
                right="0"
                w="full"
                h="50px"
                zIndex="sticky" // Garante que fique acima de tudo
                bg={{ base: "white", _dark: "gray.900" }} // Fundo sólido para não ver o scroll atrás
                borderBottom="1px solid"
                borderColor={{ base: "gray.200", _dark: "gray.700" }}
            >
                {/* Conteúdo centralizado em 1440px */}
                <Flex
                    h="full"
                    w="full"
                    maxW="1440px"
                    mx="auto"
                    align="center"
                    justify="space-between"
                    px={{ base: "10px", md: "20px", lg: "40px" }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <FealLogo size="sm" name={t("title")} onClick={clickMainLogo} cursor={"pointer"} />

                    <HStack gap={1}>
                        {/* <LocaleSelect /> */}
                        <Flex align="center" gap={0}>
                            <ColorModeButton />
                        </Flex>
                        <UserNavbarMenu user={user} />
                    </HStack>
                </Flex>
            </Box>

            {/* COMPENSAÇÃO: Como o Navbar sumiu do fluxo, empurramos o conteúdo 50px para baixo */}
            <Box pt="50px">{children}</Box>
        </>
    );
}

export const useNavbar = () => useContext(NavbarContext);
