"use client";

import { memo } from "react";
import { Button } from "@chakra-ui/react";
import { SimpleButtonProps } from "types";

const SimpleButton = (props: SimpleButtonProps) => {
    // `variant="plain"` combinado com `bg`/`color` manuais fazia o fundo do botão ficar
    // transparente (texto branco sobre fundo transparente = botão invisível). O variant padrão
    // do Button ("solid") já usa o colorPalette "fealRed" definido no tema global.
    return (
        <Button fontSize={"md"} {...props}>
            {props.children}
        </Button>
    );
};

export default memo(SimpleButton);
