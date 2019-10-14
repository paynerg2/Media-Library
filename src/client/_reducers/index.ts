import { combineReducers } from 'redux';
import { users } from './users.reducer';
import { authentication } from './authentication.reducer';

const rootReducer = combineReducers({ users, authentication });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
