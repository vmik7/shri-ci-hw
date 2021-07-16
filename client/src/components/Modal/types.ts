import React from 'react';
import { IComponentProps } from '../../common/types';

export interface IModalProps extends IComponentProps {
    title?: string;
    subtitle?: string;
    content?: React.ReactNode;
    onWrapperClick?: (event?: React.MouseEvent) => void;
}
