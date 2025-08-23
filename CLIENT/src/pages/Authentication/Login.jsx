import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import "../../styles/Authentication/Login.css"
import axios from "axios";
const Login = ({ func }) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })



    const handleformData = (event) => {
        setFormData((prevData) => {
            return { ...prevData, [event.target.name]: event.target.value }
        })
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await axios.post("https://full-stack-real-time-video-conferencing.onrender.com/login", { ...formData }, {withCredentials : true});

        const { message, success } = response.data;

        console.log(message);
        console.log(success);

        if (success) {
            console.log("This is navigation called for video");
            navigate("/video");
        }
    }

    const changeToSignup = () => {
        func(true);
    }
    return (
        <form className="form-wrapper" onSubmit={handleLogin}>
            <h2>LogIn</h2>
            <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" placeholder="adarsh@email.com" required name="email" value={formData.email} onChange={handleformData} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Your Password</label>
                <input type="password" id="password"  required name="password" value={formData.password} onChange={handleformData} />
            </div>
            <button type="submit" >LogIn</button>
            <Link onClick={changeToSignup}>Want to Signup</Link>
        </form>
    )
}

export default Login