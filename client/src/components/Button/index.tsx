import { memo, useMemo } from 'react';

import { cn } from '../../common/';
const cnButton = cn('button');

import { IButtonProps } from './types';

import './style.scss';

export const Button = memo<IButtonProps>((props) => {
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
            className={cnButton(
                {
                    primary: isPrimary,
                    small: isSmall,
                    'has-icon': hasIcon,
                    'icon-only': iconOnly,
                },
                [extraClasses],
            )}
            onClick={onClick}
            {...buttonProps}
        >
            {iconMemo}
            {textMemo}
        </button>
    );
});
