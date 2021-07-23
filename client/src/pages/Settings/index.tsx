import { memo, useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

import { cn } from '../../common/';
const cnSettings = cn('settings');

import {
    useAppSelector as useSelector,
    useAppDispatch as useDispatch,
} from '../../store/hooks';
import {
    getSettingsData,
    getSavingStatus,
    setSettings,
    fieldsChanged,
    nullSaveError,
    nullSaveStatus,
} from '../../store/settingsSlice';

import { Header } from '../../components/Header';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';

import { ISettingsProps } from './types';

import './style.scss';

export const Settings = memo<ISettingsProps>((props) => {
    const { contentClass, loadData } = props;

    const dispatch = useDispatch();

    useEffect(() => {
        loadData(dispatch);
    }, [dispatch]);

    const data = useSelector(getSettingsData());

    const [repoName, setRepoName] = useState(data.repoName);
    const [buildCommand, setBuildCommand] = useState(data.buildCommand);
    const [mainBranch, setMainBranch] = useState(data.mainBranch);
    const [period, setPeriod] = useState(data.period);

    const { isSaving, saveError, isSaved, isChanged } = useSelector(
        getSavingStatus(),
    );

    const history = useHistory();

    function validate() {
        if (!repoName) {
            return 'Имя репозитория - обязательное поле!';
        }
        if (!buildCommand) {
            return 'Команда для сборки - обязательное поле!';
        }
        if (!/^[^\/]+\/[a-zA-Z0-9_-]+$/.test(repoName)) {
            return 'Ошибка! Github репозиторий должен быть задан в виде:\n\nимя-пользователя/название-репозитория';
        }
        return '';
    }

    useEffect(() => {
        setRepoName(data.repoName);
        setBuildCommand(data.buildCommand);
        setMainBranch(data.mainBranch);
        setPeriod(data.period);
    }, [data, setRepoName, setBuildCommand, setMainBranch, setPeriod]);

    useEffect(() => {
        dispatch(
            fieldsChanged({
                repoName,
                buildCommand,
                mainBranch,
                period,
            }),
        );
    }, [dispatch, fieldsChanged, repoName, buildCommand, mainBranch, period]);

    useEffect(() => {
        if (saveError) {
            toast.error(`Доступ к репозиторию ${repoName} невозможен!`);
            dispatch(nullSaveError());
        }
    }, [saveError, repoName, dispatch, nullSaveError, toast]);

    useEffect(() => {
        if (isSaving) {
            const toastId = toast.loading(`Waiting...`);
            return () => {
                toast.dismiss(toastId);
            };
        }
    }, [isSaving, toast]);

    useEffect(() => {
        if (isSaved) {
            toast.success(`Настройки сохранены`);
            dispatch(nullSaveStatus());
        }
    }, [isSaved, dispatch, nullSaveStatus, toast]);

    const onPeriodChange = useCallback(
        (value) => {
            value = value.trim();
            if (/^[0-9]*$/.test(value)) {
                setPeriod(+value);
            }
        },
        [dispatch, setPeriod],
    );

    const onSaveHandler = useCallback(
        (e) => {
            e.preventDefault();
            const errorMessage = validate();
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                dispatch(
                    setSettings({
                        repoName,
                        buildCommand,
                        mainBranch,
                        period,
                    }),
                );
            }
        },
        [validate, dispatch, toast, repoName, buildCommand, mainBranch, period],
    );
    const onCancelHandler = useCallback(() => {
        history.push('/');
    }, [history]);

    return (
        <>
            <Header title="School CI server" isFaded={true} />
            <div
                className={cnSettings(null, [contentClass])}
                data-testid="settings"
            >
                <div className={cnSettings('container', ['container'])}>
                    <div className={cnSettings('header')}>
                        <h2 className={cnSettings('title')}>Settings</h2>
                        <p className={cnSettings('sub-title')}>
                            Configure repository connection and synchronization
                            settings.
                        </p>
                    </div>
                    <form>
                        <TextField
                            value={repoName}
                            placeholder="user-name/repo-name"
                            isLabeled
                            labelText="GitHub repository"
                            required
                            extraClasses={cnSettings('input')}
                            name="repo"
                            onChangeHandler={setRepoName}
                        />
                        <TextField
                            value={buildCommand}
                            placeholder="example: npm run build"
                            isLabeled
                            labelText="Build command"
                            required
                            extraClasses={cnSettings('input')}
                            name="build"
                            onChangeHandler={setBuildCommand}
                        />
                        <TextField
                            value={mainBranch}
                            placeholder="main"
                            isLabeled
                            labelText="Main branch"
                            extraClasses={cnSettings('input')}
                            name="branch"
                            onChangeHandler={setMainBranch}
                        />
                        <div className={cnSettings('input', { inline: true })}>
                            Synchronize every
                            <TextField
                                value={period}
                                placeholder="10"
                                isInline={true}
                                name="period"
                                onChangeHandler={onPeriodChange}
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
                                onClick={onSaveHandler}
                                disabled={isSaving || !isChanged}
                            />
                            <Button
                                text="Cancel"
                                extraClasses={cnSettings('button', {
                                    action: 'cancel',
                                })}
                                onClick={onCancelHandler}
                                disabled={isSaving}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <Toaster />
        </>
    );
});
