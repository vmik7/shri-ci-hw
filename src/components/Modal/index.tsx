import { FC, useRef } from 'react';
import { cn } from '../../common';
import { classnames } from '@bem-react/classnames';

import { IModalProps } from './types';

import './style.scss';

export const Modal: FC<IModalProps> = (props) => {
    const {
        title,
        subtitle,
        content = null,
        extraClasses = '',
        onWrapperClick,
    } = props;

    const cnModal = cn('modal');
    const wrapperEl = useRef(null);

    return (
        <div className={classnames(cnModal(), extraClasses)}>
            <div
                ref={wrapperEl}
                className={cnModal('wrapper')}
                onClick={(e) => {
                    if (e.target === wrapperEl.current) {
                        onWrapperClick();
                    }
                }}
            >
                <div className={cnModal('window')}>
                    {title && <p className={cnModal('title')}>{title}</p>}
                    {subtitle && (
                        <p className={cnModal('subtitle')}>{subtitle} </p>
                    )}
                    {content}
                </div>
            </div>
        </div>
    );
};
