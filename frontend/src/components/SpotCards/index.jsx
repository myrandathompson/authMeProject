// Import required libraries, hooks and styles
import './SpotCards.css'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import DeleteConfirmModal from '../DeleteConfirmModal'

// The SpotCard component
// This component takes three props:
// spot: The spot object containing the details about the spot
// user: The currently logged-in user
// onSpotDeleted: A callback function that will be called when the spot is deleted
function SpotCard({ spot, user, onSpotDeleted }) {
    // Create a state for the tooltip visibility
    const [tooltipVisibility, setTooltipVisibility] = useState('hidden')

    // Variable to hold the rating of the spot
    // If the spot's average rating is 'NaN', the rating is 'New'. Otherwise, it is the average rating of the spot
    let rating;
    if(spot.avgRating === 'NaN') {
        rating = 'New'
    } else {
        rating = spot.avgRating
    }

    // Variable to hold the manage buttons
    // If the user is logged in, show the Update and Delete buttons. Otherwise, do not show any buttons
    let manageButtons;
    if(user) {
        manageButtons = (
            <div id='manage-spot-buttons'>
            <NavLink exact to={`/spots/${spot.id}/edit`}>
                <button id='manage-spots-update-button'>Update</button>
            </NavLink>
            <OpenModalButton
            id='delete-modal-button'
            buttonText='Delete'
            modalComponent={<DeleteConfirmModal spot={spot} onSpotDeleted={onSpotDeleted} />}
            />
            </div>
        )
    } else {
        manageButtons = ''
    }

    // Return the SpotCard component
    // When the mouse enters the card, the tooltip becomes visible, and when the mouse leaves the card, the tooltip becomes hidden
    return (
        <div id='spot-card-manage-div-for-delete-modal'>
        <NavLink to={`/spots/${spot.id}`}>
        <div className='spot-card-parent-div'
        id={`spot-card-number-${spot.id}`}
        onMouseEnter={() => setTooltipVisibility('visible')}
        onMouseLeave={() => setTooltipVisibility('hidden')}
        >
            <span className={`tooltip-span-${tooltipVisibility}`}>{spot.name}</span>
            <div id='prev-img-tab'>
                {spot.previewImage && <img src={spot.previewImage} alt={spot.name} />}
            </div>
            <div id='spot-info-div'>
                <div id='spot-info-text'>
                <p id='city-state-text'>{spot.city}, {spot.state}</p>
                <p id='price-text'><span>${spot.price}</span> night</p>
                </div>
                <div id='rating-icon-div'>
                <i id='star-favicon' className="fa-solid fa-star" style={{color: "#000000"}}></i>{rating}
                </div>
            </div>
        </div>
        </NavLink>
        {manageButtons}
        </div>
    )
}

// Export the SpotCard component so it can be used in other parts of our app
export default SpotCard;