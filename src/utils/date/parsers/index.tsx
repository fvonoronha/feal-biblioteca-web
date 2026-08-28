import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const getUserTimeZone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const getTimeZoneAbbreviation = (date: Date, timeZone: string): string => {
    try {
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            timeZoneName: "short"
        });
        const parts = formatter.formatToParts(date);
        const tz = parts.find((part) => part.type === "timeZoneName");
        return tz ? tz.value : "";
    } catch {
        return "utc";
    }
};

// ToDo: Organizar melhor essas funçoes. a maioria fz a mesma coisa. Muita coisa duplicada assim pode complicar a nossa vida no futuro.
export const formatDateTimeFullText = (date: Date): string => {
    try {
        if (!date) return "--";

        const dt = new Date(date);
        const abbreviation = getTimeZoneAbbreviation(dt, getUserTimeZone());

        const formattedDate = formatInTimeZone(dt, getUserTimeZone(), "dd 'de' MMMM 'de' yyyy 'às' HH'h'mm'm", {
            locale: ptBR
        });

        return `${formattedDate} (${abbreviation})`;
    } catch {
        return "--";
    }
};

export const parseDateFullText = (date: Date): string => {
    try {
        if (!date) return "--";

        const dt = new Date(date);
        // const abbreviation = getTimeZoneAbbreviation(dt, getUserTimeZone());

        const formattedDate = formatInTimeZone(dt, getUserTimeZone(), "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR
        });

        return `${formattedDate}`;
    } catch {
        return "--";
    }
};

export const getDatesDistance = (date1: Date, date2: Date): number => {
    try {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        // Subtrai as datas e obtém a diferença em milissegundos
        const diferencaMs = Math.abs(d2.getTime() - d1.getTime());

        // Converte milissegundos para dias
        const umDiaEmMs = 1000 * 60 * 60 * 24;

        return Math.floor(diferencaMs / umDiaEmMs);
    } catch {
        return 0;
    }
};

export const parseDateDMY = (date: Date): string => {
    try {
        if (!date) return "--";

        const dt = new Date(date);
        const formattedDate = formatInTimeZone(dt, getUserTimeZone(), "dd-MM-yyyy", {
            locale: ptBR
        });

        return formattedDate;
    } catch {
        return "--";
    }
};

export const parseDateYMD = (date: Date): string => {
    try {
        if (!date) return "--";

        const dt = new Date(date);
        const formattedDate = formatInTimeZone(dt, getUserTimeZone(), "yyyy-MM-dd", {
            locale: ptBR
        });

        return formattedDate;
    } catch {
        return "--";
    }
};

export const parseDateDistance = (date: Date | string, locale: string): string => {
    const targetDate = new Date(date);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime(); // em ms
    const absDiff = Math.abs(diff);

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 1000 * 60 * 60 * 24 * 365],
        ["month", 1000 * 60 * 60 * 24 * 30],
        ["week", 1000 * 60 * 60 * 24 * 7],
        ["day", 1000 * 60 * 60 * 24],
        ["hour", 1000 * 60 * 60],
        ["minute", 1000 * 60],
        ["second", 1000]
    ];

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    for (const [unit, ms] of units) {
        if (absDiff >= ms || unit === "second") {
            const value = Math.round(diff / ms); // negativo: passado | positivo: futuro
            return rtf.format(value, unit);
        }
    }

    return "agora mesmo";
};
