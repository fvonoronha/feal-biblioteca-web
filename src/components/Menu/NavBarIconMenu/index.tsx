"use client";

import { memo, ReactElement } from "react";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
type NavBarIconMenuProps = IconButtonProps & {
    icon: ReactElement;
};

const NavBarIconMenu = ({ icon, ...props }: NavBarIconMenuProps) => {
    return (
        <IconButton
            variant="ghost"
            size="sm"
            color={{ base: "gray.700", _dark: "gray.200" }}
            css={{
                _icon: {
                    width: "5",
                    height: "5"
                }
            }}
            {...props}
        >
            {icon}
        </IconButton>
    );
};

export default memo(NavBarIconMenu);
