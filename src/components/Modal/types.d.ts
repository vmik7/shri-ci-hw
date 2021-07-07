import { IComponentProps } from '../../common';

export interface IModalProps extends IComponentProps {
    title?: string;
    subtitle?: string;
    content?: React.ReactNode;
    onWrapperClick: () => void;
}
