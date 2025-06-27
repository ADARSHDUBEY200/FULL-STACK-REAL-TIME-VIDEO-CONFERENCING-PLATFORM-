import React, { useState } from 'react'
import {Link} from "react-router-dom"
import "../../styles/Authentication/Signup.css"

const Signup = ({func}) => {
    
        const changeToLogin = ()=>{
            func(false);
        }
    return (
        <form className="form-wrapper">
            <h2>SignUp</h2>
            <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" placeholder="Adarsh Dubey" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="adarsh@email.com" required />
            </div>
            <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <input type="password" id="password" required />
            </div>
            <button type="submit">Send Message 🚀</button>
            <Link onClick={changeToLogin}>Want to Login</Link>
        </form>
    )
}

export default Signup