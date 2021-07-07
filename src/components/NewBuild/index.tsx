import { FC } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../../common';
import { classnames } from '@bem-react/classnames';

import { getNewBuildData, setHash, pushBuild } from '../../store/newBuildSlice';
import { closeModal } from '../../store/buildsSlice';

import { Modal } from '../Modal';
import TextField from '../TextField';
import { Button } from '../Button';

import { INewBuildProps, INewBuildState } from './types';

import './style.scss';

export const NewBuild: FC<INewBuildProps> = (props) => {
    const { extraClasses = '' } = props;

    const dispatch = useDispatch();
    const {
        hash,
        isSubmiting,
        isSubmitError,
        submitError,
        newBuildId,
    }: INewBuildState = useSelector(getNewBuildData);

    let history = useHistory();

    const cnNewBuild = cn('new-build');

    function validate() {
        if (!/^[a-z0-9]+$/.test(hash)) {
            return 'Пожалуйста, введите корректный хеш коммита!';
        }
        return '';
    }

    if (isSubmitError) {
        alert(`Ошибка!\n\n${submitError}`);
    }

    if (newBuildId) {
        history.push(`/build/${newBuildId}`);
    }

    return (
        <Modal
            extraClasses={classnames(cnNewBuild(), extraClasses)}
            title="New build"
            subtitle="Enter the commit hash which you want to build."
            onWrapperClick={() => {
                dispatch(closeModal());
                dispatch(setHash(''));
            }}
            content={
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const errorMessage = validate();
                        if (errorMessage) {
                            alert(errorMessage);
                        } else {
                            dispatch(pushBuild());
                        }
                    }}
                >
                    <TextField
                        placeholder="Commit hash"
                        isRequired={true}
                        classList={[cnNewBuild('input')]}
                        name="hash"
                        onChange={(value) => dispatch(setHash(value))}
                        value={hash}
                    />
                    <div className={cnNewBuild('controls')}>
                        <Button
                            isPrimary={true}
                            text="Run build"
                            type="submit"
                            disabled={isSubmiting}
                        />
                        <Button
                            text="Cancel"
                            onClick={() => {
                                dispatch(closeModal());
                                dispatch(setHash(''));
                            }}
                            disabled={isSubmiting}
                        />
                    </div>
                </form>
            }
        />
    );
};
