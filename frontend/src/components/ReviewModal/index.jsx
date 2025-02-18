import './ReviewModal.css'
import { useState } from 'react'
import * as reviewActions from '../../store/reviews.js'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal.jsx'


function ReviewModal({ spotId }) {
    const dispatch = useDispatch()
    const [review, setReview] = useState('')
    const [stars, setStars] = useState('')
    const [errors, setErrors] = useState({})
    const [fillOne, setFillOne] = useState('regular')
    const [fillTwo, setFillTwo] = useState('regular')
    const [fillThree, setFillThree] = useState('regular')
    const [fillFour, setFillFour] = useState('regular')
    const [fillFive, setFillFive] = useState('regular')
    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        const newReview = {
            review: review,
            stars: stars
        }
        await dispatch(reviewActions.createNewReview(spotId, newReview))
        dispatch(reviewActions.getReviewsBySpotId(spotId)) // Fetch the reviews again
            .then(closeModal)
            .catch(async res => {
                const data = await res.json()
                if(data && data.errors) {
                    setErrors(data)
                }
            })
    }

    return(
        <div id='review-modal-parent-div'>
            <div id='review-modal-form-div'>
                <h1 id='review-form-modal-title'>How was your stay?</h1>
                {errors.errors && <p>{errors.errors}</p>}
                <form id='new-review-modal-form' onSubmit={handleSubmit}>
                    <div id='review-textarea-div'>
                        <input
                        type='textarea'
                        name='review'
                        id='review-textarea-input'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Leave your review here...'
                        />
                    </div>
                    <div id='review-modal-stars-div'>
                        <i id='star-num-one' onClick={() => {
                                setStars(1)
                                setFillOne('solid')
                                setFillTwo('regular')
                                setFillThree('regular')
                                setFillFour('regular')
                                setFillFive('regular')
                            }}
                            className={`fa-${fillOne} fa-star fa-lg`} style={{color: '#000000'}}></i>
                        <i id='star-num-two' onClick={() => {
                                setStars(2)
                                setFillOne('solid')
                                setFillTwo('solid')
                                setFillThree('regular')
                                setFillFour('regular')
                                setFillFive('regular')
                            }}
                            className={`fa-${fillTwo} fa-star fa-lg`} style={{color: '#000000'}}></i>
                        <i id='star-num-three' onClick={() => {
                                setStars(3)
                                setFillOne('solid')
                                setFillTwo('solid')
                                setFillThree('solid')
                                setFillFour('regular')
                                setFillFive('regular')
                            }}
                            className={`fa-${fillThree} fa-star fa-lg`} style={{color: '#000000'}}></i>
                        <i id='star-num-four' onClick={() => {
                                    setStars(4)
                                    setFillOne('solid')
                                    setFillTwo('solid')
                                    setFillThree('solid')
                                    setFillFour('solid')
                                    setFillFive('regular')
                            }}
                            className={`fa-${fillFour} fa-star fa-lg`} style={{color: '#000000'}}></i>
                        <i id='star-num-five' onClick={() => {
                                    setStars(5)
                                    setFillOne('solid')
                                    setFillTwo('solid')
                                    setFillThree('solid')
                                    setFillFour('solid')
                                    setFillFive('solid')
                            }}
                            className={`fa-${fillFive} fa-star fa-lg`} style={{color: '#000000'}}></i>
                        <span id='review-stars-text-span'>Stars</span>
                    </div>
                    <div id='review-submit-button-div'>
                        <button type='submit' id='submit-new-review-button' onClick={handleSubmit} disabled={review.length >= 10 && stars !== '' ? false : true}>Submit Your Review</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReviewModal;