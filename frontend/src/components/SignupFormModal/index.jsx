import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';
import * as sessionActions from '../../store/session.js';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            setErrors({});

            try {
                await dispatch(sessionActions.signup({ email, username, firstName, lastName, password }));
                closeModal();
            } catch (res) {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            }
        } else {
            setErrors({ confirmPassword: "Confirm Password field must be the same as the Password field" });
        }
    };

    return (
        <div id='signup-form-div'>
            <h1 id='signup-text'>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div id='email-div'>
                    <input
                        id='email-input-field'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Email'
                    />
                    {errors.email && <p id='email-errors-display'>{errors.email}</p>}
                </div>
                <div id='username-div'>
                    <input
                        id='username-input-field'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder='Username'
                    />
                    {errors.username && <p id='username-errors-display'>{errors.username}</p>}
                </div>
                <div id='firstName-div'>
                    <input
                        id='firstName-input-field'
                        type='text'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder='First Name'
                    />
                    {errors.firstName && <p id='firstName-errors-display'>{errors.firstName}</p>}
                </div>
                <div id='lastName-div'>
                    <input
                        id='lastName-input-field'
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='Last Name'
                        required
                    />
                    {errors.lastName && <p id='lastName-errors-display'>{errors.lastName}</p>}
                </div>
                <div id='password-div'>
                    <input
                        id='password-input-field'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Password'
                    />
                    {errors.password && <p id='password-errors-display'>{errors.password}</p>}
                </div>
                <div id='confirmPassword-div'>
                    <input
                        id='confirmPassword-input-field'
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder='Confirm Password'
                    />
                    {errors.confirmPassword && <p id='confirmPassword-errors-display'>{errors.confirmPassword}</p>}
                </div>
                <div id='signup-button-div'>
                    <button 
                        id='signup-submit-button' 
                        type='submit' 
                        disabled={
                            !email || 
                            !username || 
                            !firstName || 
                            !lastName || 
                            !password || 
                            !confirmPassword || 
                            username.length < 4 || 
                            password.length < 6
                        }>
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignupFormModal;