import { IComponentProps } from '../../common';
import { IBuildItemProps } from '../../components/BuildItem/types';

export interface IBuildDetailsProps extends IComponentProps {
    contentClass?: string;
    loadData(id: string): any;
}
