import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css';

function LoginForm() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [setShowErrors] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const errors = [];
        if (!credential) errors.push('Enter username or email.')
        if (!password) errors.push('Please enter a password.')

        setValidationErrors(errors)
    }, [credential, password])


    const handleSubmit = (e) => {
        e.preventDefault();
        setShowErrors(true)
        setValidationErrors([])
        return dispatch(sessionActions.login({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.message) setValidationErrors([data.message]);
                else setShowErrors(false)
            }
        );
    };

    const handleDemo = (e) => {
        e.preventDefault();
        setValidationErrors([]);
        return dispatch(sessionActions.login({ credential: 'demo@gmail.com', password: 'password' })).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) setValidationErrors(data.errors);
            }
        );
    };



    return (
        <>
        <form id="login-form" onSubmit={handleSubmit}>
            { validationErrors.length > 0 && submitted && (
                <ul>
                {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            )}
            <div id="modal-inner">
                <div id="log-pass-together">
                    <input
                        id="username"
                        placeholder='Username or Email'
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />

                    <input
                        id="password"
                        placeholder='Password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

            </div>

            <button id="continue" type="submit" onClick={() => setSubmitted(true)}>Continue</button>
            <button id="continue" onClick={handleDemo}>Demo User</button>
        </form>
        </>
    );
}

export default LoginForm;