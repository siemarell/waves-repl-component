import * as React from 'react';
import {Provider} from 'react-redux';
import store from './core/store';
import {setEnv} from './core/actions/Env'
import {setTheme} from './core/actions/Settings'
import {default as App} from './core/containers/App'
import './css/index.css';
import './core/jsconsole.css';

export class Repl extends React.Component {

    constructor(props: any){
        super(props)
        if (props.theme){
            store.dispatch(setTheme(props.theme))
        }
    }
    static updateEnv(env: any){
        store.dispatch(setEnv(env))
    }

    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );
    }
}