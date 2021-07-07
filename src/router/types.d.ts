import { FC } from 'react';
import { IPageProps } from '../common/types';

export interface IRoute extends IPageProps {
    path: string;
    component: FC<any>;
}
