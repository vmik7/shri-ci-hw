import { memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { classnames } from '@bem-react/classnames';

import { cn } from '../../common/';

import {
    useAppSelector as useSelector,
    useAppDispatch as useDispatch,
} from '../../store/hooks';
import {
    getSubmittingStatus,
    setHash,
    getHash,
    postBuild,
    getNewBuildData,
} from '../../store/newBuildSlice';
import { closeModal } from '../../store/buildsSlice';

import { Modal } from '../Modal';
import { TextField } from '../TextField';
import { Button } from '../Button';

import { INewBuildProps } from './types';

import './style.scss';

export const NewBuild = memo<INewBuildProps>((props) => {
    const { extraClasses } = props;

    const dispatch = useDispatch();

    const hash = useSelector(getHash());
    const { isSubmitting, submitError } = useSelector(getSubmittingStatus());
    const newBuildData = useSelector(getNewBuildData());

    let history = useHistory();

    const cnNewBuild = cn('new-build');

    function validate() {
        if (!/^[a-z0-9]+$/.test(hash)) {
            return 'Пожалуйста, введите корректный хеш коммита!';
        }
        return '';
    }

    if (submitError) {
        alert(`Ошибка!\n\n${submitError}`);
    }

    if (newBuildData) {
        history.push(`/build/${newBuildData.id}`);
    }

    const onCancelHandler = useCallback(() => {
        dispatch(closeModal());
        dispatch(setHash(''));
    }, [dispatch]);

    const onSubmitHandler = useCallback(
        (e) => {
            e.preventDefault();
            const errorMessage = validate();
            if (errorMessage) {
                alert(errorMessage);
            } else {
                dispatch(postBuild());
            }
        },
        [validate, dispatch],
    );

    const onChangeHandler = useCallback(
        (value) => dispatch(setHash(value)),
        [dispatch],
    );

    return (
        <Modal
            extraClasses={classnames(cnNewBuild(), extraClasses)}
            title="New build"
            subtitle="Enter the commit hash which you want to build."
            onWrapperClick={onCancelHandler}
            content={
                <form onSubmit={onSubmitHandler}>
                    <TextField
                        placeholder="Commit hash"
                        required
                        extraClasses={cnNewBuild('input')}
                        name="hash"
                        onChange={onChangeHandler}
                        value={hash}
                    />
                    <div className={cnNewBuild('controls')}>
                        <Button
                            isPrimary={true}
                            text="Run build"
                            type="submit"
                            disabled={isSubmitting}
                        />
                        <Button
                            text="Cancel"
                            onClick={onCancelHandler}
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            }
        />
    );
});
