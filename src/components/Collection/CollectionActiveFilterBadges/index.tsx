"use client";

import { Wrap, WrapItem } from "@chakra-ui/react";
import { ActiveFilterBadge } from "components";
import { VolumesCollection } from "hooks";
import { useTranslations } from "next-intl";

type Props = {
    collection: VolumesCollection;
};

export default function CollectionActiveFilterBadges({ collection }: Props) {
    const t = useTranslations("Collection");
    const { categories, tags, authors, publishers, filters } = collection;
    const {
        search,
        categories: categorySlugs,
        tags: tagSlugs,
        authors: authorSlugs,
        spiritAuthors: spiritAuthorSlugs,
        publishers: publisherSlugs,
        setSearch,
        setCategories,
        setTags,
        setAuthors,
        setSpiritAuthors,
        setPublishers
    } = filters;

    return (
        <Wrap>
            {search !== "" && (
                <WrapItem>
                    <ActiveFilterBadge
                        label={`${t("search")}: ${search}`}
                        value={search}
                        cancelFilter={() => setSearch("")}
                    />
                </WrapItem>
            )}

            {categories
                .filter((category) => categorySlugs.includes(category.slug))
                .map((category) => (
                    <WrapItem key={`category#${category.id}`}>
                        <ActiveFilterBadge
                            label={`${t("category")}: ${category.name}`}
                            value={category.slug}
                            cancelFilter={(val) => setCategories(categorySlugs.filter((slug) => slug !== val))}
                        />
                    </WrapItem>
                ))}

            {authors
                .filter((author) => authorSlugs.includes(author.slug) || spiritAuthorSlugs.includes(author.slug))
                .map((author) => (
                    <WrapItem key={`author#${author.id}`}>
                        <ActiveFilterBadge
                            label={`${t("author")}: ${author.name}`}
                            value={author.slug}
                            cancelFilter={(val) => {
                                setAuthors(authorSlugs.filter((slug) => slug !== val));
                                setSpiritAuthors(spiritAuthorSlugs.filter((slug) => slug !== val));
                            }}
                        />
                    </WrapItem>
                ))}

            {tags
                .filter((tag) => tagSlugs.includes(tag.slug))
                .map((tag) => (
                    <WrapItem key={`tag#${tag.id}`}>
                        <ActiveFilterBadge
                            label={`${t("tag")}: ${tag.name}`}
                            value={tag.slug}
                            cancelFilter={(val) => setTags(tagSlugs.filter((slug) => slug !== val))}
                        />
                    </WrapItem>
                ))}

            {publishers
                .filter((publisher) => publisherSlugs.includes(publisher.slug))
                .map((publisher) => (
                    <WrapItem key={`publisher#${publisher.id}`}>
                        <ActiveFilterBadge
                            label={`${t("publisher")}: ${publisher.abbreviation ? publisher.abbreviation : publisher.name}`}
                            value={publisher.slug}
                            cancelFilter={(val) => setPublishers(publisherSlugs.filter((slug) => slug !== val))}
                        />
                    </WrapItem>
                ))}
        </Wrap>
    );
}
