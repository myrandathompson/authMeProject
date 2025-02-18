// Import necessary libraries and components
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { ModalProvider, Modal } from './context/Modal';

// Configure the redux store
const store = configureStore();

// If the node environment is not production
if (process.env.NODE_ENV !== 'production') {
  // Restore the CSRF token
  restoreCSRF();

  // Add csrfFetch, store, and sessionActions to the global window object
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Define the Root component
function Root() {
  return (
    // Provide the modal context to the app
    <ModalProvider>
      {/* Provide the redux store to the app */}
      <ReduxProvider store={store}>
        {/* Set up BrowserRouter for routing */}
        <BrowserRouter>
          {/* Render the main App component */}
          <App />
          {/* Render the Modal component */}
          <Modal />
        </BrowserRouter>
      </ReduxProvider>
    </ModalProvider>
  );
}

// Render the Root component into the DOM
ReactDOM.render(
  // Use StrictMode for highlighting potential problems in the app during development
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  // Get the root element from the DOM
  document.getElementById('root')
);