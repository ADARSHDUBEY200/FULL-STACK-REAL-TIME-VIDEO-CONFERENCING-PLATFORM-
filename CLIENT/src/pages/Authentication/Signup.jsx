import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import "../../styles/Authentication/Signup.css"

const Signup = ({ func }) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email : "",
        password: "",
    })



    const handleformData = (event) => {
        setFormData((prevData) => {
            return { ...prevData, [event.target.name]: event.target.value }
        })
    }

    const handleLogin = async (event) => {

        event.preventDefault();
        const response = await axios.post("https://full-stack-real-time-video-conferencing.onrender.com/signup", { ...formData }, {withCredentials: true})
        console.log(response);
        const { message, success , user} = response.data;
        console.log(message);
        console.log(success);
        console.log(user)

        if (success) {
            navigate("https://full-stack-real-time-video-conferencing-5r1k.onrender.com/video");
        }
    }

    const changeToLogin = () => {
        func(false);
    }
    return (
        <form className="form-wrapper" onSubmit={handleLogin}>
            <h2>SignUp</h2>
            <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" placeholder="Adarsh Dubey" required name="name" value={formData.name} onChange={handleformData}/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="adarsh@email.com" required name="email" value={formData.email} onChange={handleformData}/>
            </div>
            <div className="form-group">
                <label htmlFor="message">Your Password</label>
                <input type="password" id="password" required name="password" value={formData.password} onChange={handleformData}/>
            </div>
            <button type="submit">SignUp 🚀</button>
            <Link onClick={changeToLogin}>Want to Login</Link>
        </form>
    )
}

export default Signup