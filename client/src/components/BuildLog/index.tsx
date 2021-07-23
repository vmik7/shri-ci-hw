import { memo } from 'react';
import Ansi from 'ansi-to-react';

import { cn } from '../../common/';
const cnBuildLog = cn('build-log');

import { IBuildLogProps } from './types';

import './style.scss';
import './ansi.scss';

export const BuildLog = memo<IBuildLogProps>((props) => {
    const { logs, extraClasses } = props;

    return (
        <pre className={cnBuildLog(null, [extraClasses])}>
            <Ansi useClasses>{logs}</Ansi>
        </pre>
    );
});
