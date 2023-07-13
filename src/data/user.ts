import useSWR, { type SWRConfiguration, useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { FetchError, serializeResponse } from '@/libs/fetch';

export interface AdminUser {
    id: number;
    nickname: string;
    phoneNumber: string;
}

export const GET_CURRENT_USER = '/api/user';

const getMockUser = () => {
    return {
        id: 1,
        nickname: 'user',
        phoneNumber: '12345678901',
    };
};

const mockLogin = (_data: LoginData) => {
    return {
        id: 1,
        nickname: 'user',
        phoneNumber: '12345678901',
        password: 'mock-password',
    };
};

export type UserInfo = Omit<AdminUser, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export const getUser = async () => {
    return serializeResponse<UserInfo>(fetch(GET_CURRENT_USER));
};

export const useUser = (options?: SWRConfiguration<UserInfo, FetchError>) => {
    return useSWR<UserInfo, FetchError>(GET_CURRENT_USER, getMockUser, options);
};

export interface LoginData {
    phoneNumber: string;
    password: string;
}

type LoginResult = Pick<UserInfo, 'id'>

export const USER_LOGIN = '/api/user/login';

const login = async (data: LoginData): Promise<LoginResult> => {
    return serializeResponse(fetch(USER_LOGIN, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    }));
};

export const useLogin = () => {
    const swr = useSWRMutation<
        LoginResult,
        FetchError,
        string,
        LoginData
    >(USER_LOGIN, (_, { arg }) => mockLogin(arg));

    const { cache } = useSWRConfig();

    const trigger = async (...args: Parameters<typeof swr.trigger>) => {
        await swr.trigger(...args);
        cache.delete(GET_CURRENT_USER);
    };

    return {
        ...swr,
        trigger,
    };
};
