import { FC } from 'react';
import { classnames } from '@bem-react/classnames';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { cn } from '../../common';
import { IBuildItemProps } from './types';

import './style.scss';
import iconSuccess from './icons/success.svg';
import iconPending from './icons/pending.svg';
import iconFail from './icons/fail.svg';

export const BuildItem: FC<IBuildItemProps> = (props) => {
    const {
        buildNumber,
        commitMessage,
        commitHash,
        branchName,
        authorName,
        status,
        start,
        duration,
        extraClasses = '',
        isDetailed = false,
        onClick = () => {},
    } = props;

    const getTimeString = (start: string) => {
        return format(new Date(start), 'd MMMM, HH:mm', { locale: ru });
    };

    function getDurationString(duration: number) {
        let durationHours = Math.floor(duration / 60);
        let durationMinutes = duration % 60;

        return `${
            durationHours ? durationHours + ' ч ' : ''
        }${durationMinutes} мин`;
    }

    const cnBuildItem = cn('build-item');

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
            className={classnames(
                cnBuildItem({
                    status: statusMod,
                    deatiled: isDetailed,
                }),
                extraClasses,
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
                        <div className={cnBuildItem('hash')}>{commitHash}</div>
                    </div>
                    <div className={cnBuildItem('author')}>{authorName}</div>
                </div>
            </div>
            <footer className={cnBuildItem('footer')}>
                {start && (
                    <div className={cnBuildItem('time')}>
                        {getTimeString(start)}
                    </div>
                )}
                {duration && (
                    <div className={cnBuildItem('duration')}>
                        {getDurationString(duration)}
                    </div>
                )}
            </footer>
        </article>
    );
};
