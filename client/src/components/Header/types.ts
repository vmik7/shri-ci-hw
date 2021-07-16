import { IComponentProps } from '../../common/types';
import { IButtonProps } from '../Button/types';

export interface IHeaderProps extends IComponentProps {
    title: string;
    isFaded?: boolean;
    buttons?: Array<IButtonProps>;
}
