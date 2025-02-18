// Import necessary libraries and components
import { useState } from 'react'
import * as sessionActions from '../../store/session.js'  // Import all actions from session
import { useDispatch } from 'react-redux'  // Import the useDispatch hook from react-redux
import { useModal } from '../../context/Modal.jsx'  // Import the useModal hook from the Modal context
import './LoginForm.css'  // Import the CSS styles for the login form

// Define a functional component called LoginFormModal
function LoginFormModal() {
    // Define state variables and their setters
    const dispatch = useDispatch()  // Allow for the dispatch of actions
    const [credential, setCredential] = useState('')  // State for the username/email field
    const [password, setPassword] = useState('')  // State for the password field
    const [errors, setErrors] = useState({})  // State for the errors
    const { closeModal } = useModal()  // Hook to close the modal

    // Define a function to handle the submission of the login form
    const handleSubmit = (e) => {
        e.preventDefault()  // Prevent the form from reloading the page
        setErrors({})  // Reset the errors state
        return dispatch(sessionActions.login({ credential, password }))  // Dispatch a login action with the form inputs
        .then(closeModal)  // Close the modal upon successful login
        .catch(async (res) => {  // Catch any errors from the login action
            const data = await res.json()  // Convert the response to JSON
            if(data && data.message) {  // If there are errors, set the errors state
                setErrors(data)
            }
        })
    }

    // Define a function to handle the demo login
    const handleDemoLogin = (e) => {
        e.preventDefault()  // Prevent the form from reloading the page
        return dispatch(sessionActions.login({ credential: 'authDemoUser2', password: 'password' }))  // Dispatch a login action with the demo user credentials
        .then(closeModal)  // Close the modal upon successful login
    }

    // Render the LoginFormModal component
    return (
        <>
            <div id='login-form-div'>
                <h1 id='login-text'>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div id='credential-div'>
                        <input
                            id='login-credential-input'
                            type='text'
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}  // Update the credential state when the input changes
                            required
                            placeholder='Username or Email'
                        />
                    </div>
                    <div id='password-div'>
                        <input
                            id='login-password-input'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}  // Update the password state when the input changes
                            required
                            placeholder='Password'
                        />
                    </div>
                    {errors.message && <p id='errors-display'>{errors.message}</p>}  {/* Display an error message if there is one */}
                    <div id='button-div'>
                        <button id='login-submit-button' type='submit' disabled={(credential.length >= 4 && password.length >= 6) ? false : true} onClick={handleSubmit}>Log In</button>  {/* Disable the button if the credential or password is too short */}
                    </div>
                </form>
                <button id='demo-user-button' onClick={handleDemoLogin}>Demo User</button>  {/* Button to login with the demo user */}
            </div>
        </>
    )
}

// Export the LoginFormModal component as the default export
export default LoginFormModal;