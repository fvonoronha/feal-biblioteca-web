import { memo } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

const Body = (props: BoxProps) => {
    return (
        <Box minH="calc(100vh - 50px)" bg={{ base: "gray.100", _dark: "gray.900" }} w="100%">
            <Box maxW="1440px" mx="auto" p={{ base: "10px", md: "20px", lg: "40px" }} {...props}>
                {props.children}
            </Box>
        </Box>
    );
};

export default memo(Body);
