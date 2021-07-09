import { memo, useMemo } from 'react';
import { cn } from '../../common/';
import { classnames } from '@bem-react/classnames';

import { Button } from '../Button';

import { IHeaderProps } from './types';

import './style.scss';

export const Header = memo<IHeaderProps>((props) => {
    const { title, isFaded, buttons = [], extraClasses } = props;

    const cnHeader = cn('header');

    const buttonsMemo = useMemo(
        () =>
            buttons.map((buttonProps) => (
                <Button
                    {...buttonProps}
                    key={buttonProps.text}
                    extraClasses={classnames(
                        cnHeader('control'),
                        buttonProps.extraClasses,
                    )}
                />
            )),
        [buttons, classnames, cnHeader],
    );

    return (
        <header
            className={classnames(cnHeader({ faded: isFaded }), extraClasses)}
        >
            <div className={classnames(cnHeader('container'), 'container')}>
                <h1 className={cnHeader('title')}>{title}</h1>
                {buttonsMemo}
            </div>
        </header>
    );
});
