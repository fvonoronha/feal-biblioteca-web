"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Box, Menu, Portal, Text } from "@chakra-ui/react";

import { UserNavbarMenuProps } from "types";
import { useAuthContext } from "contexts";
import { LOGIN_ROUTE } from "hooks";
import { LuLogOut, LuUser, LuLogIn, LuBookOpen } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { NavBarIconMenu } from "components";

const UserNavbarMenu = (props: UserNavbarMenuProps) => {
    const user = props.user;
    const { logout } = useAuthContext();

    const t = useTranslations("NavBar");
    const router = useRouter();

    if (user) {
        return (
            <Menu.Root
                positioning={{
                    placement: "bottom-end",
                    gutter: 8
                }}
            >
                {/* A bolinha de aviso fica FORA do elemento clonado pelo `asChild` de propósito:
                    esse mecanismo só preserva props padrão de DOM/evento ao mesclar no elemento
                    clonado, então uma prop customizada (ex.: hasNotification) passada ali dentro
                    simplesmente desaparece silenciosamente - por isso o aviso é um Box irmão,
                    posicionado por cima do ícone, e não uma prop do próprio NavBarIconMenu. */}
                <Box position="relative" display="inline-flex">
                    <Menu.Trigger asChild>
                        <NavBarIconMenu icon={<LuUser />} aria-label={t("authenticatedMenuLabel")} />
                    </Menu.Trigger>

                    {user.has_overdue_loan && (
                        <Box
                            position="absolute"
                            top="4px"
                            right="4px"
                            boxSize="8px"
                            borderRadius="full"
                            bg="fealRed.solid"
                            border="2px solid"
                            borderColor={{ base: "white", _dark: "gray.800" }}
                            pointerEvents="none"
                        />
                    )}
                </Box>

                <Portal>
                    <Menu.Positioner>
                        <Menu.Content minW="200px">
                            <Menu.ItemGroup>
                                <Menu.Item value="account" cursor="pointer" onClick={() => router.push("/perfil")}>
                                    <LuUser />

                                    <Text fontSize="md">{t("myProfile")}</Text>
                                </Menu.Item>

                                <Menu.Item value="loans" cursor="pointer" onClick={() => router.push("/perfil/emprestimos")}>
                                    <LuBookOpen />

                                    <Text fontSize="md">{t("myLoans")}</Text>
                                </Menu.Item>
                            </Menu.ItemGroup>

                            <Menu.Separator />

                            <Menu.ItemGroup>
                                <Menu.Item value="logout" cursor="pointer" onClick={logout}>
                                    <LuLogOut />

                                    <Text fontSize="md">{t("logout")}</Text>
                                </Menu.Item>
                            </Menu.ItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    }

    // Só navega - o modal de login em si é uma rota interceptada (ver src/app/@modal), que
    // abre por cima da página atual (seja lá qual for) sem desmontar nada por trás dela.
    return (
        <NavBarIconMenu
            icon={<LuLogIn />}
            aria-label={t("unauthenticatedMenuLabel")}
            onClick={() => router.push(LOGIN_ROUTE)}
        />
    );
};

export default memo(UserNavbarMenu);
