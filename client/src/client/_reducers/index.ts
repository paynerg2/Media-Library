import { combineReducers, AnyAction } from 'redux';
import { users } from './users.reducer';
import { authentication } from './authentication.reducer';
import { series } from './series.reducer';
import { companies } from './company.reducer';
import { creators } from './creator.reducer';
import { books } from './book.reducer';
import { discs } from './disc.reducer';
import { games } from './game.reducer';
import { search } from './search.reducer';
import { appActions } from '../_actions';

const appReducer = combineReducers({
    users,
    authentication,
    series,
    companies,
    creators,
    books,
    discs,
    games,
    search
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: any, action: AnyAction) => {
    if (action === appActions.reset) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
