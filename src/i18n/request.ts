import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import deepmerge from "deepmerge";

// `deepmerge` concatena arrays por padrão (`[1,2]` + `[1,2]` = `[1,2,1,2]`) - errado para
// mensagens de tradução, onde um valor-array (ex.: os itens de uma lista em t.raw()) de um
// idioma deve SUBSTITUIR o do outro, nunca se juntar a ele. Sem isso, qualquer chave cujo
// valor seja um array aparecia duplicada na tela.
const replaceArrays = (_destinationArray: unknown[], sourceArray: unknown[]) => sourceArray;

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";
    const messagesPt = (await import(`../../messages/pt.json`)).default;

    // pt é o idioma-base: mesclar o arquivo com ele mesmo não teria nenhum efeito além de
    // desperdiçar o import duplicado e (antes desta correção) duplicar arrays via deepmerge.
    if (locale === "pt") {
        return { locale, messages: messagesPt };
    }

    const messages = (await import(`../../messages/${locale}.json`)).default;

    return {
        locale,
        // pt.json entra como base (cobre qualquer chave que eventualmente falte no idioma
        // escolhido) e `messages` sobrescreve por cima com as traduções de fato.
        messages: deepmerge(messagesPt, messages, { arrayMerge: replaceArrays })
    };
});
