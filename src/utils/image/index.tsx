export type PixelCrop = { x: number; y: number; width: number; height: number };

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", () => reject(new Error("Não foi possível carregar a imagem.")));
        image.src = src;
    });

const getRadianAngle = (degrees: number) => (degrees * Math.PI) / 180;

// Dimensão do retângulo que envolve a imagem original já rotacionada - é dentro desse
// retângulo que o react-easy-crop calcula `cropPixels` quando `rotation` != 0.
const getRotatedBoundingSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
    };
};

// Recorta `imageSrc` (data URL ou object URL - nunca a URL remota original direto, pra nunca
// esbarrar em CORS) na área `cropPixels` (em pixels, como devolvido pelo onCropComplete do
// react-easy-crop) e redesenha no tamanho final desejado, produzindo um arquivo JPEG já na
// proporção e dimensão certas para o backend (que só estica/redimensiona, nunca recorta - ver
// image.service.js). Quando `rotation` (graus) é informado, primeiro "revela" a imagem já
// rotacionada num canvas intermediário do tamanho do seu retângulo envolvente - é dali que
// `cropPixels` recorta, exatamente como o react-easy-crop calcula essas coordenadas.
export const getCroppedImageBlob = async (
    imageSrc: string,
    cropPixels: PixelCrop,
    outputWidth: number,
    outputHeight: number,
    rotation = 0
): Promise<Blob> => {
    const image = await loadImageElement(imageSrc);

    let source: HTMLImageElement | HTMLCanvasElement = image;

    if (rotation) {
        const { width: boundingWidth, height: boundingHeight } = getRotatedBoundingSize(
            image.width,
            image.height,
            rotation
        );

        const rotatedCanvas = document.createElement("canvas");
        rotatedCanvas.width = boundingWidth;
        rotatedCanvas.height = boundingHeight;

        const rotatedContext = rotatedCanvas.getContext("2d");
        if (!rotatedContext) throw new Error("Canvas 2D não suportado neste navegador.");

        rotatedContext.translate(boundingWidth / 2, boundingHeight / 2);
        rotatedContext.rotate(getRadianAngle(rotation));
        rotatedContext.translate(-image.width / 2, -image.height / 2);
        rotatedContext.drawImage(image, 0, 0);

        source = rotatedCanvas;
    }

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D não suportado neste navegador.");

    context.drawImage(
        source,
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
