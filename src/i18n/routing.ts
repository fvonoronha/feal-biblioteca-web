import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // locales: ["en", "pt", "es"],
    // ToDo: deixar apenas PT
    locales: ["en", "pt", "de", "es", "zh", "ja", "fr", "hi", "ru", "ko", "it", "ar", "el", "vi", "he", "eo", "la"],
    defaultLocale: "pt",
    localePrefix: "never"
});
