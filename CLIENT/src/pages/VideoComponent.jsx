import React, {useEffect, useRef, useState } from 'react'
import "../styles/VideoComponent.css";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"
import axios from "axios";

const VideoComponent = () => {

    console.log("We are IN the video component");

    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const [MeetingId, setMeetingId] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const verifyUser = async () => {
            const token = Cookies.get("token");

            // await new Promise(resolve => setTimeout(resolve, 5000));

            if (!token) {
                navigate("/signup");
            }
            const response = await axios.post("https://full-stack-real-time-video-conferencing.onrender.com/video", {}, {withCredentials : true});
            const {status} = response.data;

            if (status) {
                lobbyUserMedia();
            } else {
                navigate("/signup");
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
            <h1>Welcome To The Lobby!</h1>

            <div className="container">
                <div className='video-container'>
                    <video ref={localVideoRef} autoPlay></video>
                </div>

                <div className="form-area">
                    <input type="text" placeholder="Enter Meeting ID" value={MeetingId} onChange={e => { setMeetingId(e.target.value) }} />
                    <input type="text" placeholder="Enter Username" value={username} onChange={e => { setUsername(e.target.value) }} />
                    <button onClick={connect}>Join Now</button>
                    <button>Create Room</button>
                </div>
            </div>

        </div>
    )
}




export default VideoComponent