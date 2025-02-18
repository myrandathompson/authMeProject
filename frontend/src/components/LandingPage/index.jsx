import * as spotActions from '../../store/spots.js'; // Importing actions related to spots
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './LandingPage.css';
import SpotCard from '../SpotCards/index.js'; // Importing the SpotCard component

function LandingPage() {
    const dispatch = useDispatch(); // Redux dispatch function to trigger actions
    const allSpots = useSelector(state => state.spots.allSpots); // Accessing the 'allSpots' state from the Redux store

    const spots = Object.values(allSpots); // Converting the spots object into an array of spot objects
    const final = spots[0]; // Assuming that the first element of 'spots' array is to be displayed (you may need to adjust this based on your requirements)

    useEffect(() => {
        // useEffect hook used to dispatch an action to fetch spots when the component mounts
        dispatch(spotActions.fetchSpots());
    }, [dispatch]); // The useEffect hook depends on the 'dispatch' function, so it will be called whenever 'dispatch' changes

    return (
        <div id='landing-page-parent-div'>
            <div id='spot-card-show-div'>
                {final && final.map((spot) => (<SpotCard spot={spot} key={spot.id} />))}
                {/* Displaying the SpotCard component for each spot in the 'final' array */}
            </div>
        </div>
    );
}

export default LandingPage;