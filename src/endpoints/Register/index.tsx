import { callAPI } from "utils";

export const registerUser = async ({
    name,
    login,
    password,
    email,
    phone
}: {
    name: string;
    login: string;
    password: string;
    email: string;
    phone: string;
}) => {
    const response = await callAPI({
        method: "POST",
        url: `/account`,
        data: { login, password, phone, name, email }
    });
    return response;
};

export const validateRegisterEmail = async (email: string) => {
    const response = await callAPI({
        method: "POST",
        url: `/account/validate/email`,
        data: { email }
    });

    return response?.header?.http === 200;
};

export const validateRegisterUserName = async (login: string) => {
    const response = await callAPI({
        method: "POST",
        url: `/account/validate/login`,
        data: { login }
    });

    return response?.header?.http === 200;
};
