import { IComponentProps } from '../../common/types';
import { Build } from '../../api/types';
export interface IBuildItemProps extends IComponentProps {
    data: Build;
    isDetailed?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}
