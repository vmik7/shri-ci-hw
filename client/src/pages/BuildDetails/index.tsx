import { memo, useCallback, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { classnames } from '@bem-react/classnames';
import toast, { Toaster } from 'react-hot-toast';

import { cn } from '../../common/';

import {
    useAppSelector as useSelector,
    useAppDispatch as useDispatch,
} from '../../store/hooks';
import {
    getBuildById,
    getRebuildData,
    getRebuilStatus,
    fetchRebuild,
    nullRebuildError,
    nullRebuildData,
} from '../../store/buildDetailsSlice';
import { getRepoName } from '../../store/settingsSlice';

import { Header } from '../../components/Header';
import { BuildItem } from '../../components/BuildItem';
import { BuildLog } from '../../components/BuildLog';

import { IBuildDetailsProps } from './types';

import './style.scss';

export const BuildDetails = memo<IBuildDetailsProps>((props) => {
    const { contentClass, loadData } = props;
    const { id: buildId } = useParams<{ id: string }>();

    const dispatch = useDispatch();

    useEffect(() => {
        loadData(dispatch, buildId);
    }, [dispatch, buildId]);

    const { data, logs } = useSelector(getBuildById(buildId));
    const repoName = useSelector(getRepoName());

    const history = useHistory();

    const { rebuildError, isRebuilded, isRebuilding } = useSelector(
        getRebuilStatus(),
    );
    const rebuildData = useSelector(getRebuildData());

    useEffect(() => {
        if (isRebuilding) {
            const loadingTostId = toast.loading('Waiting...');
            return () => {
                toast.dismiss(loadingTostId);
            };
        }
    }, [isRebuilding, toast]);

    useEffect(() => {
        if (rebuildError) {
            toast.error(rebuildError);
            return () => {
                dispatch(nullRebuildError());
            };
        }
    }, [rebuildError, dispatch, nullRebuildError, toast]);

    useEffect(() => {
        if (isRebuilded && rebuildData) {
            history.push(`/build/${rebuildData.id}`);
            return () => {
                dispatch(nullRebuildData());
            };
        }
    }, [isRebuilded, rebuildData, dispatch, nullRebuildData]);

    const cnBuildDetails = cn('build-details');

    const onRebuildHandler = useCallback(() => {
        dispatch(fetchRebuild(data.commitHash));
    }, [dispatch, data]);

    const onSettingsHandler = useCallback(() => {
        history.push('/settings');
    }, [history]);

    const buildMemo = useMemo(
        () =>
            data ? (
                <div
                    className={classnames(
                        cnBuildDetails('container'),
                        'container',
                    )}
                >
                    <BuildItem data={data} isDetailed={true} />
                    <BuildLog
                        extraClasses={cnBuildDetails('logs')}
                        logs={
                            logs === undefined ? 'Loading...' : logs ? logs : ''
                        }
                    />
                </div>
            ) : null,
        [data, logs, cnBuildDetails, classnames],
    );

    return (
        <>
            <Header
                title={repoName}
                buttons={[
                    {
                        text: 'Rebuild',
                        hasIcon: true,
                        /* prettier-ignore */
                        svg: (<svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.775 3.031a4.036 4.036 0 00-2.779-1.096 4.07 4.07 0 00-3.938 3.07.291.291 0 01-.282.22H.39a.29.29 0 01-.286-.342 6.002 6.002 0 0110.04-3.221l.865-.864a.58.58 0 01.991.41v3.244c0 .32-.26.58-.58.58H8.175a.58.58 0 01-.41-.991l1.01-1.01zM.581 6.968h3.243a.58.58 0 01.41.991l-1.01 1.01a4.035 4.035 0 002.78 1.096 4.07 4.07 0 003.938-3.07.291.291 0 01.282-.22h1.386a.29.29 0 01.286.342 6.002 6.002 0 01-10.04 3.221l-.865.864a.58.58 0 01-.991-.41V7.548c0-.32.26-.58.58-.58z" fill="#000" /></svg>),
                        isSmall: true,
                        onClick: onRebuildHandler,
                    },
                    {
                        text: 'Settings',
                        hasIcon: true,
                        iconOnly: true,
                        /* prettier-ignore */
                        svg: (<svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M11.34 7.442l-1.03-.595a4.662 4.662 0 000-1.699l1.03-.595a.292.292 0 00.134-.338 6.026 6.026 0 00-1.324-2.29.291.291 0 00-.358-.055l-1.03.595a4.566 4.566 0 00-1.471-.849V.428a.29.29 0 00-.228-.283 6.082 6.082 0 00-2.641 0 .29.29 0 00-.228.283v1.19a4.71 4.71 0 00-1.47.85l-1.03-.595a.287.287 0 00-.357.055A5.99 5.99 0 00.013 4.217a.29.29 0 00.134.339l1.03.595a4.66 4.66 0 000 1.698l-1.03.595a.292.292 0 00-.134.34c.269.86.726 1.64 1.324 2.288.092.099.242.123.358.055l1.03-.595c.434.373.932.66 1.472.85v1.19a.29.29 0 00.227.283 6.082 6.082 0 002.642 0 .29.29 0 00.227-.283v-1.19a4.71 4.71 0 001.471-.85l1.03.595a.287.287 0 00.359-.055 5.989 5.989 0 001.323-2.289.299.299 0 00-.135-.341zm-5.598.491a1.938 1.938 0 01-1.935-1.935c0-1.067.869-1.936 1.935-1.936 1.067 0 1.936.869 1.936 1.936a1.938 1.938 0 01-1.936 1.935z" fill="#111" /></svg>),
                        isSmall: true,
                        onClick: onSettingsHandler,
                    },
                ]}
            />
            <div
                className={classnames(cnBuildDetails(), contentClass)}
                data-testid="build-details"
            >
                {buildMemo}
            </div>
            <Toaster />
        </>
    );
});
