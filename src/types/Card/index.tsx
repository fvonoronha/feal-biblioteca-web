import { type CardRootProps } from "@chakra-ui/react";
import { Author, Book } from "types";

export interface BookCardProps extends CardRootProps {
    book: Book;
    isSeeMore?: boolean;
    isSeeMorePlaceHolder?: string;
    onClick?: () => void;
}

export interface AuthorCardProps extends CardRootProps {
    author: Author;
    isSeeMore?: boolean;
    isSeeMorePlaceHolder?: string;
    onClick?: () => void;
}
