export const isAbortError = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false;
    return error.name === "CanceledError" || error.name === "AbortError";
};
