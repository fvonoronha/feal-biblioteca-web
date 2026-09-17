"use client";

import { useTranslations } from "next-intl";
import { LegalPageLayout, LegalSection, LegalParagraph, LegalList } from "components";

const LAST_UPDATED = "16/09/2026";

export default function TermosDeUsoPage() {
    const t = useTranslations("TermsOfUsePage");

    return (
        <LegalPageLayout title={t("title")} lastUpdated={LAST_UPDATED}>
            <LegalParagraph>{t("intro")}</LegalParagraph>

            <LegalSection title={t("section1Title")}>
                <LegalParagraph>{t("section1Text1")}</LegalParagraph>
                <LegalParagraph>{t("section1Text2")}</LegalParagraph>
            </LegalSection>

            <LegalSection title={t("section2Title")}>
                <LegalParagraph>{t("section2Text1")}</LegalParagraph>
                <LegalParagraph>{t("section2Text2")}</LegalParagraph>
            </LegalSection>

            <LegalSection title={t("section3Title")}>
                <LegalParagraph>{t("section3Text1")}</LegalParagraph>
                <LegalList items={t.raw("section3List") as string[]} />
            </LegalSection>

            <LegalSection title={t("section4Title")}>
                <LegalParagraph>{t("section4Text1")}</LegalParagraph>
                <LegalList items={t.raw("section4List") as string[]} />
            </LegalSection>

            <LegalSection title={t("section5Title")}>
                <LegalParagraph>{t("section5Text1")}</LegalParagraph>
            </LegalSection>

            <LegalSection title={t("section6Title")}>
                <LegalParagraph>{t("section6Text1")}</LegalParagraph>
            </LegalSection>

            <LegalSection title={t("section7Title")}>
                <LegalParagraph>{t("section7Text1")}</LegalParagraph>
            </LegalSection>

            <LegalSection title={t("section8Title")}>
                <LegalParagraph>{t("section8Text1")}</LegalParagraph>
            </LegalSection>
        </LegalPageLayout>
    );
}
