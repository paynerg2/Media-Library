import { combineReducers, AnyAction } from 'redux';
import { users } from './users.reducer';
import { authentication } from './authentication.reducer';
import { series } from './series.reducer';
import { appActions } from '../_actions';

const appReducer = combineReducers({ users, authentication, series });

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: any, action: AnyAction) => {
    if (action.type === appActions.reset) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
