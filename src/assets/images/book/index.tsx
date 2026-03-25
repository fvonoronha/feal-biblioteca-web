import type { StaticImageData } from "next/image";

import default_book_cover from "assets/images/book/cover/default-cover.png";

import empty_book_label from "assets/images/book/label/book_label.png";

export const bookCover: Record<string, StaticImageData> = {
    default: default_book_cover
};

export const bookLabel: Record<string, StaticImageData> = {
    empty: empty_book_label
};
