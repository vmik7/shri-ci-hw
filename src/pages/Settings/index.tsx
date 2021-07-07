import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { cn } from '../../common';
import { classnames } from '@bem-react/classnames';

import { Header } from '../../components/Header';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';

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

import { ISettingsProps } from './types';

import './style.scss';

export const Settings: FC<ISettingsProps> = (props) => {
    const { contentClass, loadData } = props;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadData());
    }, [dispatch]);

    const data = useSelector(getSettingsData());
    const saveError = useSelector(getSavingErrorData());
    const saveStatus = useSelector(getSavingStatus());

    const history = useHistory();

    const cnSettings = cn('settings');

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
            <div
                className={classnames(cnSettings(), contentClass)}
                data-testid="settings"
            >
                <div
                    className={classnames(cnSettings('container'), 'container')}
                >
                    <div className={cnSettings('header')}>
                        <h2 className={cnSettings('title')}>Settings</h2>
                        <p className={cnSettings('sub-title')}>
                            Configure repository connection and synchronization
                            settings.
                        </p>
                    </div>
                    <form>
                        <TextField
                            value={data ? data.repoName : ''}
                            placeholder="user-name/repo-name"
                            isLabeled
                            labelText="GitHub repository"
                            required
                            extraClasses={cnSettings('input')}
                            name="repo"
                            onChange={(value) => dispatch(setRepoName(value))}
                        />
                        <TextField
                            value={data ? data.buildCommand : ''}
                            placeholder="example: npm run build"
                            isLabeled
                            labelText="Build command"
                            required
                            extraClasses={cnSettings('input')}
                            name="build"
                            onChange={(value) =>
                                dispatch(setBuildCommand(value))
                            }
                        />
                        <TextField
                            value={data ? data.mainBranch : ''}
                            placeholder="main"
                            isLabeled
                            labelText="Main branch"
                            extraClasses={cnSettings('input')}
                            name="branch"
                            onChange={(value) => dispatch(setMainBranch(value))}
                        />
                        <div className={cnSettings('input', { inline: true })}>
                            Synchronize every
                            <TextField
                                value={(data
                                    ? data.period || ''
                                    : ''
                                ).toString()}
                                placeholder="10"
                                isInline={true}
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
                        <div className={cnSettings('controls')}>
                            <Button
                                text="Save"
                                isPrimary={true}
                                extraClasses={cnSettings('button', {
                                    action: 'save',
                                })}
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
                                extraClasses={cnSettings('button', {
                                    action: 'cancel',
                                })}
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
};
