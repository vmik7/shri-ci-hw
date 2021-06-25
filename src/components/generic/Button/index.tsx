import React from 'react';

import './style.scss';

export interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    text: string;
    hasIcon?: boolean;
    iconOnly?: boolean;
    svg?: React.ReactElement;
    isPrimary?: boolean;
    isSmall?: boolean;
    isDisabled?: boolean;
    classList?: Array<string>;
    onClick?: (e: React.MouseEvent) => void;
}

export default function Button({
    text = 'Click me!',
    hasIcon = false,
    iconOnly = false,
    svg,
    isPrimary = false,
    isSmall = false,
    isDisabled = false,
    classList = [],
    onClick,
    ...props
}: ButtonProps) {
    let classArray = ['button', ...classList];
    if (isPrimary) {
        classArray.push('button_primary');
    }
    if (isSmall) {
        classArray.push('button_small');
    }
    if (hasIcon) {
        classArray.push('button_has-icon');
    }
    if (iconOnly) {
        classArray.push('button_icon-only');
    }

    return (
        <button
            className={classArray.join(' ')}
            onClick={onClick}
            disabled={isDisabled}
            {...props}
        >
            {hasIcon && <span className="button__icon">{svg}</span>}
            {!iconOnly && <span className="button__text">{text}</span>}
        </button>
    );
}
