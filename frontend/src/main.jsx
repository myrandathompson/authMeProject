import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import { ModalProvider, Modal } from './context/Modal';
import * as sessionActions from './store/session';
import * as spotActions from './store/spot';
import * as reviewActions from './store/review';
import * as spotImageActions from './store/spotImage';
import * as reviewImageActions from './store/reviewImage';

const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.spotActions = spotActions;
  window.reviewActions = reviewActions;
  window.spotImageActions = spotImageActions;
  window.reviewImageActions = reviewImageActions;

}

// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);