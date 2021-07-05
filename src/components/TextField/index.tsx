import React from 'react';

import './style.scss';

export interface TextFieldProps {
    placeholder?: string;
    value?: string;
    isLabeled?: boolean;
    labelText?: string;
    isRequired?: boolean;
    isInline?: boolean;
    name?: string;
    classList?: Array<string>;
    onChange(value: string): void;
}

export default function TextField({
    placeholder = '',
    value = '',
    isLabeled = false,
    labelText = '',
    isRequired = false,
    isInline = false,
    name = '',
    classList = [],
    onChange,
}: TextFieldProps) {
    const WrapperTag = isInline ? 'span' : 'div';

    let inputOptions: any = {};

    if (name) {
        inputOptions.name = name;
    }
    if (placeholder) {
        inputOptions.placeholder = placeholder;
    }
    if (isRequired) {
        inputOptions.required = true;
    }

    let allClasses = ['text-field', ...classList];
    if (isInline) {
        allClasses.push('text-field_inline');
    }
    if (isRequired) {
        allClasses.push('text-field_required');
    }

    const input = (
        <>
            <input
                className="text-field__input"
                {...inputOptions}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {!isInline && value && (
                <button
                    className="text-field__clear"
                    onClick={() => onChange('')}
                >
                    {/* prettier-ignore */}
                    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm4-10.88L10.88 4 8 6.88 5.12 4 4 5.12 6.88 8 4 10.88 5.12 12 8 9.12 10.88 12 12 10.88 9.12 8 12 5.12z" fill="#CCC" /></svg>
                </button>
            )}
        </>
    );

    return isLabeled ? (
        <WrapperTag className={allClasses.join(' ')}>
            <label className="text-field__label-wrap">
                <span className="text-field__label">{labelText}</span>
                {input}
            </label>
        </WrapperTag>
    ) : (
        <WrapperTag className={allClasses.join(' ')}>{input}</WrapperTag>
    );
}
