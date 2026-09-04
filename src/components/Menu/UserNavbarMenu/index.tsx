"use client";

import { memo, useState } from "react";
import { Menu, Portal, Text, DialogRoot, DialogTrigger, DialogBackdrop, DialogContent } from "@chakra-ui/react";

import { UserNavbarMenuProps } from "types";
import { useAuthContext } from "contexts";
import { LuLogOut, LuUser, LuLogIn } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { NavBarIconMenu } from "components";

import Login from "./LoginPage";
import CreateAccount from "./RegisterPage";

const UserNavbarMenu = (props: UserNavbarMenuProps) => {
    const user = props.user;
    const { logout } = useAuthContext();

    const t = useTranslations("NavBar");

    const [open, setOpen] = useState(false);
    const [page, setPage] = useState<"login" | "create-account">("login");

    const [justCreatedAccount, setJustCreatedAccount] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    };

    if (user) {
        return (
            <Menu.Root
                positioning={{
                    placement: "bottom-end",
                    gutter: 8
                }}
            >
                <Menu.Trigger asChild>
                    <NavBarIconMenu icon={<LuUser />} aria-label={t("authenticatedMenuLabel")} />
                </Menu.Trigger>

                <Portal>
                    <Menu.Positioner>
                        <Menu.Content minW="200px">
                            {/* <Menu.ItemGroup>
                                <Menu.Item value="account" cursor="pointer">
                                    <LuUser />

                                    <Text fontSize="md">{t("myProfile")}</Text>
                                </Menu.Item>
                            </Menu.ItemGroup>

                            <Menu.Separator /> */}

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
    } else {
        return (
            <DialogRoot
                lazyMount
                open={open}
                onOpenChange={(e) => {
                    setOpen(e.open);
                }}
                size="xl"
            >
                <DialogTrigger asChild>
                    <NavBarIconMenu icon={<LuLogIn />} aria-label={t("unauthenticatedMenuLabel")} />
                </DialogTrigger>

                <DialogBackdrop background="blackAlpha.600" backdropFilter="blur(4px)" />

                <DialogContent
                    borderRadius="lg"
                    bg="gray.subtle"
                    position="fixed"
                    top="10%"
                    left="50%"
                    transform="translateX(-50%)"
                    width={{ base: "90vw", md: "500px" }}
                    maxH="90vh"
                    overflowY="auto"
                >
                    {page === "login" ? (
                        <Login
                            justCreatedAccount={justCreatedAccount}
                            onCreateAccount={() => {
                                setJustCreatedAccount(false);
                                setPage("create-account");
                            }}
                            onClose={handleClose}
                        />
                    ) : (
                        <CreateAccount
                            onLogin={(options) => {
                                setJustCreatedAccount(options.justCreatedAccount);
                                setPage("login");
                            }}
                            onClose={handleClose}
                        />
                    )}
                </DialogContent>
            </DialogRoot>
        );
    }
};

export default memo(UserNavbarMenu);
