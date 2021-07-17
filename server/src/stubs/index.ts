import stubBuilds from './builds';
import stubLogs from './logs';
import stubSettings from './settings';

export function getStubBuildById(id: string) {
    return stubBuilds.find((item) => item.id === id);
}
export function getStubBuilds() {
    return stubBuilds;
}
export function getStubLogs() {
    return stubLogs;
}
export function getStubSettings() {
    return stubSettings;
}
