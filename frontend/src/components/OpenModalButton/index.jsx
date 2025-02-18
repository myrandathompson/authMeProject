// Import required libraries, hooks and styles
// import React from 'react'
import { useModal } from '../../context/Modal.jsx'
import './OpenModalButton.css'

// The OpenModalButton component
// This component takes four props:
// modalComponent: The component that will be rendered in the modal.
// buttonText: The text that will be displayed on the button.
// onButtonClick: A callback function that will be called when the button is clicked.
// onModalClose: A callback function that will be called when the modal is closed.
function OpenModalButton({
    modalComponent,
    buttonText,
    onButtonClick,
    onModalClose
}) {
    // Use the useModal hook to get the setModalContent and setOnModalClose functions
    const { setModalContent, setOnModalClose } = useModal()

    // Function to handle button click
    const onClick = () => {
        // If onButtonClick is a function, call it
        if(typeof onButtonClick === 'function') onButtonClick()
        // If onModalClose is a function, set it as the modal's onClose callback
        if(typeof onModalClose === 'function') setOnModalClose(onModalClose)
        // Set the modal content to the provided modalComponent
        setModalContent(modalComponent)
    }

    // Return the button element
    return <button className='modal-buttons' onClick={onClick}>{buttonText}</button>
}

// Export the OpenModalButton component so it can be used in other parts of our app
export default OpenModalButton;