import { csrfFetch } from './csrf'
const GET_REVIEWS_BY_SPOT = 'reviews/getReviewBySpot'
const CREATE_REVIEWS = 'reviews/createReview'
const DELETE_REVIEW = 'reviews/deleteReview'

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        payload: reviewId,
    }
}

const createReview = (data) => {
    return {
        type: CREATE_REVIEWS,
        payload: data,
    }
}

const getReviewsBySpot = (data) => {
    return {
        type: GET_REVIEWS_BY_SPOT,
        payload: data,
    }
}

export const deleteUserReview = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(response.ok) {
        dispatch(deleteReview(id)) // Pass the id, not the entire review
    }

    return response;
}

export const createNewReview = (id, review) => async (dispatch) => {
    const req = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    const data = await req.json()
    const newReview = data
    dispatch(createReview(newReview)) // Pass the new review to the action creator
    return newReview;
}

export const getReviewsBySpotId = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${Number(id)}/reviews`)
    if(response.ok) {
        const data = await response.json()
        dispatch(getReviewsBySpot(data))
    }
    return response;
}

const initialState = { reviews: {} }
const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case GET_REVIEWS_BY_SPOT:
            console.log("review action get triggered")
            newState = Object.assign({ ...state })
            newState.reviews = action.payload
            return newState;
        case CREATE_REVIEWS:
            newState = { ...state };
            newState.reviews = { ...state.reviews, [action.payload.id]: action.payload };
            return newState;
        case DELETE_REVIEW:
            newState = { ...state };
            delete newState.reviews[action.payload];
            // Remove the deleted review from spotReviews array
            newState.reviews.Reviews = newState.reviews.Reviews.filter(review => review.id !== action.payload);
            return newState;
        default: return state;
    }
}

export default reviewsReducer;