import React from 'react';
import Ansi from 'ansi-to-react';

import './style.scss';
import './ansi.scss';

export interface BuildLogProps {
    logs?: string;
    classList?: Array<string>;
}

export default function BuildLog({ logs = '', classList = [] }: BuildLogProps) {
    return (
        <pre className={['build-log', ...classList].join(' ')}>
            <Ansi useClasses>{logs}</Ansi>
        </pre>
    );
}
