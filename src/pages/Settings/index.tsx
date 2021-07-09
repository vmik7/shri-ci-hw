import { memo, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';
import { classnames } from '@bem-react/classnames';

import { cn } from '../../common/';

import {
    useAppSelector as useSelector,
    useAppDispatch as useDispatch,
} from '../../store/hooks';
import {
    getSettingsData,
    getSavingStatus,
    setSettings,
    setRepoName,
    setBuildCommand,
    setMainBranch,
    setPeriod,
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
    const { isSaving, saveError } = useSelector(getSavingStatus());

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

    const onRepositoryChange = useCallback(
        (value) => dispatch(setRepoName(value)),
        [dispatch],
    );
    const onBuildCommandChange = useCallback(
        (value) => dispatch(setBuildCommand(value)),
        [dispatch],
    );
    const onMainBranchChange = useCallback(
        (value) => dispatch(setMainBranch(value)),
        [dispatch],
    );
    const onPeriodChange = useCallback(
        (value) => {
            value = value.trim();
            if (/^[0-9]*$/.test(value)) {
                dispatch(setPeriod(+value));
            }
        },
        [dispatch],
    );

    const onSaveHandler = useCallback(
        (e) => {
            e.preventDefault();
            const errorMessage = validate();
            if (errorMessage) {
                alert(errorMessage);
            } else {
                dispatch(setSettings());
            }
        },
        [validate, dispatch],
    );
    const onCancelHandler = useCallback(() => {
        history.push('/');
    }, [history]);

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
                            onChange={onRepositoryChange}
                        />
                        <TextField
                            value={data ? data.buildCommand : ''}
                            placeholder="example: npm run build"
                            isLabeled
                            labelText="Build command"
                            required
                            extraClasses={cnSettings('input')}
                            name="build"
                            onChange={onBuildCommandChange}
                        />
                        <TextField
                            value={data ? data.mainBranch : ''}
                            placeholder="main"
                            isLabeled
                            labelText="Main branch"
                            extraClasses={cnSettings('input')}
                            name="branch"
                            onChange={onMainBranchChange}
                        />
                        <div className={cnSettings('input', { inline: true })}>
                            Synchronize every
                            <TextField
                                value={data && data.period ? data.period : ''}
                                placeholder="10"
                                isInline={true}
                                name="period"
                                onChange={onPeriodChange}
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
                                disabled={isSaving}
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
        </>
    );
});
