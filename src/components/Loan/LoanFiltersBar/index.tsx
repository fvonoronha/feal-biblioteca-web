"use client";

import { memo } from "react";
import { Box, Flex, HStack, Input, InputGroup } from "@chakra-ui/react";
import { LuUser, LuBookMarked } from "react-icons/lu";
import { SortSelect } from "components";
import { LoanState, SortOption, LOAN_SORT_OPTIONS } from "types";
import { useTranslations } from "next-intl";

type LoanStateFilter = LoanState | "all";

interface LoanFiltersBarProps {
    userSearch: string;
    onUserSearchChange: (value: string) => void;
    volumeSearch: string;
    onVolumeSearchChange: (value: string) => void;
    state: LoanStateFilter;
    onStateChange: (value: LoanStateFilter) => void;
    sort: SortOption;
    onSortChange: (value: SortOption) => void;
}

const STATE_OPTIONS: LoanStateFilter[] = ["all", "overdue", "open", "returned"];

function LoanFiltersBar({
    userSearch,
    onUserSearchChange,
    volumeSearch,
    onVolumeSearchChange,
    state,
    onStateChange,
    sort,
    onSortChange
}: LoanFiltersBarProps) {
    const t = useTranslations("Loans");

    return (
        <Flex direction="column" gap={3} w="full" pb={5}>
            <Flex direction={{ base: "column", md: "row" }} gap={3} w="full">
                <InputGroup flex={1} startElement={<LuUser size={16} />}>
                    <Input
                        value={userSearch}
                        onChange={(e) => onUserSearchChange(e.target.value)}
                        placeholder={t("filterUserPlaceholder")}
                        size="sm"
                        borderRadius="md"
                    />
                </InputGroup>

                <InputGroup flex={1} startElement={<LuBookMarked size={16} />}>
                    <Input
                        value={volumeSearch}
                        onChange={(e) => onVolumeSearchChange(e.target.value)}
                        placeholder={t("filterVolumePlaceholder")}
                        size="sm"
                        borderRadius="md"
                    />
                </InputGroup>

                <Box w={{ base: "full", md: "260px" }} flexShrink={0}>
                    <SortSelect
                        value={sort}
                        onChange={onSortChange}
                        options={LOAN_SORT_OPTIONS()}
                        namespace="Loans"
                        labelPosition="left"
                    />
                </Box>
            </Flex>

            <HStack gap={2} overflowX="auto" pb="2px" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
                {STATE_OPTIONS.map((option) => (
                    <Box
                        key={option}
                        as="button"
                        onClick={() => onStateChange(option)}
                        px={4}
                        py={1.5}
                        flexShrink={0}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                        cursor="pointer"
                        transition="all .15s"
                        bg={state === option ? "fealRed.solid" : { base: "gray.100", _dark: "gray.700" }}
                        color={state === option ? "white" : { base: "gray.700", _dark: "gray.200" }}
                        _hover={state === option ? undefined : { bg: { base: "gray.200", _dark: "gray.600" } }}
                    >
                        {t(`filterState_${option}`)}
                    </Box>
                ))}
            </HStack>
        </Flex>
    );
}

export default memo(LoanFiltersBar);
