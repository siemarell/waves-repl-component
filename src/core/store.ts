import reducers from './reducers/index';
import {createStore, compose, applyMiddleware} from 'redux';
import {SET_THEME, SET_LAYOUT} from './actions/Settings';
import {ADD_HISTORY} from './actions/Input';
import {SET_ENV} from "./actions/Env";
import {updateIFrameEnv} from './lib/contextBinding';


const save = (key: string, value:any, store = 'session') => {
    const storage = store === 'session' ? window.sessionStorage : window.localStorage
    try {
        storage.setItem(
            `jsconsole.${key}`,
            JSON.stringify(value)
        );
    } catch (e) {
    }
};

const saveToStorageMiddleware = applyMiddleware(store => next => action => {
    const nextAction = next(action);
    const state:any = store.getState(); // new state after action was applied

    if (action.type === SET_THEME || action.type === SET_LAYOUT) {
        save('settings', state.settings, 'local');
    }

    if (action.type === ADD_HISTORY) {
        save('history', state.history);
    }

    if (action.type === SET_ENV) {
        save('env', state.env);
    }
    return nextAction;
});

const syncIFrameEnvMiddleware = applyMiddleware(store => next => action => {
    const nextAction = next(action);
    const state:any = store.getState(); // new state after action was applied

    if (action.type === SET_ENV) {
        updateIFrameEnv(state.env)
    }
    return nextAction;
});

const middlewares = [
    saveToStorageMiddleware,
    syncIFrameEnvMiddleware
];

if ((<any>window).__REDUX_DEVTOOLS_EXTENSION__) {
    middlewares.push((<any>window).__REDUX_DEVTOOLS_EXTENSION__());
}

//const finalCreateStore = compose(...middlewares)(createStore);

const defaults:any = {};
try {
    defaults.settings = JSON.parse(
        localStorage.getItem('jsconsole.settings') || '{}'
    );
    defaults.history = JSON.parse(
        sessionStorage.getItem('jsconsole.history') || '[]'
    );
    defaults.env = JSON.parse(
        sessionStorage.getItem('jsconsole.env') || '{}'
    );
} catch (e) {
    console.log(e);
}

const store = createStore(reducers, compose(...middlewares))
//const store = finalCreateStore(reducers, defaults);
export default store;
