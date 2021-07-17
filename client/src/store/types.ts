import { store } from '.';
import { IApi } from '../api';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface AsyncThunkConfig {
    /** return type for `thunkApi.getState` */
    state: RootState;

    /** type for `thunkApi.dispatch` */
    dispatch: AppDispatch;

    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra: {
        api: IApi;
    };
}
