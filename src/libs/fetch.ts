interface ErrorResponse {
    code: number;
    subcode: number;
    error: string;
    message: string;
    stack?: string;
}

interface SuccessResponse<T> {
    code: 200,
    data: T;
}

export class FetchError extends Error {
    readonly code: number;
    readonly subcode: number;

    constructor(error: ErrorResponse) {
        super(`${error.code} ${error.message}`);

        this.stack = error.stack;
        this.name = 'FetchError';
        this.code = error.code;
        this.subcode = error.subcode;
    }
}

const originFetch = window.fetch;

const fetch: typeof originFetch = async (input, init = {}) => {
    const mergedInit: RequestInit = { ...init };

    if ('headers' in mergedInit && !(mergedInit.headers instanceof Headers)) {
        mergedInit.headers = new Headers(mergedInit.headers);
    }

    if ('body' in mergedInit) {
        if (!('headers' in mergedInit)) {
            mergedInit.headers = new Headers();
        } else if (!(mergedInit.headers instanceof Headers)) {
            mergedInit.headers = new Headers(mergedInit.headers);
        }

        if (!mergedInit.headers.has('Content-Type')) {
            if (mergedInit.body instanceof FormData) {
                mergedInit.headers.set('Content-Type', 'multipart/form-data');
            } else {
                mergedInit.headers.set('Content-Type', 'application/json');

                if (typeof mergedInit.body === 'object') {
                    mergedInit.body = JSON.stringify(mergedInit.body);
                }
            }
        }
    }

    return originFetch(input, mergedInit);
};

export default fetch;

export const serializeResponse = async <T>(response: Response | Promise<Response>): Promise<T> => {
    if ('then' in response) {
        response = await response;
    }

    const data: SuccessResponse<T> | ErrorResponse = await response.json();

    if (data.code >= 400) {
        throw new FetchError(data as ErrorResponse);
    }

    return (data as SuccessResponse<T>).data;
};

export const swrFetcher = <T>(url: string): Promise<T> => serializeResponse(fetch(url));

export const mockFetcher = <T>(data: T) => {
    return async () => {
        return data;
    };
};
