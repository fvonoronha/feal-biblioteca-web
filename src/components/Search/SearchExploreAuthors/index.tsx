"use client";

import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { AuthorGridCard, EntityGrid } from "components";
import { Author } from "types";

type Props = {
    title: string;
    authors: Author[];
    isLoading: boolean;
    hide?: boolean;
    onSelectAuthor: (author: Author) => void;
};

export default function SearchExploreAuthors({ title, authors, isLoading, hide = false, onSelectAuthor }: Props) {
    if (hide) return null;

    return (
        <Stack gap="2" pt="4">
            <Text fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="wider" pt="4" pb="2">
                {title.toUpperCase()}
            </Text>

            <EntityGrid variant="grid" loadingFailed={false} isEmpty={authors.length === 0} eWidth="120px">
                {authors.map((author: Author) => (
                    <Skeleton key={`authorCard#${author.id}`} loading={isLoading}>
                        <AuthorGridCard author={author} onClick={() => onSelectAuthor(author)} />
                    </Skeleton>
                ))}
            </EntityGrid>
        </Stack>
    );
}
