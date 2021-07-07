import { FC, useMemo } from 'react';
import { classnames } from '@bem-react/classnames';

import { cn } from '../../common/';
import { IButtonProps } from './types';

import './style.scss';

export const Button: FC<IButtonProps> = (props) => {
    const {
        text,
        svg,
        hasIcon,
        iconOnly,
        isPrimary,
        isSmall,
        extraClasses,
        onClick,
        ...buttonProps
    } = props;

    const cnButton = cn('button');

    const iconMemo = useMemo(
        () =>
            hasIcon ? <span className={cnButton('icon')}>{svg}</span> : null,
        [hasIcon, svg, cnButton],
    );
    const textMemo = useMemo(
        () =>
            !iconOnly ? <span className={cnButton('text')}>{text}</span> : null,
        [iconOnly, text, cnButton],
    );

    return (
        <button
            className={classnames(
                cnButton({
                    primary: isPrimary,
                    small: isSmall,
                    'has-icon': hasIcon,
                    'icon-only': iconOnly,
                }),
                extraClasses,
            )}
            onClick={onClick}
            {...buttonProps}
        >
            {iconMemo}
            {textMemo}
        </button>
    );
};
