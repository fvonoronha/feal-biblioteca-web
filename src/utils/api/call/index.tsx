import axios, { GenericAbortSignal } from "axios";
import { APIResponseType } from "types";
import { getStorage } from "utils";

/// O Next.js nao expõe o .env para a parte que roda no cliente.
// ToDo: tratar isso pois devem haver maneiras de lidar com isso para que funcione
// sem precisar passa nada hardcoded
// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_HOST,
//     timeout: parseInt(process.env.NEXT_PUBLIC_API_CALL_TIMEOUT || "60000")
// });

// ToDo: Criar um utils para tratar constantes e .env
const API_CALL_TIMEOUT_IN_MS = parseInt(process.env.NEXT_PUBLIC_API_CALL_TIMEOUT_IN_MS || "120000");
const AUTH_USER_TOKEN_NAME = "usrtkn";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
    timeout: API_CALL_TIMEOUT_IN_MS
});

api.interceptors.request.use(
    (config) => {
        try {
            const token = getStorage(AUTH_USER_TOKEN_NAME);
            if (token && !config.headers["Authorization"]) {
                config.headers["Authorization"] = `${token}`;
            }
        } catch {
        } finally {
            return config;
        }
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        return Promise.reject(error);
    }
);

// ToDo: Talvez um dia possamos tipar corretamente esses parâmetros
type CallAPIOptions = {
    method: string;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers?: any;

    signal?: AbortSignal;
};

export const callAPI = async (opt: CallAPIOptions): Promise<APIResponseType> => {
    if (opt.signal) {
        return await api.request({
            method: opt.method,
            url: opt.url,
            data: opt.data,
            params: opt.params,
            headers: opt.headers,
            signal: opt.signal as GenericAbortSignal
        });
    } else {
        return await api.request({
            method: opt.method,
            url: opt.url,
            data: opt.data,
            params: opt.params,
            headers: opt.headers
        });
    }
};

export default api;
