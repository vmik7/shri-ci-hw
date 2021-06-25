import React, { useState } from 'react';

import './style.scss';

import Header from '../Header';
import TextField from '../generic/TextField';
import Button from '../generic/Button';

export interface SettingsProps {
    contentClass?: Array<string>;
}

export default function Settings({ contentClass = [] }: SettingsProps) {
    const [repo, setRepo] = useState('');
    const [build, setBuild] = useState('npm ci && npm run build');
    const [branch, setBranch] = useState('master');
    const [period, setPeriod] = useState(0);

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
                    <form method="POST">
                        <TextField
                            value={repo}
                            placeholder="user-name/repo-name"
                            isLabeled={true}
                            labelText="GitHub repository"
                            isRequired={true}
                            classList={['settings__input']}
                            name="repo"
                            onChange={(value) => setRepo(value)}
                        />
                        <TextField
                            value={build}
                            placeholder="example: npm run build"
                            isLabeled={true}
                            labelText="Build command"
                            isRequired={true}
                            classList={['settings__input']}
                            name="build"
                            onChange={(value) => setBuild(value)}
                        />
                        <TextField
                            value={branch}
                            placeholder="main"
                            isLabeled={true}
                            labelText="Main branch"
                            classList={['settings__input']}
                            name="branch"
                            onChange={(value) => setBranch(value)}
                        />
                        <div className="settings__input_inline">
                            Synchronize every
                            <TextField
                                value={(period || '').toString()}
                                placeholder="10"
                                isInline={true}
                                classList={[]}
                                name="period"
                                onChange={(value: string) => {
                                    value = value.trim();
                                    if (/^[0-9]*$/.test(value)) {
                                        setPeriod(+value);
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
                            />
                            <Button
                                text="Cancel"
                                classList={[
                                    'settings__button',
                                    'settings__button_action_cancel',
                                ]}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
