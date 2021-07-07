import React from 'react';
import { IComponentProps } from '../../common';

export interface ITextFieldProps
    extends IComponentProps,
        React.DetailedHTMLProps<
            React.InputHTMLAttributes<HTMLInputElement>,
            HTMLInputElement
        > {
    isLabeled?: boolean;
    labelText?: string;
    isInline?: boolean;
    onChange(value: string): void;
}
