import { FC } from 'react';
import { cn } from '../../common';
import { classnames } from '@bem-react/classnames';

import { ITextFieldProps } from './types';

import './style.scss';

export const TextField: FC<ITextFieldProps> = (props) => {
    const {
        isLabeled = false,
        labelText = '',
        isInline = false,
        extraClasses = '',
        onChange,
        ...inputAttributes
    } = props;

    const cnTextField = cn('text-field');
    const WrapperTag = isInline ? 'span' : 'div';

    const input = (
        <>
            <input
                className={cnTextField('input')}
                {...inputAttributes}
                onChange={(e) => onChange(e.target.value)}
            />
            {!isInline && inputAttributes.value && (
                <button
                    className={cnTextField('clear')}
                    onClick={() => onChange('')}
                >
                    {/* prettier-ignore */}
                    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm4-10.88L10.88 4 8 6.88 5.12 4 4 5.12 6.88 8 4 10.88 5.12 12 8 9.12 10.88 12 12 10.88 9.12 8 12 5.12z" fill="#CCC" /></svg>
                </button>
            )}
        </>
    );

    const inputLabeled = (
        <label className={cnTextField('label-wrap')}>
            <span className={cnTextField('label')}>{labelText}</span>
            {input}
        </label>
    );

    return (
        <WrapperTag
            className={classnames(
                cnTextField({
                    inline: isInline,
                    required: inputAttributes.required,
                }),
                extraClasses,
            )}
        >
            {isLabeled ? inputLabeled : input}
        </WrapperTag>
    );
};
