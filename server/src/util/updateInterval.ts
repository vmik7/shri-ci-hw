import { cloneRepo } from './cloneRepo';

interface IRepoDetail {
    repoUrl: string;
    period: number;
}

let interval: NodeJS.Timer;

export function clearUpdateInterval() {
    if (interval) {
        clearInterval(interval);
    }
}

export function setUpdateInterval({ repoUrl, period }: IRepoDetail) {
    clearUpdateInterval();

    if (repoUrl && period) {
        interval = setInterval(() => {
            cloneRepo(repoUrl);
        }, period * 60 * 1000);
    }
}
