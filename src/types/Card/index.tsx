import { type CardRootProps } from "@chakra-ui/react";
import { Book } from "types";

export interface BookCardProps extends CardRootProps {
    book: Book;
}
