import { useMemo, memo } from 'react';
import { format, intervalToDuration, formatDuration } from 'date-fns';
import { ru } from 'date-fns/locale';

import { cn } from '../../common/';
const cnBuildItem = cn('build-item');

import { IBuildItemProps } from './types';

import './style.scss';
import iconSuccess from './icons/success.svg';
import iconPending from './icons/pending.svg';
import iconFail from './icons/fail.svg';

function getDurationString(value: number) {
    const duration = intervalToDuration({
        start: 0,
        end: value,
    });
    let result = '';
    if (duration.hours) {
        result = `${duration.hours} ч ${duration.minutes} мин`;
    } else if (duration.minutes) {
        result = `${duration.minutes} мин ${duration.seconds} с`;
    } else {
        result = formatDuration(duration, {
            format: ['seconds'],
            locale: ru,
        });
    }
    return result;
}

export const BuildItem = memo<IBuildItemProps>((props) => {
    const { data, extraClasses, isDetailed, onClick } = props;
    const {
        buildNumber,
        commitMessage,
        commitHash,
        branchName,
        authorName,
        status,
        start,
        duration,
    } = data;

    const startMemo = useMemo(
        () =>
            start ? (
                <div className={cnBuildItem('time')}>
                    {format(new Date(start), 'd MMMM, HH:mm', { locale: ru })}
                </div>
            ) : null,
        [start, cnBuildItem, format, ru],
    );

    const durationMemo = useMemo(
        () =>
            duration ? (
                <div className={cnBuildItem('duration')}>
                    {getDurationString(duration)}
                </div>
            ) : null,
        [duration, cnBuildItem, getDurationString],
    );

    let statusMod, icon;
    switch (status) {
        case 'Success':
            statusMod = 'success';
            icon = iconSuccess;
            break;
        case 'Waiting':
        case 'InProgress':
            statusMod = 'pending';
            icon = iconPending;
            break;
        case 'Fail':
        case 'Canceled':
            statusMod = 'fail';
            icon = iconFail;
            break;
        default:
            break;
    }

    return (
        <article
            className={cnBuildItem(
                {
                    status: statusMod,
                    deatiled: isDetailed,
                    clickable: Boolean(onClick),
                },
                [extraClasses],
            )}
            onClick={onClick}
        >
            <div className={cnBuildItem('icon')}>
                <img src={icon} alt="status"></img>
            </div>
            <div className={cnBuildItem('main')}>
                <header className={cnBuildItem('header')}>
                    <div className={cnBuildItem('number')}>{buildNumber}</div>
                    <div className={cnBuildItem('message')}>
                        {commitMessage}
                    </div>
                </header>
                <div className={cnBuildItem('details')}>
                    <div className={cnBuildItem('commit')}>
                        <div className={cnBuildItem('branch')}>
                            {branchName}
                        </div>
                        <div className={cnBuildItem('hash')}>
                            {commitHash.slice(0, 7)}
                        </div>
                    </div>
                    <div className={cnBuildItem('author')}>{authorName}</div>
                </div>
            </div>
            <footer className={cnBuildItem('footer')}>
                {startMemo}
                {durationMemo}
            </footer>
        </article>
    );
});
