import { type CardRootProps } from "@chakra-ui/react";
import { Author, Book, Volume } from "types";

export interface BookCardProps extends CardRootProps {
    book: Book;
    isSeeMore?: boolean;
    isSeeMorePlaceHolder?: string;
    onClick?: () => void;
}

export interface VolumeCardProps extends CardRootProps {
    volume: Volume;
    isSeeMore?: boolean;
    isSeeMorePlaceHolder?: string;
    search?: string;
    onClick?: () => void;
}

export interface AuthorCardProps extends CardRootProps {
    author: Author;
    isSeeMore?: boolean;
    isSeeMorePlaceHolder?: string;
    search?: string;
    onClick?: () => void;
}
