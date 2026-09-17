import { callAPI, createEmptyPaginatedResponse } from "utils";
import { APIPaginatedResponse, Volume, APICallOptions, PaginationRequest } from "types";

export const listVolumes = async (
    filter = {},
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Volume>> => {
    const response = await callAPI<{ volume?: APIPaginatedResponse<Volume> }>({
        method: "POST",
        url: `/volumes`,
        data: { filter: filter, pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.volume || createEmptyPaginatedResponse<Volume>();
};

export const getVolume = async (slug: string, options?: APICallOptions): Promise<Volume | undefined> => {
    const response = await callAPI<{ volume?: Volume }>({
        method: "GET",
        url: `/volume/${slug}`,
        signal: options?.signal
    });

    return response?.body?.volume;
};

export type VolumePayload = {
    book_id?: number;
    publisher_id?: number | null;
    year?: number | null;
    edition?: string | null;
    isbn?: string | null;
    isbn_old?: string | null;
    pages?: number | null;
    description?: string | null;
    pdf_url?: string | null;
    cover_url?: string | null;
    back_url?: string | null;
    images_url?: string[];
    keywords?: string[];
    label?: string | null;
    shelf?: string | null;
};

// Nova edição/exemplar para um livro JÁ existente. Para o primeiro volume de um livro novo,
// use createBook (em endpoints/Books), que cria os dois juntos.
export const createVolume = async (payload: VolumePayload & { book_id: number }): Promise<Volume | undefined> => {
    const response = await callAPI<{ volume?: Volume }>({
        method: "POST",
        url: `/volume`,
        data: payload
    });

    return response?.body?.volume;
};

export const updateVolume = async (volumeId: number, payload: Partial<VolumePayload>): Promise<Volume | undefined> => {
    const response = await callAPI<{ volume?: Volume }>({
        method: "PUT",
        url: `/volume/${volumeId}`,
        data: payload
    });

    return response?.body?.volume;
};

// As 3 funções de upload abaixo recebem um Blob já recortado/redimensionado no front (via
// react-easy-crop + canvas, ver components/Image) - o backend só reprocessa pra JPEG e garante
// as dimensões finais (ver COVER_WIDTH/COVER_HEIGHT em volume.service.js), nunca recorta.
export const uploadVolumeCover = async (volumeId: number, image: Blob): Promise<Volume | undefined> => {
    const formData = new FormData();
    formData.append("image", image, "cover.jpg");

    const response = await callAPI<{ volume?: Volume }>({
        method: "POST",
        url: `/volume/${volumeId}/cover`,
        data: formData
    });

    return response?.body?.volume;
};

export const uploadVolumeBack = async (volumeId: number, image: Blob): Promise<Volume | undefined> => {
    const formData = new FormData();
    formData.append("image", image, "back.jpg");

    const response = await callAPI<{ volume?: Volume }>({
        method: "POST",
        url: `/volume/${volumeId}/back`,
        data: formData
    });

    return response?.body?.volume;
};

export const addVolumeAuxImage = async (volumeId: number, image: Blob): Promise<Volume | undefined> => {
    const formData = new FormData();
    formData.append("image", image, "image.jpg");

    const response = await callAPI<{ volume?: Volume }>({
        method: "POST",
        url: `/volume/${volumeId}/images`,
        data: formData
    });

    return response?.body?.volume;
};

export const removeVolumeAuxImage = async (volumeId: number, imageUrl: string): Promise<Volume | undefined> => {
    const response = await callAPI<{ volume?: Volume }>({
        method: "DELETE",
        url: `/volume/${volumeId}/images`,
        params: { url: imageUrl }
    });

    return response?.body?.volume;
};

export type VolumeAuthorLink = { id: number; author_id: number; volume_id: number; description?: string; status: string };

export const linkAuthorToVolume = async (
    volumeId: number,
    authorId: number,
    description?: string
): Promise<VolumeAuthorLink | undefined> => {
    const response = await callAPI<{ volume_author?: VolumeAuthorLink }>({
        method: "PUT",
        url: `/volume/${volumeId}/author/${authorId}/link`,
        data: { description }
    });

    return response?.body?.volume_author;
};

export const unlinkAuthorFromVolume = async (volumeId: number, authorId: number): Promise<boolean> => {
    const response = await callAPI<{ volume_author?: VolumeAuthorLink }>({
        method: "DELETE",
        url: `/volume/${volumeId}/author/${authorId}/unlink`
    });

    return !!response?.body?.volume_author;
};

export const deleteVolume = async (volumeId: number): Promise<boolean> => {
    const response = await callAPI<{ volume?: { deleted?: boolean } }>({
        method: "DELETE",
        url: `/volume/${volumeId}`
    });

    return !!response?.body?.volume?.deleted;
};

export const listRelatedVolumes = async (
    volumeId: number,
    pagination: PaginationRequest = { limit: 10, page: 1 },
    options?: APICallOptions
): Promise<APIPaginatedResponse<Volume>> => {
    const response = await callAPI<{ volume?: APIPaginatedResponse<Volume> }>({
        method: "POST",
        url: `/volume/${volumeId}/related-volumes`,
        data: { pagination: pagination },
        signal: options?.signal
    });

    return response?.body?.volume || createEmptyPaginatedResponse<Volume>();
};
