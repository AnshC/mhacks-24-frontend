import './styles.css'

import { Link } from 'react-router-dom';

import Button from '../components/Button'
import Navigation from '../components/Navigation'

import { FaRocket } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";



export default function Landing() {
    return (
        <div className="Landing">
            <div className="nav">
                <Navigation />
            </div>
            <header>
                <div className="text white">
                    <h1>Health<span className='red'>Cloud</span></h1>
                    <p className='grey'>Your one stop website to access all your medical files within seconds, without having to search through them manually.</p>
                    <div className="buttons">
                        <Link to="/app"><Button mode="red" className='button'><FaRocket className='icon'/>Launch</Button></Link>
                        <Link to="/auth/sign-up"><Button mode="dark" className='button button-2'><FaSignInAlt className='icon'/>Sign Up</Button></Link>
                    </div>
                </div>
            </header>
            <main>
                
            </main>
        </div>
    )
}