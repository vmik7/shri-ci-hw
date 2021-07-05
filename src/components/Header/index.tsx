import React from 'react';

import './style.scss';

import Button from '../Button';

import { ButtonProps } from '../Button';

export interface HeaderProps {
    title: string;
    isFaded?: boolean;
    buttons?: Array<ButtonProps>;
}

export default function Header({
    title,
    isFaded = false,
    buttons = [],
}: HeaderProps) {
    let classArray = ['header'];
    if (isFaded) {
        classArray.push('header_faded');
    }

    return (
        <header className={classArray.join(' ')}>
            <div className="container header__container">
                <h1 className="header__title">{title}</h1>
                {buttons.map((buttonProps, index) => (
                    <Button
                        {...buttonProps}
                        key={index}
                        classList={['header__control']}
                    />
                ))}
            </div>
        </header>
    );
}
