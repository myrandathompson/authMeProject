import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './EditForm.css';

function EditForm() {
    const { spotId } = useParams();
    const allSpots = useSelector(state => state.spots.allSpots);
    const dispatch = useDispatch();
    const [priceError, setPriceError] = useState('');

    let spots, userSpots, currSpot, nameErrorText;

    const reset = () => {
        setCountry('');
        setStreetAddress('');
        setCity('');
        setAddressState('');
        setLatitude('');
        setLongitude('');
        setDescription('');
        setSpotName('');
        setPrice('');
        setErrors({});
        setPriceError('');
    };

    if (Object.values(allSpots).length) {
        spots = Object.values(allSpots);
        userSpots = spots[0];
        currSpot = userSpots.find(singleSpot => singleSpot.id === Number(spotId));
    }

    useEffect(() => {
        dispatch(spotActions.fetchSingleSpot(spotId));
    }, [dispatch, spotId]);

    const [country, setCountry] = useState(currSpot?.country || '');
    const [streetAddress, setStreetAddress] = useState(currSpot?.address || '');
    const [city, setCity] = useState(currSpot?.city || '');
    const [addressState, setAddressState] = useState(currSpot?.state || '');
    const [latitude, setLatitude] = useState(currSpot?.lat || '');
    const [longitude, setLongitude] = useState(currSpot?.lng || '');
    const [description, setDescription] = useState(currSpot?.description || '');
    const [spotName, setSpotName] = useState(currSpot?.name || '');
    const [price, setPrice] = useState(currSpot?.price || '');
    const [errors, setErrors] = useState({});

    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit called"); // Debugging log

        const validationErrors = {};

        if (!streetAddress.trim()) validationErrors.streetAddress = 'Address is required';
        if (!country.trim()) validationErrors.country = 'Country is required';
        if (!city.trim()) validationErrors.city = 'City is required';
        if (!addressState.trim()) validationErrors.state = 'State is required';
        if (description.length < 30) validationErrors.description = 'Description needs a minimum of 30 characters';
        if (!spotName.trim()) validationErrors.name = 'Name is required';
        if (isNaN(price) || !String(price).trim()) validationErrors.price = 'Price must be a valid number';

        if (Object.keys(validationErrors).length > 0) {
            console.log("Validation Errors: ", validationErrors); // Debugging log
            setErrors(validationErrors);
            return;
        }

        if (sessionUser && currSpot !== {}) {
            if (spotName.length >= 50) {
                nameErrorText = 'Name must be less than 50 characters';
            } else {
                nameErrorText = '';
            }

            const editedSpot = {
                country: country,
                address: streetAddress,
                city: city,
                state: addressState,
                lat: latitude,
                lng: longitude,
                description: description,
                name: spotName,
                price: price,
                ownerId: sessionUser.id
            };

            console.log("Attempting to update spot"); // Debugging log
            dispatch(spotActions.updateSpot(spotId, editedSpot))
                .then(() => {
                    reset();
                    history.push(`/spots/${spotId}`);
                })
                .catch(async res => {
                    const data = await res.json();
                    console.log("Backend Errors: ", data); // Debugging log
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        } else {
            setErrors({ user: 'You must be logged in to update a spot!' });
        }
    };

    return (
        <div id='create-spot-form-parent-div'>
            <h1 className='form-title-text'>Update your Spot</h1>
            <h2 className='form-section-header-text'>Where's your place located?</h2>
            <p className='form-section-desc-text'>Guests will only get your exact address once they book a reservation.</p>
            <form id='create-new-spot-form' onSubmit={handleSubmit}>
                    <div id='form-section-one'>
            <div id='section-one-country'>
                <label id='country-label' htmlFor='country'>Country</label>
            </div>
            <div>
                <input
                    type='text'
                    name='country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder='Country'
                    id='form-country-input'
                />
                {errors?.country && <p className='create-form-errors-text'>{errors.country}</p>}
            </div>
            <div id='section-one-streetAddress'>
                <label htmlFor='street-address'>Street Address</label>
            </div>
            <div>
                <input
                    type='text'
                    name='street-address'
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder='Address'
                    id='form-street-address-input'
                />
                {errors?.streetAddress && <p className='create-form-errors-text'>{errors.streetAddress}</p>}
            </div>
            <div id='city-state-labels'>
                <label id='city-label' htmlFor='city'>City</label>
                <label id='state-label' htmlFor='state'>State</label>
            </div>
            <div id='city-state-div'>
                <input
                    type='text'
                    name='city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='City'
                    id='city-input'
                />
                <span className='comma-span'> , </span>
                <input
                    type='text'
                    name='state'
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    placeholder='STATE'
                    id='state-input'
                />
            </div>
            <div id='city-state-error-div'>
                {errors?.city && <p className='create-form-errors-text'>{errors.city}</p>}
                {errors?.state && <p className='create-form-errors-text'>{errors.state}</p>}
            </div>
        </div>
                <div id='form-section-two'>
                    <h2 className='form-section-header-text'>Describe your place to guests</h2>
                    <p className='form-section-desc-text'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea
                        placeholder='Please write at least 30 characters'
                        name='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id='form-description-input'
                    />
                    {errors?.description && <p className='create-form-errors-text'>{errors.description}</p>}
                </div>
                <div id='form-section-three'>
                    <h2 className='form-section-header-text'>Create a title for your spot</h2>
                    <p className='form-section-desc-text'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        type='text'
                        placeholder='Name of your spot'
                        name='name'
                        value={spotName}
                        onChange={(e) => setSpotName(e.target.value)}
                        id='spot-name-input'
                    />
                    {nameErrorText}
                    {errors?.name && <p className='create-form-errors-text'>{errors.name}</p>}
                </div>
                <div id='form-section-four'>
                    <h2 className='form-section-header-text'>Set a base price for your spot</h2>
                    <p className='form-section-desc-text'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    $ <input
                        type='text'
                        placeholder='Price per night (USD)'
                        name='price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        id='spot-price-input'
                    />
                    {priceError && <p className='create-form-errors-text'>{priceError}</p>}
                    {errors?.price && <p className='create-form-errors-text'>{errors.price}</p>}
                </div>
                <button id='new-spot-form-submit-button' type='submit'>Update Your Spot</button>
                {errors.user && <p>{errors.user}</p>}
            </form>
        </div>
    );
}

export default EditForm;