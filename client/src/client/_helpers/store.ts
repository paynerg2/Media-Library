import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../_reducers';

const loggerMiddleware: Middleware = createLogger();
export const middlewares: Middleware[] = [thunkMiddleware];

// Only use Redux logger in development
if (process.env.NODE_ENV === `development`) {
    middlewares.push(loggerMiddleware);
}

// Set up Redux-Persist
const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: Store = createStore(
    persistedReducer,
    applyMiddleware(...middlewares)
);

export const persistor = persistStore(store);
