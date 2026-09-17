"use client";

import { Skeleton, Text } from "@chakra-ui/react";
import { EntityGrid, VolumeGridCard } from "components";
import { Volume } from "types";
import { useTranslations } from "next-intl";

const SEE_MORE_AT_INDEX = 5;
const SEE_MORE_MIN_TOTAL = 6;

type Props = {
    query: string;
    volumes: Volume[];
    total: number;
    isLoading: boolean;
    hasFailed: boolean;
    onSeeMore: () => void;
    onSelectVolume: (volume: Volume) => void;
};

export default function SearchVolumeResults({ query, volumes, total, isLoading, hasFailed, onSeeMore, onSelectVolume }: Props) {
    const t = useTranslations("Collection");

    if ((volumes.length === 0 || hasFailed) && !isLoading) return null;

    return (
        <>
            <Skeleton loading={isLoading}>
                <Text>
                    {total > 1
                        ? t("filterSearchFastSearchedBooksResult", { total })
                        : t("filterSearchFastSearchedBookResult")}
                </Text>
            </Skeleton>

            <EntityGrid variant="grid" loadingFailed={false} eWidth="120px">
                {volumes.map((volume) => {
                    const isSeeMore = total > SEE_MORE_MIN_TOTAL && volumes[SEE_MORE_AT_INDEX]?.id === volume.id;

                    return (
                        <Skeleton key={`volumeCard#${volume.id}`} loading={isLoading}>
                            <VolumeGridCard
                                volume={volume}
                                search={query}
                                isSeeMore={isSeeMore}
                                isSeeMorePlaceHolder={t("filterSearchFastSearchSeeAll")}
                                onClick={() => (isSeeMore ? onSeeMore() : onSelectVolume(volume))}
                            />
                        </Skeleton>
                    );
                })}
            </EntityGrid>
        </>
    );
}
