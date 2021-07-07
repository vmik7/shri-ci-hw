import { IPageProps } from '../../common/types';
import { IBuildItemProps } from '../../components/BuildItem/types';

interface IBuildData extends IBuildItemProps {
    id: string;
    configurationId: string;
}
interface IBuildListState {
    data: BuildData[];
    isLoading: boolean;
    isAllLoaded: boolean;
    isModalOpen: boolean;
}
export interface IBuildListProps extends IPageProps {}
