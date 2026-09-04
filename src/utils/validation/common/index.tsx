export function isUsernameValid(username: string): boolean {
    const usernameRegex = /^[a-z._]+$/;
    return usernameRegex.test(username);
}

export function isSlugValid(slug: string): boolean {
    const slugRegex = /^[a-z-]+$/;
    return slugRegex.test(slug);
}

export function isCPFValid(cpf: string): boolean {
    if (cpf.length !== 11) return false;

    // Elimina CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += Number(cpf[i]) * (10 - i);
    }

    let remainder = (sum * 10) % 11;

    if (remainder === 10) remainder = 0;

    if (remainder !== Number(cpf[9])) return false;

    sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += Number(cpf[i]) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10) remainder = 0;

    return remainder === Number(cpf[10]);
}

export function isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
