import React from 'react';

import './style.scss';

import iconSuccess from './icons/success.svg';
import iconPending from './icons/pending.svg';
import iconFail from './icons/fail.svg';

export type BuildStatus =
    | 'Success'
    | 'Waiting'
    | 'InProgress'
    | 'Fail'
    | 'Canceled';
export interface BuildItemProps {
    buildNumber: number;
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
    status: BuildStatus;
    start?: string;
    duration?: number;
    classList?: Array<string>;
    isDetailed?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

export default function BuildItem({
    buildNumber,
    commitMessage,
    commitHash,
    branchName,
    authorName,
    status,
    start,
    duration,
    classList = [],
    isDetailed = false,
    onClick = () => {},
}: BuildItemProps) {
    const monthNames = [
        'янв',
        'фев',
        'мар',
        'апр',
        'мая',
        'июня',
        'июля',
        'авг',
        'сент',
        'окт',
        'нояб',
        'дек',
    ];

    function getTimeString(start: string) {
        const startDate = new Date(start);

        let hours: string = startDate.getHours().toString();
        if (+hours < 10) {
            hours = '0' + hours;
        }

        let minutes: string = startDate.getMinutes().toString();
        if (+minutes < 10) {
            minutes = '0' + minutes;
        }

        return `${startDate.getDate()} ${
            monthNames[startDate.getMonth()]
        }, ${hours}:${minutes}`;
    }

    function getDurationString(duration: number) {
        let durationHours = Math.floor(duration / 60);
        let durationMinutes = duration % 60;

        return `${
            durationHours ? durationHours + ' ч ' : ''
        }${durationMinutes} мин`;
    }

    let statusMod = 'build-item_status_';
    let icon;
    switch (status) {
        case 'Success':
            statusMod += 'success';
            icon = iconSuccess;
            break;
        case 'Waiting':
        case 'InProgress':
            statusMod += 'pending';
            icon = iconPending;
            break;
        case 'Fail':
        case 'Canceled':
            statusMod += 'fail';
            icon = iconFail;
            break;
        default:
            break;
    }

    let classArray = ['build-item', statusMod];
    if (isDetailed) {
        classArray.push('build-item_deatiled');
    }

    return (
        <article
            className={[...classArray, ...classList].join(' ')}
            onClick={onClick}
        >
            <div className="build-item__icon">
                <img src={icon} alt="status"></img>
            </div>
            <div className="build-item__main">
                <header className="build-item__header">
                    <div className="build-item__number">{buildNumber}</div>
                    <div className="build-item__message">{commitMessage}</div>
                </header>
                <div className="build-item__details">
                    <div className="build-item__commit">
                        <div className="build-item__branch">{branchName}</div>
                        <div className="build-item__hash">{commitHash}</div>
                    </div>
                    <div className="build-item__author">{authorName}</div>
                </div>
            </div>
            <footer className="build-item__footer">
                {start && (
                    <div className="build-item__time">
                        {getTimeString(start)}
                    </div>
                )}
                {duration && (
                    <div className="build-item__duration">
                        {getDurationString(duration)}
                    </div>
                )}
            </footer>
        </article>
    );
}
