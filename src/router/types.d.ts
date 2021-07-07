import { FC } from 'react';

export interface IRoute {
    path: string;
    component: FC<any>;
    contentClass?: string;
    loadData: (params: any) => void;
}
