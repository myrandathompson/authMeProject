// Import necessary libraries and components
import { NavLink } from 'react-router-dom'  // Import NavLink for routing
import { useEffect, useState } from 'react'  // Import useEffect and useState hooks
import { useDispatch, useSelector } from 'react-redux'  // Import useDispatch and useSelector hooks
import * as spotActions from '../../store/spots'  // Import all actions from spots
import SpotCard from '../SpotCards'  // Import SpotCard component
import './ManageSpots.css'  // Import the CSS styles for the manage spots page

function ManageSpots() {
    const allSpots = useSelector(state => state.spots.allSpots);
    const sessionUser = useSelector(state => state.session.user);
    const spots = Object.values(allSpots) || [];
    const dispatch = useDispatch();
    const [spotsUpdated, setSpotsUpdated] = useState(false);

    useEffect(() => {
        dispatch(spotActions.fetchUserSpots());
    }, [dispatch, spotsUpdated]);

    return (
        <div id='manage-spots-parent-container'>
            <h2 id='manage-spots-title-text'>Manage Your Spots</h2>
            <NavLink exact to='/spots/new'>
                <button id='manage-spots-create-new-button'>Create a New Spot</button>
            </NavLink>
            <div id='manage-spots-show-parent-div'>
                <div id='spot-card-show-div'>
                    {spots.map((spot) => (
                        <div id='individual-card-manage-spots' key={spot.id}>
                            <SpotCard 
                                spot={spot} 
                                user={sessionUser} 
                                onSpotDeleted={() => setSpotsUpdated(prev => !prev)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ManageSpots;
