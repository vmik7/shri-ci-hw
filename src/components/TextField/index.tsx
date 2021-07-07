import { FC, useCallback, useMemo } from 'react';
import { cn } from '../../common/';
import { classnames } from '@bem-react/classnames';

import { ITextFieldProps } from './types';

import './style.scss';

export const TextField: FC<ITextFieldProps> = (props) => {
    const {
        isLabeled,
        labelText,
        isInline,
        extraClasses,
        onChange,
        ...inputAttributes
    } = props;

    const cnTextField = cn('text-field');
    const WrapperTag = isInline ? 'span' : 'div';

    const onChangeHandler = useCallback(
        (e) => onChange(e.target.value),
        [onChange],
    );
    const onClearHandler = useCallback(() => onChange(''), [onChange]);

    const clearButtonMemo = useMemo(
        () =>
            !isInline && inputAttributes.value ? (
                <button
                    className={cnTextField('clear')}
                    onClick={onClearHandler}
                >
                    {/* prettier-ignore */}
                    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm4-10.88L10.88 4 8 6.88 5.12 4 4 5.12 6.88 8 4 10.88 5.12 12 8 9.12 10.88 12 12 10.88 9.12 8 12 5.12z" fill="#CCC" /></svg>
                </button>
            ) : null,
        [isInline, inputAttributes.value, cnTextField, onClearHandler],
    );

    const input = (
        <>
            <input
                className={cnTextField('input')}
                {...inputAttributes}
                onChange={onChangeHandler}
            />
            {clearButtonMemo}
        </>
    );

    const inputLabeled = (
        <label className={cnTextField('label-wrap')}>
            <span className={cnTextField('label')}>{labelText}</span>
            {input}
        </label>
    );

    const inputMemo = useMemo(
        () => (isLabeled ? inputLabeled : input),
        [isLabeled, inputLabeled, input],
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
            {inputMemo}
        </WrapperTag>
    );
};
