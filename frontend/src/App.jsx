import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation'; // Corrected import
import LandingPage from './components/LandingPage'; // Corrected import
import SpotDetails from './components/SpotDetails'; // Corrected import
import CreateSpotForm from './components/CreateSpotForm';
import ManageSpots from './components/ManageSpots'; // Corrected import
import EditForm from './components/EditForm'; // Corrected import

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  // useEffect hook to restore the user and update isLoaded state when done
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {/* Navigation component */}
      <Navigation isLoaded={isLoaded} />

      {/* Conditional rendering based on isLoaded state */}
      {isLoaded && (
        <Switch>
          {/* Route for the LandingPage component */}
          <Route exact path='/'>
            <LandingPage />
          </Route>

          {/* Route for the CreateSpotForm component */}
          <Route exact path='/spots/new'>
            <CreateSpotForm />
          </Route>

          {/* Route for the ManageSpots component */}
          <Route exact path='/spots/current'>
            <ManageSpots />
          </Route>

          {/* Route for the EditForm component */}
          <Route exact path='/spots/:spotId/edit'>
            <EditForm />
          </Route>

          {/* Route for the SpotDetails component */}
          <Route path='/spots/:spotId'>
            <SpotDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;