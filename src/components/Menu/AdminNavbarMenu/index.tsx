"use client";

import { memo } from "react";
import { Menu, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AdminNavbarMenuProps } from "types";
import { NavBarIconMenu } from "components";
import { LuShield, LuBookOpen } from "react-icons/lu";
import { useTranslations } from "next-intl";

const AdminNavbarMenu = (props: AdminNavbarMenuProps) => {
    const user = props.user;
    // const { logout } = useAuthContext();

    const t = useTranslations("NavBar");
    const router = useRouter();

    if (user && user.role === "ADMIN") {
        return (
            <Menu.Root
                positioning={{
                    placement: "bottom-end",
                    gutter: 8
                }}
            >
                <Menu.Trigger asChild>
                    <NavBarIconMenu icon={<LuShield />} aria-label={t("authenticatedMenuLabel")} />
                </Menu.Trigger>

                <Portal>
                    <Menu.Positioner>
                        <Menu.Content minW="200px">
                            {/* <Menu.Separator /> */}

                            <Menu.ItemGroup>
                                <Menu.Item value="logout" cursor="pointer" onClick={() => router.push("/emprestimos")}>
                                    <LuBookOpen />
                                    <Text fontSize="md">{t("loans")}</Text>
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
