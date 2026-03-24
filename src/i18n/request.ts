import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import deepmerge from "deepmerge";

export default getRequestConfig(async () => {
    const cookieStore = await cookies();

    const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const messagesPt = (await import(`../../messages/pt.json`)).default;

    return {
        locale,
        messages: deepmerge(messagesPt, messages)
    };
});
