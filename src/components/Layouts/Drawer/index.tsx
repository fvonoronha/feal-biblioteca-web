"use client";

import { memo } from "react";
import { Drawer, Portal, CloseButton, Heading, Box, Spacer } from "@chakra-ui/react";
import { DrawerProps } from "types";

const SimpleDrawer = (props: DrawerProps) => {
    const isOpen = !!props.isOpen;
    const onClose = props.onClose
        ? props.onClose
        : () => {
              console.log("Nao pode ser");
          };

    return (
        <Drawer.Root open={isOpen} onOpenChange={onClose} size="md" placement="end">
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content display="flex" flexDirection="column" maxH="100vh">
                        <Heading size="xl" pt="20px" pl="10px">
                            {props.title}
                        </Heading>

                        <Box flex="1" overflowY="auto" p="10px">
                            {props.body}
                        </Box>

                        <Drawer.Footer mt="auto">
                            <Spacer />
                            {props.footer}
                        </Drawer.Footer>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};

export default memo(SimpleDrawer);
