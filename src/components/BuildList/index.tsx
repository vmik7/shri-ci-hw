import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getBuilds } from '../../store/buildsSlice';

import BuildItem from '../BuildItem';
import Header from '../Header';
import Button from '../generic/Button';
import NewBuild from '../NewBuild';

import './style.scss';

import { BuildItemProps } from '../BuildItem';
import { AsyncThunkAction } from '@reduxjs/toolkit';

interface BuildData extends BuildItemProps {
    id: string;
    configurationId: string;
}

// const builds: BuildData[] = [
//     {
//         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         buildNumber: 1368,
//         commitMessage: 'add documentation for postgres scaler',
//         commitHash: '9c9f0b9',
//         branchName: 'master',
//         authorName: 'Philip Kirkorov',
//         status: 'Success',
//         start: '2021-01-18T05:00:12.000Z',
//         duration: 80,
//     },
//     {
//         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         buildNumber: 1367,
//         commitMessage:
//             'Super cool UI kit for making websites that look like games of old.',
//         commitHash: '952e5567',
//         branchName: 'super-cool-ui-kit',
//         authorName: 'Vadim Makeev',
//         status: 'Waiting',
//     },
//     {
//         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         buildNumber: 1366,
//         commitMessage: 'add documentation for postgres scaler',
//         commitHash: '9c9f0b9',
//         branchName: 'master',
//         authorName: 'Philip Kirkorov',
//         status: 'InProgress',
//         start: '2021-02-18T08:35:41.117Z',
//     },
//     {
//         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         buildNumber: 1365,
//         commitMessage: 'add documentation for postgres scaler',
//         commitHash: '9c9f0b9',
//         branchName: 'master',
//         authorName: 'Philip Kirkorov',
//         status: 'Fail',
//         start: '2021-06-18T08:35:41.117Z',
//         duration: 80,
//     },
//     {
//         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         buildNumber: 1364,
//         commitMessage: 'add documentation for postgres scaler',
//         commitHash: '9c9f0b9',
//         branchName: 'master',
//         authorName: 'Philip Kirkorov',
//         status: 'Canceled',
//         start: '2021-09-18T08:35:41.117Z',
//     },
// ];

export interface BuildListProps {
    contentClass?: Array<string>;
    loadData(): any;
}

export default function BuildList({
    contentClass = [],
    loadData,
}: BuildListProps) {
    const dispatch = useDispatch();
    const builds: BuildData[] = useSelector(getBuilds);
    useEffect(() => {
        dispatch(loadData());
    }, [loadData, dispatch]);

    // if (builds === null) {
    //     return 'loading';
    // }

    let history = useHistory();
    const [modalIsOpen, setOpenStatus] = useState(false);
    const [hash, setHash] = useState('');

    function handleItemClick(id: string) {
        history.push(`/build/${id}`);
    }

    return (
        <>
            <Header
                title="philip1967/my-awesome-repo"
                buttons={[
                    {
                        text: 'Run Build',
                        hasIcon: true,
                        /* prettier-ignore */
                        svg: <svg width="9" height="10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.289 4.193L1.414.128C.855-.202 0 .118 0 .935v8.127a.937.937 0 001.414.806l6.875-4.062a.936.936 0 000-1.613z" fill="#111" /></svg>,
                        isSmall: true,
                        onClick: () => {
                            setOpenStatus(true);
                        },
                    },
                    {
                        text: 'Settings',
                        hasIcon: true,
                        iconOnly: true,
                        /* prettier-ignore */
                        svg: <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.34 7.442l-1.03-.595a4.662 4.662 0 000-1.699l1.03-.595a.292.292 0 00.134-.338 6.026 6.026 0 00-1.324-2.29.291.291 0 00-.358-.055l-1.03.595a4.566 4.566 0 00-1.471-.849V.428a.29.29 0 00-.228-.283 6.082 6.082 0 00-2.641 0 .29.29 0 00-.228.283v1.19a4.71 4.71 0 00-1.47.85l-1.03-.595a.287.287 0 00-.357.055A5.99 5.99 0 00.013 4.217a.29.29 0 00.134.339l1.03.595a4.66 4.66 0 000 1.698l-1.03.595a.292.292 0 00-.134.34c.269.86.726 1.64 1.324 2.288.092.099.242.123.358.055l1.03-.595c.434.373.932.66 1.472.85v1.19a.29.29 0 00.227.283 6.082 6.082 0 002.642 0 .29.29 0 00.227-.283v-1.19a4.71 4.71 0 001.471-.85l1.03.595a.287.287 0 00.359-.055 5.989 5.989 0 001.323-2.289.299.299 0 00-.135-.341zm-5.598.491a1.938 1.938 0 01-1.935-1.935c0-1.067.869-1.936 1.935-1.936 1.067 0 1.936.869 1.936 1.936a1.938 1.938 0 01-1.936 1.935z" fill="#111"/></svg>,
                        isSmall: true,
                        onClick: () => {
                            history.push('/settings');
                        },
                    },
                ]}
            />
            <div className={['build-list', ...contentClass].join(' ')}>
                <div className="container build-list__container">
                    {builds &&
                        builds.map((build) => (
                            <BuildItem
                                {...build}
                                key={build.buildNumber}
                                classList={['build-list__item']}
                                onClick={handleItemClick.bind(null, build.id)}
                            />
                        ))}
                    <Button text="Show more" />
                </div>
                {modalIsOpen && (
                    <NewBuild
                        onWrapperClick={() => setOpenStatus(false)}
                        onCancel={() => setOpenStatus(false)}
                        onSave={() => setOpenStatus(false)}
                        onInputChange={(value: string) => setHash(value)}
                        inputValue={hash}
                    />
                )}
            </div>
        </>
    );
}
