import { Text, SystemStyleObject } from "@chakra-ui/react";

interface TextHighlightProps {
    text: string; // O texto original que será exibido (ex: "Ave, Cristo!")
    query: string; // O texto que o usuário digitou (ex: "ave cristo")
    styles?: SystemStyleObject; // Estilos do Chakra para o highlight
}

// Mapa para transformar letras normais em regex que aceita acentuação
const accentMap: Record<string, string> = {
    a: "[aáàãâäAÁÀÃÂÄ]",
    e: "[eéèêëEÉÈÊË]",
    i: "[iíìîïIÍÌÎÏ]",
    o: "[oóòõôöOÓÒÕÔÖ]",
    u: "[uúùûüUÚÙÛÜ]",
    c: "[cçCÇ]"
};

export default function TextHighlightProps({ text, query, styles }: TextHighlightProps) {
    if (!query.trim() || !text) {
        return <Text as="span">{text}</Text>;
    }

    // 1. Limpa a busca do usuário (tira pontuações e separa por palavras)
    // "ave cristo" vira -> ["ave", "cristo"]
    const searchWords = query
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-zA-Z0-9\s]/gi, "") // Remove pontuação
        .split(/\s+/)
        .filter(Boolean);

    if (searchWords.length === 0) return <Text as="span">{text}</Text>;

    // 2. Constrói um Regex para buscar qualquer uma das palavras, ignorando acentos
    // 'ave' vira -> '[aá...AÁ...]v[eé...EÉ...]'
    const regexParts = searchWords.map((word) =>
        word
            .split("")
            .map((char) => accentMap[char.toLowerCase()] || char)
            .join("")
    );

    // Junta as palavras. Ex: /([aá...]v[eé...]|cr[ií...]st[oó...])/gi
    const regex = new RegExp(`(${regexParts.join("|")})`, "gi");

    // 3. Divide o texto original usando o Regex
    // Os parênteses na Regex garantem que o termo encontrado não seja excluído do array
    const parts = text.split(regex);

    // Estilo padrão do highlight (fique à vontade para customizar com as cores do seu tema)
    const defaultHighlightStyles: SystemStyleObject = {
        bg: "fealRed",
        color: "white",
        px: "1",
        rounded: "md",
        fontWeight: "bold",
        ...styles
    };

    return (
        <Text as="span">
            {parts.map((part, index) => {
                // Verifica se o pedaço atual é um "match" da nossa Regex
                if (part.match(regex)) {
                    return (
                        <Text as="mark" key={index} {...defaultHighlightStyles}>
                            {part}
                        </Text>
                    );
                }
                // Se não for match (ex: a vírgula, o espaço), apenas renderiza normalmente
                return <span key={index}>{part}</span>;
            })}
        </Text>
    );
}
