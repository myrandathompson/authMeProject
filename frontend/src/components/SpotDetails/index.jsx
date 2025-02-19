import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots.js';
import * as reviewActions from '../../store/reviews.js';
import './SpotDetails.css';
import OpenModalButton from '../OpenModalButton/index.jsx';
import ReviewModal from '../ReviewModal/index.jsx';
import DeleteReviewModal from '../DeleteReviewModal/index.jsx';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [reviewsUpdated, setReviewsUpdated] = useState(false);
    const [haveSpot, setHaveSpot] = useState(false);

    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => state.reviews);
    const sessionUser = useSelector(state => state.session.user);

    let spotReviews = reviews.reviews.Reviews;

    const reviewCompare = (a, b) => {
        if (a.updatedAt > b.updatedAt) {
            return -1;
        }
        if (a.updatedAt < b.updatedAt) {
            return 1;
        }
        return 0;
    };

    let sortedReviews;

    if (spotReviews?.length) {
        sortedReviews = spotReviews.sort(reviewCompare);
    }

    // const ownerId = spot.ownerId;

    useEffect(() => {
        dispatch(spotActions.fetchSingleSpot(spotId)).then(() => setHaveSpot(true));
        dispatch(reviewActions.getReviewsBySpotId(spotId));
    }, [dispatch, spotId, reviewsUpdated]);

    let rating;
    let spotImgs;
    let reviewButton;

    let imgOne, imgTwo, imgThree, imgFour, imgFive;
    let ownerFirstName, ownerLastName;
    let numberReviews;

    if (haveSpot) {
        if (sessionUser) {
            if (sessionUser.id !== spot?.userId) {
                if (spot?.avgRating === 'NaN') {
                    rating = 'New';
                    reviewButton = (
                        <div id='review-button-parent-div'>
                            <OpenModalButton
                                id='review-modal-button'
                                className='modal-buttons'
                                buttonText='Post Your Review'
                                modalComponent={<ReviewModal spotId={spotId} />}
                            />
                            <p>Be the first to post a review!</p>
                        </div>
                    );
                } else {
                    rating = spot.avgRating;
                    if (!spotReviews?.find(review => review.userId === sessionUser.id)) {
                        reviewButton = (
                            <div id='review-button-parent-div'>
                                <OpenModalButton
                                    id='review-modal-button'
                                    className='modal-buttons'
                                    buttonText='Post Your Review'
                                    modalComponent={<ReviewModal spotId={spotId} />}
                                />
                            </div>
                        );
                    } else {
                        reviewButton = '';
                    }
                }
            }
        } else {
            reviewButton = '';
        }
    }

    if (spot) {
        spotImgs = spot.SpotImages;

        if (spotImgs && spotImgs[0]?.url) {
            imgOne = spotImgs[0].url;
        }
        if (spotImgs && spotImgs[1]?.url) {
            imgTwo = spotImgs[1].url;
        }
        if (spotImgs && spotImgs[2]?.url) {
            imgThree = spotImgs[2].url;
        }
        if (spotImgs && spotImgs[3]?.url) {
            imgFour = spotImgs[3].url;
        }
        if (spotImgs && spotImgs[4]?.url) {
            imgFive = spotImgs[4].url;
        }

        ownerFirstName = spot.Owner?.firstName;
        ownerLastName = spot.Owner?.lastName;

        if (spot.numReviews) {
            if (spot.numReviews === 1) {
                numberReviews = '· 1 review';
            } else if (spot.numReviews === 0) {
                numberReviews = '';
            } else {
                numberReviews = `· ${spot.numReviews} reviews`;
            }
        }
    }

    return (
        <>
            {spot && (
                <div id='spot-details-parent-div'>
                    <div id='title-div'>
                        <h1>{spot?.name}</h1>
                        <p>{spot?.city}, {spot?.state}, {spot?.country}</p>
                    </div>
                    <div id='spot-images-div'>
                        <div id='preview-img-div'>
                            <img id='preview-image-main' src={imgOne} alt='test spot preview' />
                        </div>
                        <div id='other-spot-images'>
                            <div id='optional-img-one'>
                                {imgTwo && <img className='other-spot-img' src={imgTwo} alt='preview two' />}
                            </div>
                            <div id='optional-img-two'>
                                {imgThree && <img className='other-spot-img' src={imgThree} alt='preview three' />}
                            </div>
                            <div id='optional-img-three'>
                                {imgFour && <img className='other-spot-img' src={imgFour} alt='preview four' />}
                            </div>
                            <div id='optional-img-four'>
                                {imgFive && <img id='optional-img-four' className='other-spot-img' src={imgFive} alt='preview five' />}
                            </div>
                        </div>
                    </div>
                    <div id='hosted-by-and-description'>
                    <div id='info-text'>
                        <h2>Hosted by {ownerFirstName} {ownerLastName}</h2>
                        <p>{spot.description}</p>
                    </div>
                    <div id='booking-and-price-div'>
                        <div id='cost-and-review-info'>
                            <div id='cost-per-night'>
                                <p>${spot.price}<span id='per-night'> night</span></p>
                            </div>
                            <div id='review-icon-and-rating'>
                                <i id='star-favicon' className="fa-solid fa-star" style={{color: "#000000"}}></i>  {rating} {numberReviews}
                            </div>
                        </div>
                        <div id='reserve-button'>
                            <button id='reserve-button-inner'
                            // onClick={() => bookingActive ? setBookingActive(false) : setBookingActive(true)}
                            onClick={() => alert('Feature coming soon.')}
                            >Reserve</button>
                        </div>
                    </div>
                </div>
                <div id='all-reviews-div'>
                    <div id='reviews-header-container'>
                    <i id='star-favicon' className="fa-solid fa-star fa-2xl" style={{color: "#000000"}}></i>
                    <span> {rating} {numberReviews}</span>
                    {reviewButton}
                    </div>
                    {sortedReviews && sortedReviews.map((review) => (
                        <div className='spotReview' key={review.id}>  {/* ✅ Add key prop */}
                            <h3 className='review-user-name'>{review.User.firstName}</h3>
                            <h3 className='review-month-year'>
                                {new Date(review.createdAt).toDateString().split(' ')[1]} {new Date(review.createdAt).toDateString().split(' ')[3]}
                            </h3>
                            <p className='review-inner-text'>{review.review}</p>
                            {(sessionUser && review.userId === sessionUser.id) ? (
                                <div id='delete-review-button-div'>
                                    <OpenModalButton
                                        buttonText='Delete'
                                        modalComponent={<DeleteReviewModal review={review} onReviewDeleted={() => setReviewsUpdated(prev => !prev)} />}
                                    />
                                </div>
                            ) : ''}
                        </div>
                    ))}

                </div>
            </div>
        )}
        </>
    )
}

export default SpotDetails;