"use client";

import { Fragment } from "react";
import { HStack, Skeleton, Text, Wrap } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LuPen, LuStar } from "react-icons/lu";
import { Author } from "types";

type Props = {
    authors?: Author[];
    isLoading: boolean;
};

type AuthorGroup = {
    key: string;
    label: string;
    isSpirit: boolean;
    authors: Author[];
};

/**
 * Groups authors that share the same role (e.g. two "Codificador"s) under a single
 * icon+label, listing their names side by side separated by commas - otherwise a book with
 * several authors under the same role repeats the same icon and word over and over.
 */
function groupAuthorsByRole(authors: Author[], authorLabel: string, spiritLabel: string): AuthorGroup[] {
    const groups: AuthorGroup[] = [];

    authors.forEach((author) => {
        const label = author.role || (author.is_spirit ? spiritLabel : authorLabel);
        const key = `${label}__${author.is_spirit ? "spirit" : "regular"}`;
        const existingGroup = groups.find((group) => group.key === key);

        if (existingGroup) {
            existingGroup.authors.push(author);
        } else {
            groups.push({ key, label, isSpirit: author.is_spirit, authors: [author] });
        }
    });

    return groups;
}

export default function VolumeAuthorsList({ authors, isLoading }: Props) {
    const t = useTranslations("VolumeDetails");
    const router = useRouter();

    if (!authors || authors.length === 0) return null;

    const groups = groupAuthorsByRole(authors, t("authorRole"), t("authorSpiritRole"));

    // Abre o modal biográfico do autor (rota interceptada /a/[slug]) - quem clica no nome de
    // um autor aqui quer saber mais sobre ELE, não filtrar o catálogo por essa pessoa.
    const goToAuthor = (author: Author) => router.push(`/a/${author.slug}`);

    return (
        <Skeleton loading={isLoading} w="100%">
            <Wrap gap={4} rowGap={2}>
                {groups.map((group) => (
                    <HStack key={group.key} gap={2} align="center">
                        {group.isSpirit ? <LuStar size={16} /> : <LuPen size={16} />}

                        <Text fontSize="sm" color="fg.muted">
                            {group.label}:
                        </Text>

                        <Text>
                            {group.authors.map((author, index) => (
                                <Fragment key={author.id}>
                                    <Text
                                        as="span"
                                        fontWeight="bold"
                                        cursor="pointer"
                                        _hover={{ color: "fealRedHover" }}
                                        onClick={() => goToAuthor(author)}
                                    >
                                        {author.name}
                                    </Text>
                                    {index < group.authors.length - 1 ? ", " : ""}
                                </Fragment>
                            ))}
                        </Text>
                    </HStack>
                ))}
            </Wrap>
        </Skeleton>
    );
}
