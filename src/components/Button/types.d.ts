export interface IButtonProps
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
    extraClasses?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}