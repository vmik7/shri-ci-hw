import { config } from '../config';

import * as types from './types';
export * from './types';

/** Получить список билдов */
export const getBuildList = (params: types.BuildListParams) =>
    config.axiosInstance
        .get('/build/list', { params })
        .then((response) => response.data.data as types.Build[]);

/** Получить детальную информацию о билде */
export const getBuildDetails = (params: types.BuildDetailsParams) =>
    config.axiosInstance
        .get('/build/details', { params })
        .then((response) => response.data.data as types.Build);

/** Получить логи билда */
export const getBuildLog = (params: types.BuildLogParams) =>
    config.axiosInstance
        .get('/build/log', { params })
        .then((response) => response.data as types.BuildLog);

/** Добавить новый билд */
export const requestBuild = (data: types.BuildRequestData) =>
    config.axiosInstance
        .post('/build/request', data, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.data.data as types.BuildRequestResult);

/** Запустить билд */
export const startBuild = (data: types.BuildStartData) =>
    config.axiosInstance.post('/build/start', data, {
        headers: { 'Content-Type': 'application/json' },
    });

/** Завершить билд */
export const finishBuild = (data: types.BuildFinishData) =>
    config.axiosInstance.post('/build/finish', data, {
        headers: { 'Content-Type': 'application/json' },
    });

/** Отменить билд */
export const cancelBuild = (data: types.BuildFinishData) =>
    config.axiosInstance.post('/build/cancel', data, {
        headers: { 'Content-Type': 'application/json' },
    });

/** Получить настройки */
export const getConfiguration = () =>
    config.axiosInstance
        .get('/conf')
        .then((response) => response.data.data as types.Configuration);

/** Изменить настройки */
export const postConfiguration = (data: types.ConfigurationPostData) =>
    config.axiosInstance.post('/conf', data, {
        headers: { 'Content-Type': 'application/json' },
    });

/** Удалить настройки */
export const deleteConfiguration = () => config.axiosInstance.delete('/conf');
