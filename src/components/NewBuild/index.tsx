import React from 'react';

import Modal from '../generic/Modal';
import TextField from '../generic/TextField';
import Button from '../generic/Button';

import './style.scss';

export interface NewBuildProps {
    onWrapperClick(): void;
    onSave(): void;
    onCancel(): void;
    onInputChange(value: string): void;
    inputValue: string;
}

export default function NewBuild({
    onWrapperClick,
    onSave,
    onCancel,
    onInputChange,
    inputValue = '',
}: NewBuildProps) {
    return (
        <Modal
            classList={['new-build']}
            title="New build"
            subtitle="Enter the commit hash which you want to build."
            onWrapperClick={onWrapperClick}
            content={
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                >
                    <TextField
                        placeholder="Commit hash"
                        isRequired={true}
                        classList={['new-build__input']}
                        name="hash"
                        onChange={onInputChange}
                        value={inputValue}
                    />
                    <div className="new-build__controls">
                        <Button
                            isPrimary={true}
                            text="Run build"
                            type="submit"
                        />
                        <Button text="Cancel" onClick={onCancel} />
                    </div>
                </form>
            }
        />
    );
}
