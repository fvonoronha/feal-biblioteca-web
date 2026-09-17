import { callAPI } from "utils";

// Pede pro SERVIDOR baixar uma URL de imagem colada pelo usuário e devolver os bytes como
// data URL - usado antes do recorte no front, que de outra forma esbarraria em CORS ao tentar
// ler pixels de uma imagem hospedada em outro domínio direto num <canvas>.
export const fetchImageFromUrl = async (url: string): Promise<string | undefined> => {
    const response = await callAPI<{ image?: { dataUrl?: string } }>({
        method: "POST",
        url: `/image/fetch-from-url`,
        data: { url }
    });

    return response?.body?.image?.dataUrl;
};
