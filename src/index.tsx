import React from 'react';
import { render } from 'react-dom';
import { App } from './client/App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './client/_helpers/store';

render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.querySelector('#root')
);
