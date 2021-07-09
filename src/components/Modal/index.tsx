import { memo, useCallback, useMemo, useRef } from 'react';
import { cn } from '../../common/';
import { classnames } from '@bem-react/classnames';

import { IModalProps } from './types';

import './style.scss';

export const Modal = memo<IModalProps>((props) => {
    const { title, subtitle, content, extraClasses, onWrapperClick } = props;

    const cnModal = cn('modal');
    const wrapperEl = useRef(null);

    const wrapperClicHandler = useCallback(
        (event) => {
            if (event.target === wrapperEl.current) {
                onWrapperClick(event);
            }
        },
        [wrapperEl],
    );

    const titleMemo = useMemo(
        () => (title ? <p className={cnModal('title')}>{title}</p> : null),
        [title, cnModal],
    );
    const subtitleMemo = useMemo(
        () =>
            subtitle ? (
                <p className={cnModal('subtitle')}>{subtitle} </p>
            ) : null,
        [subtitle, cnModal],
    );

    return (
        <div className={classnames(cnModal(), extraClasses)}>
            <div
                ref={wrapperEl}
                className={cnModal('wrapper')}
                onClick={wrapperClicHandler}
            >
                <div className={cnModal('window')}>
                    {titleMemo}
                    {subtitleMemo}
                    {content}
                </div>
            </div>
        </div>
    );
});
