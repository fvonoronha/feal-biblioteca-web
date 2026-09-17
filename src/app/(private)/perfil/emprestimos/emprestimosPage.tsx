"use client";

import { useTranslations } from "next-intl";
import { Card, VStack } from "@chakra-ui/react";
import { Body, PageHeading, MyLoansList } from "components";

export default function MeusEmprestimosPage() {
    const t = useTranslations("ProfilePage");

    return (
        <Body>
            <VStack pb="24px" align="start">
                <PageHeading header={t("loansSectionTitle")} description={t("loansSectionDescription")} />
            </VStack>

            <Card.Root variant="outline" w="100%" maxW="700px">
                <Card.Body p={{ base: 4, md: 6 }}>
                    <MyLoansList />
                </Card.Body>
            </Card.Root>
        </Body>
    );
}
