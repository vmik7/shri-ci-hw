import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

export const PORT = 8085;
export const testModeQuery = 'test_mode';
export const repoFolderName = 'myrepo';
export const axiosInstance = axios.create({
    baseURL: 'https://shri.yandex/hw/api',
    headers: {
        Authorization: process.env.KEY,
    },
});
export const minimalUpdateInterval = 1;
