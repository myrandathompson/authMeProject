// Importing CSS for the DeleteReviewModal component
import './DeleteReviewModal.css';
// Importing React library
// import React from 'react';
// Importing review actions from the review store
import * as reviewActions from '../../store/reviews.js';
// Importing useDispatch hook from react-redux for dispatching actions
import { useDispatch } from 'react-redux';
// Importing useModal custom hook from context for handling modal operations
import { useModal } from '../../context/Modal.jsx';

// Defining the DeleteReviewModal functional component
// It receives review and props as arguments
function DeleteReviewModal({ review, props }) {
    // Dispatch function from useDispatch hook for dispatching actions
    const dispatch = useDispatch();

    // closeModal function from useModal custom hook for closing the modal
    const { closeModal } = useModal();

    // Handler for delete operation
    const handleDelete = async (e) => {
        // Preventing default form submission
        
        e.preventDefault();
        console.log("Deleting review with ID:", review.id);
        // Dispatching deleteUserReview action with review id and review as arguments
        // Using async/await to ensure the dispatch completes before moving to the next steps
        await dispatch(reviewActions.deleteUserReview(review.id, review));

        // Close the modal after the review has been deleted
        closeModal();
        
        // Check if the props object exists and if onReviewDeleted is defined 
        // before calling it. This ensures we don't try to invoke an undefined function.
        if (props && typeof props.onReviewDeleted === 'function') {
            props.onReviewDeleted();
        }
    }

    // The JSX returned by the component
    // It includes a confirmation message and two buttons: one for confirming the deletion and the other for cancelling it
    return (
        <div id='confirm-delete-modal-parent'>
            <div id='confirm-delete-review-modal-text'>
                <h1 id='confirm-delete-title-text'>
                    Confirm Delete
                </h1>
                <p id='confirm-delete-p-text'>
                    Are you sure you want to delete this review?
                </p>
            </div>
            <div id='delete-spot-yes-button-div'>
                <button id='delete-review-confirm-yes-button' onClick={handleDelete}>
                    Yes (Delete Review)
                </button>
            </div>
            <div id='delete-spot-no-button-div'>
                <button id='delete-review-no-button-div' onClick={closeModal}>
                    No (Keep Review)
                </button>
            </div>
        </div>
    );
}

// Exporting DeleteReviewModal as a default export
export default DeleteReviewModal;
