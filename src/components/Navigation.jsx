import './styles.css'
import { Link } from 'react-router-dom'

import { FaRocket } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";

export default function Navigation () {

    return (
        <div className="Navigation">
            <ul>
                <li>
                    <Link className='Link' to="/app">
                        <FaRocket className='icon' />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link className='Link' to="/auth/log-in">
                        <FaSignInAlt className='icon' />
                        Login
                    </Link>
                </li>
                <li>
                    <Link className='Link' to="/about">
                        <FaInfoCircle className='icon' />
                        About
                    </Link>
                </li>
            </ul>
        </div>
    )
}