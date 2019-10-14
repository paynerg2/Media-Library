import { createStore, applyMiddleware, Middleware, Store } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../_reducers';

const loggerMiddleware: Middleware = createLogger();
export const middlewares: Middleware[] = [thunkMiddleware];

// Only use Redux logger in development
if (process.env.NODE_ENV === `development`) {
    middlewares.push(loggerMiddleware);
}

export const store: Store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
);
