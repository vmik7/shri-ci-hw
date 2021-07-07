import { IComponentProps } from '../../common';

export interface IButtonProps
    extends IComponentProps,
        React.DetailedHTMLProps<
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
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
