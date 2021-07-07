import { FC } from 'react';
import { classnames } from '@bem-react/classnames';

import { cn } from '../../common';
import { IButtonProps } from './types';

import './style.scss';

export const Button: FC<IButtonProps> = (props) => {
    const {
        text,
        svg,
        hasIcon = false,
        iconOnly = false,
        isPrimary = false,
        isSmall = false,
        extraClasses = '',
        onClick,
        ...buttonProps
    } = props;

    const cnButton = cn('button');

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
            {hasIcon && <span className={cnButton('icon')}>{svg}</span>}
            {!iconOnly && <span className={cnButton('text')}>{text}</span>}
        </button>
    );
};
