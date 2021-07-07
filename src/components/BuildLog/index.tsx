import { FC } from 'react';
import { cn } from '../../common';
import { classnames } from '@bem-react/classnames';
import Ansi from 'ansi-to-react';

import { IBuildLogProps } from './types';

import './style.scss';
import './ansi.scss';

export const BuildLog: FC<IBuildLogProps> = (props) => {
    const { logs = '', extraClasses = '' } = props;

    const cnBuildLog = cn('build-log');

    return (
        <pre className={classnames(cnBuildLog(), extraClasses)}>
            <Ansi useClasses>{logs}</Ansi>
        </pre>
    );
};
