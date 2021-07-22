import React from 'react';
import { IComponentProps } from '../../common/types';

export interface ITextFieldProps
    extends IComponentProps,
        React.InputHTMLAttributes<HTMLInputElement> {
    isLabeled?: boolean;
    labelText?: string;
    isInline?: boolean;
    onChangeHandler(value: string): void;
}
