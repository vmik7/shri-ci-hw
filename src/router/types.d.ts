import { FC } from 'react';
import { IPageProps } from '../common';

export interface IRoute extends IPageProps {
    path: string;
    component: FC<any>;
}
