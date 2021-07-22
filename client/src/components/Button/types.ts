import { IComponentProps } from '../../common/types';

export interface IButtonProps
    extends IComponentProps,
        React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    hasIcon?: boolean;
    iconOnly?: boolean;
    svg?: React.ReactElement;
    isPrimary?: boolean;
    isSmall?: boolean;
    isDisabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
