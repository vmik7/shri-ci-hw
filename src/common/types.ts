import { useHistory } from 'react-router-dom';
import { AppDispatch as Dispatch } from '../store/types';

export type History = ReturnType<typeof useHistory>;
export interface IComponentProps {
    extraClasses?: string;
}

export interface IPageProps {
    contentClass?: string;
    loadData: (dispatch: Dispatch, params?: any) => void;
}
