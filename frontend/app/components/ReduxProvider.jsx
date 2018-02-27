import { Provider } from 'react-redux';
import GlobalState from './../reducers/reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { SIDE_ELEMENTS } from '../constants/constants';
import { selectSideElement } from '../reducers/actions';
import App from './App';

export default class ReduxProvider extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {sideElements: SIDE_ELEMENTS};
        this.store = this.configureStore();
    }
    render() {
        return (
          <AppContainer>
           <Provider store={ this.store }>
            <div style={{ height: '100%' }}>
            <App store={ this.store } />
            </div>
            </Provider>
          </AppContainer>
        );
    }
    configureStore() {
        const store = createStore(GlobalState, this.initialState);
        if (module.hot) {
            module.hot.accept('./../reducers/reducers', () => {
                const nextRootReducer = require('./../reducers/reducers').default;
                store.replaceReducer(nextRootReducer);
            });
        }
        return store;
    }
}