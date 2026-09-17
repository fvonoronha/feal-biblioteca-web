import axios, { GenericAbortSignal } from "axios";
import { APIResponseType } from "types";
import { getStorage, USER_JWT_TOKEN_NAME } from "utils";

const API_CALL_TIMEOUT_IN_MS = parseInt(process.env.NEXT_PUBLIC_API_CALL_TIMEOUT_IN_MS || "120000");

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
    timeout: API_CALL_TIMEOUT_IN_MS
});

api.interceptors.request.use(
    (config) => {
        try {
            const token = getStorage(USER_JWT_TOKEN_NAME);
            if (token && !config.headers["Authorization"]) {
                config.headers["Authorization"] = `${token}`;
            }
        } catch {
            // Storage access can fail outside the browser (e.g. during SSR); the request proceeds unauthenticated.
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

type CallAPIOptions = {
    method: string;
    url: string;
    data?: unknown;
    params?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
};

export const callAPI = async <TBody = unknown,>(opt: CallAPIOptions): Promise<APIResponseType<TBody>> => {
    return api.request({
        method: opt.method,
        url: opt.url,
        data: opt.data,
        params: opt.params,
        headers: opt.headers,
        signal: opt.signal as GenericAbortSignal | undefined
    });
};

export default api;
