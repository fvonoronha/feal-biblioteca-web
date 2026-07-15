import type { StaticImageData } from "next/image";

import default_author_cover from "assets/images/author/cover/default-3a17bf09.jpg";
import default_spirit_author_cover from "assets/images/author/cover/default-b4b10774.jpg";

export const authorCover: Record<string, StaticImageData> = {
    default: default_author_cover,
    default_is_spirit: default_spirit_author_cover
};
