import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import "../styles/MeetingComponent.css";
import axios from "axios"
import Cookies from "js-cookie"
import VideocamOffIcon from '@mui/icons-material/VideocamOff'


var Peerconnections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}


const Meeting = () => {


    const { id: roomId } = useParams();
    console.log("The room Id is : " + roomId);
    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const socketRef = useRef();
    const socketIdRef = useRef();
    const [videos, setVideos] = useState([]);
    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState(false);
    const [chatText, setChatText] = useState("");
    let [mychat, setMyChat] = useState([]);
    let [participants, setParticipants] = useState([]);
    const [aiChatWindow, setAiChatWindow] = useState(false);
    const [aichatText, setAiChatText] = useState("");
    const [aichats, setAichats] = useState([]);


// =================== Process of the signalling ====================================================
    useEffect(() => {

        const verifyUser = async () => {
            const token = Cookies.get("token");

            if (!token) {
                navigate("https://full-stack-real-time-video-conferencing-5r1k.onrender.com/signup");
            }
            const response = await axios.post("https://full-stack-real-time-video-conferencing.onrender.com/video", {}, {withCredentials : true});
            const {status} = response.data;

            if (status) {
                getMediaOfUser().then(() => {
                    socketRef.current = io.connect("https://full-stack-real-time-video-conferencing.onrender.com"); // when new socket is connected

                    socketIdRef.current = socketRef.current.id

                    socketRef.current.on("connect", () => {
                        socketRef.current.emit("join-room", roomId);
                    });

                    socketRef.current.on("user-joined", handleNewUser);
                    socketRef.current.on("offer", handleReceiveOffer);
                    socketRef.current.on("answer", handleReceiveAnswer);
                    socketRef.current.on("IceCandidate", handleIceCandidate);
                    socketRef.current.on("call-ended", handleRemoteUserEndCall)
                    socketRef.current.on("chat-message", handleChats);
                    socketRef.current.on("existing-message", handleExistingMessage);
                    socketRef.current.on("participants", handleParticipants);

                });
            } else {
                navigate("https://full-stack-real-time-video-conferencing-5r1k.onrender.com/signup");
            }
        }

        verifyUser();

    }, []);

    const getMediaOfUser = async () => {
        const Media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = Media
            window.locaStream = Media
        }
    }

    const handleNewUser = async (userId) => {
        console.log("HandleUser function is called")
        const peer = new RTCPeerConnection(peerConfigConnections); // make the peer connection
        Peerconnections[userId] = peer;
        console.log(Peerconnections);

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit("IceCandidate", { to: userId, candidate: event.candidate });
            }
        }

        peer.ontrack = (event) => {
            setVideos((prevVideos) => {
                const exists = prevVideos.some(v => v.Id === userId);
                if (exists) return prevVideos;
                return [...prevVideos, { Id: userId, stream: event.streams[0] }]
            })

            // event.streams[0].getTracks().forEach((track) => track.onended = () => {
            //     console.log("Remote track ended");
            //     socketRef.current.emit("end-call", { roomId, from: socketRef.current.id });
            //     setVideos((prevVideos) =>
            //         prevVideos.filter((video) => video.Id !== userId)
            //     );

            //     if (Peerconnections[userId]) {
            //         Peerconnections[userId].close();
            //         delete Peerconnections[userId];
            //     }
            // })


        }

        // Adding of the local Tracks 
        window.locaStream.getTracks().forEach((track) => {
            peer.addTrack(track, window.locaStream);
        });

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socketRef.current.emit("offer", {
            to: userId,
            offer,
        });

    }

    const handleReceiveOffer = async (data) => {
        const { from, offer } = data;
        console.dir("The offer is :", offer);

        const peer = new RTCPeerConnection(peerConfigConnections);
        Peerconnections[from] = peer;

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit("IceCandidate", { to: from, candidate: event.candidate })
            }
        }

        peer.ontrack = (event) => {
            setVideos((prevVideos) => {
                const exists = prevVideos.some(v => v.Id === from);
                if (exists) return prevVideos;
                return [...prevVideos, { Id: from, stream: event.streams[0] }]
            })
        }

        window.locaStream.getTracks().forEach((track) => {
            peer.addTrack(track, window.locaStream);
        });

        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socketRef.current.emit("answer", { to: from, answer });
    }


    const handleReceiveAnswer = async (data) => {
        const { from, answer } = data;
        console.dir("The answer is : ", answer);
        const peer = Peerconnections[from];
        peer.setRemoteDescription(new RTCSessionDescription(answer));
    }

    const handleIceCandidate = async (data) => {
        const { from, candidate } = data;
        const peer = Peerconnections[from];
        if (peer && candidate) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }
// ==================================================================================================

// ===================================Toggle of the Meadia ==========================================

    const handleVideo = () => {
        const videoTrack = window.locaStream.getVideoTracks()[0];
        console.dir(videoTrack);
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideo(videoTrack.enabled);
        }
    }

    const handleAudio = async () => {
        const audioTrack = window.locaStream.getAudioTracks()[0];
        console.dir(audioTrack);
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setAudio(audioTrack.enabled);
        }
    }
// ==================================================================================================
    
    const handleScreen = async () => {
        if (!screen) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];
                Object.values(Peerconnections).forEach((peer) => {
                    const sender = peer.getSenders().find(
                        (s) => s.track.kind === 'video'
                    );
                    if (sender) {
                        sender.replaceTrack(screenTrack);
                    }
                });

                // Show screen stream in local video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }

                setScreen(true); // set screen sharing state

                // When user stops screen sharing
                screenTrack.onended = () => {
                    stopScreenShare();
                };
            } catch (error) {
                console.log("The error during the Screen Sharing :", error)
            }
        } else {
            stopScreenShare(); // toggle off
        }
    }

    const stopScreenShare = () => {
        const videoTrack = window.locaStream.getVideoTracks()[0];

        // Replace screen track with webcam track
        Object.values(Peerconnections).forEach((peer) => {
            const sender = peer.getSenders().find(
                (s) => s.track.kind === 'video'
            );
            if (sender) {
                sender.replaceTrack(videoTrack);
            }
        });

        // Restore local video preview
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = window.locaStream;
        }

        setScreen(false); // update screen sharing state
    }

// ==================================================================================================
    
    const handleEndCall = async () => {
        //Sending message to the other users for the endcall
        socketRef.current.emit("end-call", { roomId, from: socketRef.current.id });

        // Close all peer connections
        Object.values(Peerconnections).forEach(peer => {
            peer.close();
        });

        // Clear peer connections
        for (let id in Peerconnections) {
            delete Peerconnections[id];
        }

        // Stop all local media tracks
        if (window.locaStream) {
            window.locaStream.getTracks().forEach((track) => track.stop());
        }

        // Optional: Clear video streams from UI
        setVideos([]);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        // Disconnect socket
        socketRef.current.disconnect();

        // Now we navigate the user again on the home page 
        navigate("https://full-stack-real-time-video-conferencing-5r1k.onrender.com/")

    }

    const handleRemoteUserEndCall = (data) => {
        const { from } = data;
        console.log(`User ${from} has ended the call`);
        console.log("handleRemoteUserEndCall is called");

        // Close peer connection with that user
        if (Peerconnections[from]) {
            Peerconnections[from].close();
            delete Peerconnections[from];
        }

        // Remove that user's video stream
        setVideos((prevVideos) =>
            prevVideos.filter((video) => video.Id !== from)
        );
    }


// ==================================================================================================

// ============================== Handle the chat message ===========================================
    
    const handleChatMessage = (event) => {
        setMyChat((prev) => {
            return [...prev, chatText]
        })
        socketRef.current.emit("chat-message", { chatText, roomId });
    };

    const handleChats = (chatText) => {
        setMyChat((prev) => {
            return [...prev, chatText]
        })
        console.log(messages[roomId]);
    };

    const handleExistingMessage = (data) => {
        console.log("THE DATA IS COMING IN THIS IS ")
        console.log(data)
        console.log("THE HANDLE EXISTING MESSAGES IS ALSO CALLED");
        setMyChat((prev) => {
            return [...prev, ...data];
        })
    };

// ==================================================================================================

    const handleParticipants = (data) => {
        console.log("THE PARTICIPANTS IS CALLED");
        console.log(data);
        setParticipants((prev) => {
            return [...prev, ...data];
        })
    }

    const handleAiChatWindow = () => {

        setAiChatWindow(!aiChatWindow);
    }

    const handleAiChat = async () => {
        const prompt = aichatText;
        const response = await axios.post("https://full-stack-real-time-video-conferencing.onrender.com/api/ai", { prompt });

        console.log("The response of the ai is : ");
        console.log(response.data);

        setAichats((prevChats) => {
            return [...prevChats, prompt, response.data];
        })
    }
    return (

        <div className='Meeting-main-container'>

            <div className="Meeting-container">
                <div className="Video-main-content">
                    <div className="main-speaker">
                        <video ref={localVideoRef} autoPlay ></video>
                    </div>
                    {videos.length != 0 ? (
                        <>
                            <div className="video-participants">
                                {
                                    videos.map((video) => (
                                        <div className='video-box' key={video.Id}>
                                            <video
                                                data-socket={video.Id}
                                                ref={ref => {
                                                    if (ref && video.stream) {
                                                        ref.srcObject = video.stream;
                                                    }
                                                }}
                                                autoPlay
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    ) : (<>
                        <div className='video-participants' style={{ visibility: "hidden" }}></div>
                    </>
                    )}


                    <div className="controls">
                        <button onClick={handleAudio}>
                            {audio ? <><i className="fa-solid fa-microphone"></i></> : <i className="fa-solid fa-microphone-slash"></i>}
                        </button>
                        <button onClick={handleVideo}>
                            {video ? <><i className="fa-duotone fa-solid fa-camera"></i></> : <><VideocamOffIcon sx={{ fontSize: 15 }} /></>}
                        </button>
                        <button onClick={handleScreen}>🖥️</button>
                        <button onClick={handleEndCall} style={{ background: 'linear-gradient(45deg, #ff4e50, #f9d423)' }}><i className="fa-solid fa-phone"></i></button>

                        <div className='profile' >
                            <div className='content'>
                                <button onClick={handleAiChatWindow}><i class="fa-solid fa-wand-magic-sparkles"></i></button>
                            </div>
                            {aiChatWindow == true ? <>
                                <div class="dropdown-content">

                                    <h3>Chat</h3>
                                    {aichats.length === 0 ? (
                                        <p style={{ padding: "2rem 0 2rem", textAlign: "center" }}>No chat messages</p>
                                    ) : (
                                        <>
                                            <div className='whole-message'>
                                                {aichats.map((chat, index) => (
                                                    <div className='chat-message' key={index}><p>{chat}</p></div>
                                                ))}
                                            </div>
                                        </>
                                    )}


                                    <div className='aichatBox'>
                                        <input type="text" placeholder="Write you chat" value={aichatText} onChange={(e) => {
                                            setAiChatText(e.target.value);
                                            console.log("The value of the chat is ", e.target.value);
                                        }} />
                                        <button onClick={handleAiChat}><i className="fa-solid fa-paper-plane"></i></button>
                                    </div>

                                </div>
                            </> : <></>}
                        </div>
                    </div>

                </div>


                <div className="sidebar">
                    <div className="card">
                        <h3>Participants</h3>
                        <div className="participants-list">

                            {participants.map((participant) => {
                                return <div className="participant"><img src="https://i.pravatar.cc/30?img=1" />{participant}</div>
                            })}
                        </div>
                    </div>

                    <div className="cardChat">
                        <h3>Chat</h3>
                        {mychat.length === 0 ? (
                            <p style={{ padding: "2rem 0 2rem", textAlign: "center" }}>No chat messages</p>
                        ) : (
                            <>
                                <div className='whole-message'>
                                    {mychat.map((chat, index) => (
                                        <div className='chat-message' key={index}><p>{chat}</p></div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className='chatBox'>
                            <input type="text" placeholder="Write you chat" value={chatText} onChange={(e) => {
                                setChatText(e.target.value);
                                console.log("The value of the chat is ", e.target.value);
                            }} />
                            <button onClick={handleChatMessage}><i className="fa-solid fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>

            </div>



        </div>

    )
}
export default Meeting