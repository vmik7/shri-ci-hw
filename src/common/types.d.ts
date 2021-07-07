import { Dispatch } from '@reduxjs/toolkit';

export interface IComponentProps {
    extraClasses?: string;
}

export interface IPageProps {
    contentClass?: string;
    loadData: (dispatch: Dispatch<any>, params?: any) => void;
}
