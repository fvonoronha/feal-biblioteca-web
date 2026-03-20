import axios, { GenericAbortSignal } from "axios";
import { APIResponseType } from "types";
import { getStorage } from "utils";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    timeout: parseInt(process.env.NEXT_PUBLIC_API_CALL_TIMEOUT || "60000")
});

api.interceptors.request.use(
    (config) => {
        try {
            const token = getStorage("usrtkn");
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
