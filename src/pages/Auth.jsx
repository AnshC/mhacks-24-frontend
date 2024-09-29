import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Button from "../components/Button";
import  { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Auth () {

    const [authMode, setAuthMode] = useState({
        state: 0,
        modeText: 'Sign Up',
        description: 'Create an Account and manage your medical files today.',
    })

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { mode } = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if (mode === "sign-up") {
            setAuthMode({
                state: 0,
                modeText: 'Sign Up.',
                description: 'Create an Account and manage your medical files today.',
                button: 'Create Account'
            })
        } else if (mode === "log-in") {
            setAuthMode({
                state: 1,
                modeText: 'Sign In.',
                description: 'Welcome back, sign in to your account to view your records.',
                button: 'Login'
            })
        }
    }, [mode])

    function authUser() {
        if (authMode.state === 0) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user);
                navigate('/app')
                // ...
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
                // ..
            });
        } else {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                navigate('/app')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        }
    }

    return (
        <div className="Auth">
            <div className="form">
                <div className="main">
                    <h1 id="main">Health<span className='red'>Cloud</span></h1>
                    <h1>{authMode.modeText}</h1>
                    <p>{authMode.description}</p>
                    <div className="fields">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" placeholder="your@email.com" onChange={e => setEmail(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="daddy" onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <div className="buttons">
                        <Button mode='red' className='button' onClick={authUser}>
                            {authMode.button}
                        </Button>
                        {authMode.state === 1 ? 
                        <Link to="/auth/sign-up">
                            <Button mode='light-red' className='button' id='button-alt'>
                                Sign Up
                            </Button>
                        </Link>
                        : <Link to="/auth/log-in">
                            <Button mode='light-red' className='button' id='button-alt'>
                                Log In
                            </Button>
                        </Link>}
                    </div>
                </div>     
            </div>
        </div>
    )
}