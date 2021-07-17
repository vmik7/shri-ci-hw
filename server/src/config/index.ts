import * as dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';

dotenv.config();

export type Settings = {
    port: number;
    testModeQuery: string;
    repoFolderName: string;
    axiosInstance: AxiosInstance;
    repoName: string;
};

export const config: Settings = {
    port: 8085,
    testModeQuery: 'test_mode',
    repoFolderName: 'myrepo',
    axiosInstance: axios.create({
        baseURL: 'https://shri.yandex/hw/api',
        headers: {
            Authorization: process.env.KEY,
        },
    }),
    repoName: '',
};
