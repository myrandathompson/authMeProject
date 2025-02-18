// Import necessary libraries, components and styles
// import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import './Navigation.css'

// This is the main Navigation component
function Navigation({ isLoaded }) {
    // Use Redux useSelector hook to get access to the user in the current session
    const sessionUser = useSelector(state => state.session.user)

    // Initialize the 'createSpotButton' variable
    let createSpotButton;

    // If the user is logged in (sessionUser is truthy), show the 'Create a New Spot' button
    if(sessionUser) {
        createSpotButton = (
        <div id={`create-spot-button-div`}>
            <NavLink to='/spots/new'>
                <button id='create-new-spot-button'>Create a New Spot</button>
            </NavLink>
        </div>
        )
    } else {
        // If the user is not logged in (sessionUser is falsy), don't show the 'Create a New Spot' button
        createSpotButton = (<></>)
    }

    // Return the main component
    return (
        <div id='parent-nav-div'>
            <div id='logo-div'>
                {/* Link to the home page when the logo image or the logo text is clicked */}
                <NavLink exact to='/'><img id='logo-img' src="https://thumbs.dreamstime.com/b/chainlink-flat-icon-white-background-chainlink-flat-icon-white-background-202544946.jpg" alt="logo" border="0"/></NavLink>
                <NavLink exact to='/'>
                    <h1 id='logo-text'>N-airbnb</h1>
                </NavLink>
            </div>

            {/* Check if the component is loaded */}
            {isLoaded && (
                <>
                {/* Display the 'Create a New Spot' button (if applicable) */}
                {createSpotButton}
                <div id='left-half-nav'>
                <div className='nav-container' >
                    <div className='profile-button-div'>
                        {/* Render the ProfileButton component, passing in the current user */}
                        <ProfileButton user={sessionUser}/>
                    </div>
                </div>
                </div>

                </>
            )}
        </div>
    )
}

// Export the Navigation component so it can be used in other parts of our app
export default Navigation;