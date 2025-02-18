// import React, { Component } from 'react';
// Import the CSS file for the DeleteConfirmModal component.
import './DeleteConfirmModal.css';

// Import the React library.
// import React from 'react';

// Import the spotActions object from the store/spots module.
import * as spotActions from '../../store/spots.js';

// Import the useDispatch hook from react-redux.
import { useDispatch } from 'react-redux';

// Import the useModal hook from the Modal.js context file.
import { useModal } from '../../context/Modal.jsx';

// The DeleteConfirmModal component takes two props:
//   - spot: The spot that the user wants to delete.
//   - onSpotDeleted: A function that is called when the spot is deleted.
function DeleteConfirmModal({ spot, onSpotDeleted }) {

  // Get the dispatch function from the redux store.
  const dispatch = useDispatch();

  // Get the closeModal function from the Modal context.
  const { closeModal } = useModal();

  // This function is called when the user clicks the "Yes" button.
  // It dispatches an action to the store to delete the spot,
  // then closes the modal and calls the onSpotDeleted function.
  const handleDelete  = (e) => {
    e.preventDefault()
    dispatch(spotActions.deleteUserSpot(spot.id, spot)).then(() => {
      closeModal()
      onSpotDeleted()
    })
  }

  // Return the React component for the DeleteConfirmModal.
  return(
    <div id='confirm-delete-modal-parent'>
      <div id='confirm-delete-modal-text'>
        <h1 id='confirm-delete-title-text'>Confirm Delete</h1>
        <p id='confirm-delete-p-text'>Are you sure you want to remove this spot from the listings?</p>
      </div>
      <div id='delete-spot-yes-button-div'>
        <button id='delete-spot-confirm-yes-button' onClick={handleDelete}>Yes (Delete Spot)</button>
      </div>
      <div id='delete-spot-no-button-div'>
        <button id='delete-spot-confirm-no-button' onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </div>
  )
}

// Export the DeleteConfirmModal component.
export default DeleteConfirmModal;