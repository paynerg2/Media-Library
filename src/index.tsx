import React from 'react';
import { render } from 'react-dom';
import { App } from './client/App';
import { Provider } from 'react-redux';
import { store } from './client/_helpers/store';

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);
