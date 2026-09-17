"use client";

import { memo } from "react";
import { Menu, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AdminNavbarMenuProps } from "types";
import { NavBarIconMenu } from "components";
import { LuShield, LuBookOpen, LuBookPlus, LuLibraryBig, LuUsers, LuUserRound, LuBuilding2, LuBlocks, LuTag } from "react-icons/lu";
import { useTranslations } from "next-intl";

const AdminNavbarMenu = (props: AdminNavbarMenuProps) => {
    const user = props.user;

    const t = useTranslations("NavBar");
    const router = useRouter();

    // Gerenciamento (empréstimos, acervo, usuários) é trabalho de rotina de ADMIN e
    // LIBRARIAN - só as ações mais sensíveis (papel/status de usuário) ficam restritas a
    // ADMIN, tratado dentro de cada página, não aqui no menu.
    if (user && (user.role === "ADMIN" || user.role === "LIBRARIAN")) {
        return (
            <Menu.Root
                positioning={{
                    placement: "bottom-end",
                    gutter: 8
                }}
            >
                <Menu.Trigger asChild>
                    <NavBarIconMenu icon={<LuShield />} aria-label={t("adminMenuLabel")} />
                </Menu.Trigger>

                <Portal>
                    <Menu.Positioner>
                        <Menu.Content minW="220px">
                            <Menu.ItemGroup>
                                <Menu.ItemGroupLabel>{t("groupLoans")}</Menu.ItemGroupLabel>
                                <Menu.Item value="loans" cursor="pointer" onClick={() => router.push("/emprestimos")}>
                                    <LuBookOpen />
                                    <Text fontSize="md">{t("loans")}</Text>
                                </Menu.Item>

                                <Menu.Item value="newLoan" cursor="pointer" onClick={() => router.push("/emprestimos/novo")}>
                                    <LuBookPlus />
                                    <Text fontSize="md">{t("newLoan")}</Text>
                                </Menu.Item>
                            </Menu.ItemGroup>

                            <Menu.Separator />

                            <Menu.ItemGroup>
                                <Menu.ItemGroupLabel>{t("groupCatalog")}</Menu.ItemGroupLabel>
                                <Menu.Item value="catalog" cursor="pointer" onClick={() => router.push("/acervo")}>
                                    <LuLibraryBig />
                                    <Text fontSize="md">{t("catalog")}</Text>
                                </Menu.Item>

                                <Menu.Item value="authors" cursor="pointer" onClick={() => router.push("/autores")}>
                                    <LuUserRound />
                                    <Text fontSize="md">{t("authors")}</Text>
                                </Menu.Item>

                                <Menu.Item value="publishers" cursor="pointer" onClick={() => router.push("/editoras")}>
                                    <LuBuilding2 />
                                    <Text fontSize="md">{t("publishers")}</Text>
                                </Menu.Item>

                                <Menu.Item value="categories" cursor="pointer" onClick={() => router.push("/categorias")}>
                                    <LuBlocks />
                                    <Text fontSize="md">{t("categories")}</Text>
                                </Menu.Item>

                                <Menu.Item value="tags" cursor="pointer" onClick={() => router.push("/temas")}>
                                    <LuTag />
                                    <Text fontSize="md">{t("tags")}</Text>
                                </Menu.Item>
                            </Menu.ItemGroup>

                            <Menu.Separator />

                            <Menu.ItemGroup>
                                <Menu.ItemGroupLabel>{t("groupUsers")}</Menu.ItemGroupLabel>
                                <Menu.Item value="users" cursor="pointer" onClick={() => router.push("/usuarios")}>
                                    <LuUsers />
                                    <Text fontSize="md">{t("users")}</Text>
                                </Menu.Item>
                            </Menu.ItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    }

    return <></>;
};

export default memo(AdminNavbarMenu);
