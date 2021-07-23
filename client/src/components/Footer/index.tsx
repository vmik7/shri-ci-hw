import { memo } from 'react';

import { cn } from '../../common/';
const cnFooter = cn('footer');

import { IFooterProps } from './types';

import './style.scss';

export const Footer = memo<IFooterProps>((props) => {
    const { extraClasses } = props;

    return (
        <footer className={cnFooter(null, [extraClasses])}>
            <div className={cnFooter('container', ['container'])}>
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
});
