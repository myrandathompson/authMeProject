import { csrfFetch } from './csrf'

const GET_SPOTS = 'spots/getSpots'
const GET_SINGLE_SPOT = 'spots/getSingleSpot'
const CREATE_SPOT = 'spots/createSpot'
const GET_USER_SPOTS = 'spots/getUserSpots'
const UPDATE_SPOT = 'spots/updateSingleSpot'
const DELETE_SPOT = 'spots/deleteSpot'

const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        payload: spot,
    }
}

const updateSingleSpot = (data) => {
    return {
        type: UPDATE_SPOT,
        payload: data,
    }
}


const getSpots = (data) => {
    return {
        type: GET_SPOTS,
        payload: data,
    }
}

const getSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        payload: spot,
    }
}

const createSpot = (data) => {
    return {
        type: CREATE_SPOT,
        payload: data,
    }
}

const getUserSpots = (data) => {
    return {
        type: GET_USER_SPOTS,
        payload: data,
    }
}

export const deleteUserSpot = (id, spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok) {
        dispatch(deleteSpot(spot))
    }

    return response;
}

export const updateSpot = (id, spot) => async (dispatch) => {
    const req = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    const data = await req.json()
    const editedSpot = data
    dispatch(updateSingleSpot(editedSpot))
    return editedSpot;
}

export const fetchUserSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots/current')
    if (response.ok) {
        const data = await response.json()
        dispatch(getUserSpots(data))
    }
    return response;
}

export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots')
    if(response.ok) {
        const data = await response.json()
        dispatch(getSpots(data))
    }
    return response;
}

export const fetchSingleSpot = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}`)
    if(response.ok) {
        const data = await response.json()
        dispatch(getSingleSpot(data))
    }
}

export const createNewSpot = (spot) => async (dispatch) => {
    const req = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(spot)
    })
    const data = await req.json()
    const createdSpot = data
    dispatch(createSpot(createdSpot))
    return createdSpot;
}

const initialState = { allSpots: {}, singleSpot: {} }
const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case GET_SPOTS:
            newState = Object.assign({ ...state  })
            newState.allSpots = action.payload
            return newState;
        case GET_SINGLE_SPOT:
            newState = Object.assign({ ...state })
            newState.singleSpot = action.payload
            return newState;
        case CREATE_SPOT:
            newState = Object.assign({ ...state })
            newState.singleSpot = action.payload
            return newState;
        case GET_USER_SPOTS:
            newState = Object.assign({ ...state })
            newState.allSpots = action.payload
            return newState;
        case UPDATE_SPOT:
            newState = Object.assign({ ...state })
            newState.singleSpot = action.payload
            return newState;
        case DELETE_SPOT:
            newState = Object.assign({ ...state })
            delete newState.allSpots[action.payload]
            return newState;
        default: return state
    }
}

export default spotsReducer;