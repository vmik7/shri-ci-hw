import { FC } from 'react';
import { cn } from '../../styles';
import { classnames } from '@bem-react/classnames';

import { IFooterProps } from './types';

import './style.scss';

export const Footer: FC<IFooterProps> = (props) => {
    const { extraClasses = '' } = props;

    const cnFooter = cn('footer');

    return (
        <footer className={classnames(cnFooter(), extraClasses)}>
            <div className={classnames(cnFooter('container'), 'container')}>
                <ul className={cnFooter('list')}>
                    <li className={cnFooter('item')}>
                        <a href="*" className={cnFooter('link')}>
                            Support
                        </a>
                    </li>
                    <li className={cnFooter('item')}>
                        <a href="*" className={cnFooter('link')}>
                            Learning
                        </a>
                    </li>
                    <li className={cnFooter('item')}>
                        <a href="*" className={cnFooter('link')}>
                            Русская версия
                        </a>
                    </li>
                </ul>
                <p className={cnFooter('copyright')}>© 2020 Your Name</p>
            </div>
        </footer>
    );
};
