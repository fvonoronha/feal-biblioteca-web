"use client";

import { Skeleton } from "@chakra-ui/react";
import { EntityGrid, VolumeGridCard } from "components";
import { VolumesCollection } from "hooks";
import { Volume } from "types";

type Props = {
    collection: VolumesCollection;
};

export default function CollectionVolumesGrid({ collection }: Props) {
    const {
        volumes,
        isVolumesLoading,
        isVolumesLoadingFailed,
        isVolumesLoadingFirstTime,
        isVolumesLoadingFirstFilter,
        canAutoLoadMoreVolumes,
        filters
    } = collection;

    return (
        <EntityGrid
            variant="grid"
            loadingFailed={isVolumesLoadingFailed}
            // Uma vez em modo manual, quem comunica "carregando" é o próprio botão do
            // CollectionLoadMore - evitar duplicar o spinner grande aqui embaixo.
            isLoadingMore={isVolumesLoading && canAutoLoadMoreVolumes}
            isEmpty={volumes.length === 0}
            eWidth="180px"
        >
            {volumes.map((volume: Volume) => (
                <Skeleton
                    key={`volumeCard#${volume.id}`}
                    loading={isVolumesLoadingFirstTime || isVolumesLoadingFirstFilter}
                >
                    <VolumeGridCard volume={volume} search={filters.search} />
                </Skeleton>
            ))}
        </EntityGrid>
    );
}
