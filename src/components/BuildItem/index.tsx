import { FC, useMemo } from 'react';
import { classnames } from '@bem-react/classnames';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { cn } from '../../common/';
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
        extraClasses,
        isDetailed,
        onClick,
    } = props;

    const cnBuildItem = cn('build-item');

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
                    {(() => {
                        const durationHours = Math.floor(duration / 60);
                        const durationMinutes = duration % 60;
                        return `${
                            durationHours ? durationHours + ' ч ' : ''
                        }${durationMinutes} мин`;
                    })()}
                </div>
            ) : null,
        [duration, cnBuildItem, format, ru],
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
                {startMemo}
                {durationMemo}
            </footer>
        </article>
    );
};
