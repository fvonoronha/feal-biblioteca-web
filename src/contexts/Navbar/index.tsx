"use client";

import { Flex, HStack, Box, useBreakpointValue } from "@chakra-ui/react";
import { FealLogo, UserNavbarMenu, SearchInput } from "components";
import { ColorModeButton } from "components/ui/color-mode";
import { APP_MAX_WIDTH_IN_PX } from "utils";
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
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { user } = useAuthContext();
    const router = useRouter();
    const t = useTranslations("NavBar");
    const clickMainLogo = () => {
        router.push("/");
    };

    return (
        <>
            <Box
                as="nav"
                position="fixed"
                top="0"
                left="0"
                right="0"
                w="full"
                h="50px"
                zIndex="sticky"
                bg={{ base: "white", _dark: "gray.800" }}
                borderBottom="1px solid"
                borderColor={"gray.muted"}
            >
                <Flex
                    h="full"
                    w="full"
                    maxW={`${APP_MAX_WIDTH_IN_PX}px`}
                    mx="auto"
                    align="center"
                    justify="space-between"
                    px={{ base: "10px", md: "20px", lg: "40px" }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <FealLogo
                        size="sm"
                        name={isMobile ? t("titleMobile") : t("title")}
                        onClick={clickMainLogo}
                        cursor={"pointer"}
                    />

                    <HStack gap={1}>
                        <Flex align="center" gap={0}>
                            <SearchInput />
                        </Flex>

                        <Flex align="center" gap={0}>
                            <ColorModeButton />
                        </Flex>

                        <UserNavbarMenu user={user} />
                    </HStack>
                </Flex>
            </Box>

            <Box pt="50px">{children}</Box>
        </>
    );
}

export const useNavbar = () => useContext(NavbarContext);
