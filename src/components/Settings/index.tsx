import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import {
    getSettingsData,
    getSavingStatus,
    getSavingErrorData,
    setSettings,
    setRepoName,
    setBuildCommand,
    setMainBranch,
    setPeriod,
} from '../../store/settingsSlice';

import './style.scss';

import Header from '../Header';
import TextField from '../generic/TextField';
import Button from '../generic/Button';

export interface SettingsProps {
    contentClass?: Array<string>;
    loadData(): any;
}

export default function Settings({
    contentClass = [],
    loadData,
}: SettingsProps) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadData());
    }, [dispatch]);

    const data = useSelector(getSettingsData());
    const saveError = useSelector(getSavingErrorData());
    const saveStatus = useSelector(getSavingStatus());

    const history = useHistory();

    function validate() {
        if (!data.repoName) {
            return 'Имя репозитория - обязательное поле!';
        }
        if (!data.buildCommand) {
            return 'Команда для сборки - обязательное поле!';
        }
        if (!/^[^\/]+\/[a-zA-Z0-9_-]+$/.test(data.repoName)) {
            return 'Ошибка! Github репозиторий должен быть задан в виде:\n\nимя-пользователя/название-репозитория';
        }
        return '';
    }

    if (saveError) {
        alert(
            `Доступ к репозиторию ${data.repoName} невозможен!\n\n${saveError}`,
        );
    }

    return (
        <>
            <Header title="School CI server" isFaded={true} />
            <div className={['settings', ...contentClass].join(' ')}>
                <div className="container settings__container">
                    <div className="settings__header">
                        <h2 className="settings__title">Settings</h2>
                        <p className="settings__sub-title">
                            Configure repository connection and synchronization
                            settings.
                        </p>
                    </div>
                    <form>
                        <TextField
                            value={data ? data.repoName : ''}
                            placeholder="user-name/repo-name"
                            isLabeled={true}
                            labelText="GitHub repository"
                            isRequired={true}
                            classList={['settings__input']}
                            name="repo"
                            onChange={(value) => dispatch(setRepoName(value))}
                        />
                        <TextField
                            value={data ? data.buildCommand : ''}
                            placeholder="example: npm run build"
                            isLabeled={true}
                            labelText="Build command"
                            isRequired={true}
                            classList={['settings__input']}
                            name="build"
                            onChange={(value) =>
                                dispatch(setBuildCommand(value))
                            }
                        />
                        <TextField
                            value={data ? data.mainBranch : ''}
                            placeholder="main"
                            isLabeled={true}
                            labelText="Main branch"
                            classList={['settings__input']}
                            name="branch"
                            onChange={(value) => dispatch(setMainBranch(value))}
                        />
                        <div className="settings__input_inline">
                            Synchronize every
                            <TextField
                                value={(data
                                    ? data.period || ''
                                    : ''
                                ).toString()}
                                placeholder="10"
                                isInline={true}
                                classList={[]}
                                name="period"
                                onChange={(value: string) => {
                                    value = value.trim();
                                    if (/^[0-9]*$/.test(value)) {
                                        dispatch(setPeriod(+value));
                                    }
                                }}
                            />
                            minutes
                        </div>
                        <div className="settings__controls">
                            <Button
                                text="Save"
                                isPrimary={true}
                                classList={[
                                    'settings__button',
                                    'settings__button_action_save',
                                ]}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const errorMessage = validate();
                                    if (errorMessage) {
                                        alert(errorMessage);
                                    } else {
                                        dispatch(setSettings());
                                    }
                                }}
                                disabled={saveStatus.isSaving}
                            />
                            <Button
                                text="Cancel"
                                classList={[
                                    'settings__button',
                                    'settings__button_action_cancel',
                                ]}
                                onClick={() => {
                                    history.push('/');
                                }}
                                disabled={saveStatus.isSaving}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
