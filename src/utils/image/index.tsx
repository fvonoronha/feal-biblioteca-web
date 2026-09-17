export type PixelCrop = { x: number; y: number; width: number; height: number };

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", () => reject(new Error("Não foi possível carregar a imagem.")));
        image.src = src;
    });

// Recorta `imageSrc` (data URL ou object URL - nunca a URL remota original direto, pra nunca
// esbarrar em CORS) na área `cropPixels` (em pixels da imagem original, como devolvido pelo
// onCropComplete do react-easy-crop) e redesenha no tamanho final desejado, produzindo um
// arquivo JPEG já na proporção e dimensão certas para o backend (que só estica/redimensiona,
// nunca recorta - ver image.service.js).
export const getCroppedImageBlob = async (
    imageSrc: string,
    cropPixels: PixelCrop,
    outputWidth: number,
    outputHeight: number
): Promise<Blob> => {
    const image = await loadImageElement(imageSrc);

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D não suportado neste navegador.");

    context.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem recortada."))),
            "image/jpeg",
            0.92
        );
    });
};
