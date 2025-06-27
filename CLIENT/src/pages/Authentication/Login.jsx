import React, { useState } from 'react'
import {Link} from "react-router-dom"
import "../../styles/Authentication/Login.css"
const Login = ({func}) => {

    const changeToSignup = ()=>{
        func(true);
    }
    return (
        <form className="form-wrapper">
            <h2>LogIn</h2>
            <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" placeholder="Adarsh Dubey" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="adarsh@email.com" required />
            </div>
            <button type="submit">Send Message</button>
            <Link onClick = {changeToSignup}>Want to Signup</Link>
        </form>
    )
}

export default Login