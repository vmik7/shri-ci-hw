import { memo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

import { cn } from '../../common/';
const cnNewBuild = cn('new-build');

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
    nullSubmitError,
    nullNewBuildData,
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
    const { isSubmitting, submitError, isSubmitted } = useSelector(
        getSubmittingStatus(),
    );
    const newBuildData = useSelector(getNewBuildData());

    let history = useHistory();

    useEffect(() => {
        if (isSubmitting) {
            const loadingTostId = toast.loading('Waiting...');
            return () => {
                toast.dismiss(loadingTostId);
            };
        }
    }, [isSubmitting, toast]);

    useEffect(() => {
        if (submitError) {
            toast.error(submitError);
            return () => {
                dispatch(nullSubmitError());
            };
        }
    }, [submitError, dispatch, nullSubmitError, toast]);

    useEffect(() => {
        if (newBuildData && isSubmitted) {
            history.push(`/build/${newBuildData.id}`);
            return () => {
                dispatch(closeModal());
                dispatch(nullNewBuildData());
            };
        }
    }, [history, newBuildData, dispatch, nullNewBuildData]);

    function validate() {
        if (!/^[a-z0-9]+$/.test(hash)) {
            return 'Пожалуйста, введите корректный хеш коммита!';
        }
        return '';
    }

    const onCancelHandler = useCallback(() => {
        dispatch(closeModal());
        dispatch(nullNewBuildData());
    }, [dispatch]);

    const onSubmitHandler = useCallback(
        (e) => {
            e.preventDefault();
            const errorMessage = validate();
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                dispatch(postBuild());
            }
        },
        [validate, dispatch, toast],
    );

    const onChangeHandler = useCallback(
        (value) => dispatch(setHash(value)),
        [dispatch],
    );

    return (
        <>
            <Modal
                extraClasses={cnNewBuild(null, [extraClasses])}
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
                            onChangeHandler={onChangeHandler}
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
            <Toaster />
        </>
    );
});
