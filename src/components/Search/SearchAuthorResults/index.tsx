"use client";

import { Skeleton, Text } from "@chakra-ui/react";
import { AuthorGridCard, EntityGrid } from "components";
import { Author } from "types";
import { useTranslations } from "next-intl";

const SEE_MORE_AT_INDEX = 5;
const SEE_MORE_MIN_TOTAL = 6;

type Props = {
    query: string;
    authors: Author[];
    total: number;
    isLoading: boolean;
    hasFailed: boolean;
    onSeeMore: () => void;
    onSelectAuthor: (author: Author) => void;
};

export default function SearchAuthorResults({ query, authors, total, isLoading, hasFailed, onSeeMore, onSelectAuthor }: Props) {
    const t = useTranslations("Collection");

    if ((authors.length === 0 || hasFailed) && !isLoading) return null;

    return (
        <>
            <Skeleton loading={isLoading}>
                <Text>
                    {total > 1
                        ? t("filterSearchFastSearchedAuthorsResult", { total })
                        : t("filterSearchFastSearchedAuthorResult")}
                </Text>
            </Skeleton>

            <EntityGrid variant="grid" loadingFailed={false} eWidth="120px">
                {authors.map((author) => {
                    const isSeeMore = total > SEE_MORE_MIN_TOTAL && authors[SEE_MORE_AT_INDEX]?.id === author.id;

                    return (
                        <Skeleton key={`searchAuthorCard#${author.id}`} loading={isLoading}>
                            <AuthorGridCard
                                author={author}
                                search={query}
                                isSeeMore={isSeeMore}
                                isSeeMorePlaceHolder={t("filterSearchFastSearchSeeAll")}
                                onClick={() => (isSeeMore ? onSeeMore() : onSelectAuthor(author))}
                            />
                        </Skeleton>
                    );
                })}
            </EntityGrid>
        </>
    );
}
