import React from 'react';
import DocViewContainer from './DocViewContainer';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './App.css';

const App = () => (
    <Provider store={store}>
        <div className="App">
            <DocViewContainer />
        </div>
    </Provider>
);

export default App;
