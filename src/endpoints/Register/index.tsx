import { callAPI } from "utils";

type RegisterUserPayload = {
    name: string;
    login: string;
    password: string;
    email: string;
    phone: string;
};

export const registerUser = async (payload: RegisterUserPayload) => {
    const { name, login, password, email, phone } = payload;

    return callAPI({
        method: "POST",
        url: `/account`,
        data: { login, password, phone, name, email }
    });
};

export const validateRegisterEmail = async (email: string): Promise<boolean> => {
    const response = await callAPI({
        method: "POST",
        url: `/account/validate/email`,
        data: { email }
    });

    return response?.header?.http === 200;
};

export const validateRegisterUserName = async (login: string): Promise<boolean> => {
    const response = await callAPI({
        method: "POST",
        url: `/account/validate/login`,
        data: { login }
    });

    return response?.header?.http === 200;
};
