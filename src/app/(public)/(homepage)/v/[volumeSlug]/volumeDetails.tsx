"use client";

import { useParams, useRouter } from "next/navigation";
import { Author, Volume } from "types";
import { useTranslations } from "next-intl";
import {
    Body,
    PageHeading,
    GhostButton,
    VolumeImageCard,
    SimpleButton,
    SectionHeading,
    VolumeGridCard,
    EntityCarouselSection,
    AuthorSimpleCard,
    VolumeAuthorsList,
    VolumeInfoGrid,
    VolumeTextSection,
    VolumeChipList,
    VolumeShareButton,
    VolumeLoanStatusBanner,
    VolumeSiblingVolumes
} from "components";
import { useVolumeDetails } from "hooks";
import { QUERY_PARAMS_FOR_TAG, QUERY_PARAMS_FOR_SEARCH } from "utils";

import { Card, Flex, HStack, Separator, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";

import { LuArrowLeft, LuBook, LuBookMarked, LuBookOpenText, LuGlasses, LuListTodo, LuTextSearch } from "react-icons/lu";

const DIVIDER_COLOR = { base: "gray.muted", _dark: "gray.700" };

export default function VolumeDetails() {
    const t = useTranslations("VolumeDetails");
    const { volumeSlug } = useParams();
    const router = useRouter();

    const { volume, isVolumeLoading, isVolumeLoadFailed, relatedVolumes, isRelatedVolumesLoading, isRelatedVolumesLoadFailed } =
        useVolumeDetails(volumeSlug as string);

    const goToCollection = () => router.push("/");

    if (isVolumeLoadFailed) {
        return (
            <Body>
                <VStack py="20">
                    <Text>{t("errorLoading")}</Text>
                    <GhostButton onClick={() => router.back()}>{t("goBack")}</GhostButton>
                </VStack>
            </Body>
        );
    }

    const hasExtraContent =
        isVolumeLoading ||
        !!(
            volume.book?.description ||
            volume.book?.summary ||
            volume.book?.recommended_for ||
            (volume.book?.keywords && volume.book.keywords.length > 0) ||
            (volume.tags && volume.tags.length > 0)
        );

    return (
        <Body>
            <GhostButton onClick={goToCollection} pb="24px">
                <HStack>
                    <LuArrowLeft />
                    <Text>{t("backToCollection")}</Text>
                </HStack>
            </GhostButton>

            <Stack direction={{ base: "column", md: "row" }} gap={{ base: 6, md: 10 }} align="start">
                <Flex justify="center" w={{ base: "100%", md: "320px" }} flexShrink={0} bg="none" overflow="hidden">
                    <Skeleton loading={isVolumeLoading} w="100%">
                        <VolumeImageCard volume={volume} />
                    </Skeleton>
                </Flex>

                <VStack align="start" flex="1" gap={5} w="100%">
                    <Skeleton loading={isVolumeLoading} w="100%">
                        <PageHeading header={volume.book?.title} description={volume.book?.subtitle || ""} />
                    </Skeleton>

                    <VolumeAuthorsList authors={volume.authors} isLoading={isVolumeLoading} />

                    <Separator w="100%" borderColor={DIVIDER_COLOR} />

                    <VolumeInfoGrid volume={volume} isLoading={isVolumeLoading} />

                    <VolumeShareButton volume={volume} isLoading={isVolumeLoading} />

                    {!isVolumeLoading && <VolumeLoanStatusBanner volume={volume} />}

                    {!isVolumeLoading && volume.is_available === false && (volume.sibling_volumes?.length || 0) > 0 && (
                        <VolumeSiblingVolumes volumes={volume.sibling_volumes || []} />
                    )}
                </VStack>
            </Stack>

            {hasExtraContent && (
                <Card.Root variant="outline" w="100%" mt={{ base: 8, md: 10 }}>
                    <Card.Body p={{ base: 4, md: 6 }}>
                        <VStack align="stretch" gap={5} separator={<Separator borderColor={DIVIDER_COLOR} />}>
                            <VolumeTextSection
                                icon={<LuBookMarked size={16} />}
                                label={t("description")}
                                text={volume.book?.description}
                                isLoading={isVolumeLoading}
                            />

                            <VolumeTextSection
                                icon={<LuBookOpenText size={16} />}
                                label={t("summary")}
                                text={volume.book?.summary}
                                isLoading={isVolumeLoading}
                            />

                            <VolumeTextSection
                                icon={<LuGlasses size={16} />}
                                label={t("recommendedFor")}
                                text={volume.book?.recommended_for}
                                isLoading={isVolumeLoading}
                            />

                            <VolumeChipList
                                icon={<LuTextSearch size={16} />}
                                label={t("keywords")}
                                isLoading={isVolumeLoading}
                                items={(volume.book?.keywords || []).map((keyword) => ({
                                    key: keyword,
                                    label: keyword,
                                    onClick: () => router.push(`/?${QUERY_PARAMS_FOR_SEARCH}=${encodeURIComponent(keyword)}`)
                                }))}
                            />

                            <VolumeChipList
                                icon={<LuListTodo size={16} />}
                                label={t("tags")}
                                isLoading={isVolumeLoading}
                                items={(volume.tags || []).map((tag) => ({
                                    key: tag.id,
                                    label: tag.name,
                                    onClick: () => router.push(`/?${QUERY_PARAMS_FOR_TAG}=${encodeURIComponent(tag.slug.toString())}`)
                                }))}
                            />
                        </VStack>
                    </Card.Body>
                </Card.Root>
            )}

            <EntityCarouselSection
                header={(volume.authors || []).length > 1 ? t("authors") : t("author")}
                items={volume.authors || []}
                isLoading={isVolumeLoading}
                itemKey={(author: Author) => author.id}
                renderItem={(author: Author) => <AuthorSimpleCard author={author} onClick={() => router.push(`/a/${author.slug}`)} />}
            />

            <EntityCarouselSection
                header={t("relatedVolumes")}
                items={relatedVolumes}
                isLoading={isRelatedVolumesLoading}
                loadingFailed={isRelatedVolumesLoadFailed}
                itemKey={(relatedVolume: Volume) => relatedVolume.id}
                renderItem={(relatedVolume: Volume) => <VolumeGridCard volume={relatedVolume} />}
            />

            <VStack
                mt={{ base: 10, md: 12 }}
                pt={8}
                gap={4}
                align="center"
                borderTopWidth="1px"
                borderColor={DIVIDER_COLOR}
            >
                <Skeleton loading={isVolumeLoading}>
                    <VStack align="center" gap={4}>
                        <SectionHeading
                            header={t("didntFindWhatYouWereLookingFor")}
                            description={t("weAreWorkingOnIt")}
                            align="center"
                        />

                        <SimpleButton onClick={goToCollection}>
                            <HStack>
                                <LuBook />
                                <Text>{t("backToCollection")}</Text>
                            </HStack>
                        </SimpleButton>
                    </VStack>
                </Skeleton>
            </VStack>
        </Body>
    );
}
