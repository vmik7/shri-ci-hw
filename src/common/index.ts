import { withNaming } from '@bem-react/classname';

export const cn = withNaming({ e: '__', m: '_', v: '_' });

export interface IComponentProps {
    extraClasses?: string;
}

export interface IPageProps {
    contentClass?: string;
    loadData: (params?: any) => void;
}
