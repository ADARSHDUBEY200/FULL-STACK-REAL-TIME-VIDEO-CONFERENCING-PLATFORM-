import React, { useEffect, useRef, useState } from 'react'
import "../styles/VideoComponent.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const CreateComponent = () => {

    console.log("We are IN the video component");

    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const [emailId, setEmailId] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const verifyUser = async () => {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/video`, {}, { withCredentials: true });
            const { status } = response.data;

            if (status) {
                lobbyUserMedia();
            } else {
                navigate("/login");
            }
        }

        verifyUser();

    }, []);

    const lobbyUserMedia = async () => {

        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            window.locaStream = stream;
        }

    }


    const connect = () => {
        navigate(`/video/${MeetingId}`);
    };


    return (
        <div className='main-container'>
            <h1>Create Your Room Lobby!</h1>

            <div className="container">
                <div className='video-container'>
                    <video ref={localVideoRef} autoPlay></video>
                </div>

                <div className="form-area">
                    <input type="text" placeholder="Enter your Name" value={username} onChange={e => { setMeetingId(e.target.value) }} />
                    <input type="email" placeholder="Enter Email ID" value={emailId} onChange={e => { setMeetingId(e.target.value) }} />
                    <button onClick={connect}>Get Meeting Id And Enter In Room</button>

                </div>
            </div>

        </div>
    )
}




export default CreateComponent