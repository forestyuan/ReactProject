import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {history, persistor, store} from './Reducers';
import {ToastContainer} from 'react-toastify';
import {AppNavigation} from './Navigation/AppNavigation';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigation history={history}/>
        <ToastContainer/>
      </PersistGate>
    </Provider>
  );
};

export default App;
