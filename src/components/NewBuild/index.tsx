import React from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { getNewBuildData, setHash, pushBuild } from '../../store/newBuildSlice';
import { closeModal } from '../../store/buildsSlice';

import Modal from '../generic/Modal';
import TextField from '../generic/TextField';
import Button from '../generic/Button';

import './style.scss';
interface NewBuildState {
    hash: string;
    isSubmiting: boolean;
    isSubmited: boolean;
    isSubmitError: boolean;
    submitError: null | string;
    newBuildId: null | string;
}

export default function NewBuild() {
    const dispatch = useDispatch();
    const {
        hash,
        isSubmiting,
        isSubmitError,
        submitError,
        newBuildId,
    }: NewBuildState = useSelector(getNewBuildData);

    let history = useHistory();

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
            classList={['new-build']}
            title="New build"
            subtitle="Enter the commit hash which you want to build."
            onWrapperClick={() => {
                dispatch(closeModal(null));
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
                        classList={['new-build__input']}
                        name="hash"
                        onChange={(value) => dispatch(setHash(value))}
                        value={hash}
                    />
                    <div className="new-build__controls">
                        <Button
                            isPrimary={true}
                            text="Run build"
                            type="submit"
                            disabled={isSubmiting}
                        />
                        <Button
                            text="Cancel"
                            onClick={() => {
                                dispatch(closeModal(null));
                                dispatch(setHash(''));
                            }}
                            disabled={isSubmiting}
                        />
                    </div>
                </form>
            }
        />
    );
}
