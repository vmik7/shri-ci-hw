import { Dispatch } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';

export type History = ReturnType<typeof useHistory>;
export interface IComponentProps {
    extraClasses?: string;
}

export interface IPageProps {
    contentClass?: string;
    loadData: (dispatch: Dispatch<any>, params?: any) => void;
}
