import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuid4 } from "uuid"
import "../styles/MeetingComponent.css";
import { Badge, IconButton, Drawer } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'

var Peerconnections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}


const Meeting = () => {


    const { id: roomId } = useParams();
    console.log("The room Id is : " + roomId);

    const localVideoRef = useRef(null);
    const socketRef = useRef();
    const socketIdRef = useRef();
    const [videos, setVideos] = useState([]);
    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState(false);
    const [chatText, setChatText] = useState("");
    let [mychat, setMyChat] = useState([]);
    // let [receivedChat , setReceivedChat] = useState([]);
    // console.log("The mychat array after the rerendering : ");
    // console.log(mychat);



    // =================== Process of the signalling ====================================================
    useEffect(() => {
        getMediaOfUser().then(() => {
            socketRef.current = io.connect("http://localhost:3000"); // when new socket is connected

            socketIdRef.current = socketRef.current.id

            socketRef.current.on("connect", () => {
                socketRef.current.emit("join-room", roomId);
            });

            socketRef.current.on("user-joined", handleNewUser);
            socketRef.current.on("offer", handleReceiveOffer);
            socketRef.current.on("answer", handleReceiveAnswer);
            socketRef.current.on("IceCandidate", handleIceCandidate);
            socketRef.current.on("chat-message", handleChats);


        });
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
        setVideo(!video);
        const videoTrack = window.locaStream.getVideoTracks()[0];
        console.dir(videoTrack);
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideo(videoTrack.enabled);
        }
    }

    const handleAudio = async () => {
        setAudio(!audio);
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

                // Show screen stream in local video (optional)
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
        console.log("handle endcall");
    }


    // ==================================================================================================

    // ============================== Handle the chat message ===========================================
    const handleChatMessage = (event) => {
        setMyChat((prev) => {
            return [...prev, chatText]
        })
        socketRef.current.emit("chat-message", { chatText, roomId });
    }
    const handleChats = (chatText) => {
        setMyChat((prev) => {
            return [...prev, chatText]
        })
        console.log(messages[roomId]);
    }
    // ==================================================================================================
    return (
        // <div className="meetVideoContainer">

        // <div className="buttonContainers">
        //     <IconButton onClick={handleVideo} style={{ color: "white" }}>
        //         {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
        //     </IconButton>
        //     <IconButton onClick={handleEndCall} style={{ color: "red" }}>
        //         <CallEndIcon />
        //     </IconButton>
        //     <IconButton onClick={handleAudio} style={{ color: "white" }}>
        //         {audio === true ? <MicIcon /> : <MicOffIcon />}
        //     </IconButton>


        //     <IconButton onClick={handleScreen} style={{ color: "white" }}>
        //         {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        //     </IconButton> : <></>

        //     <Badge badgeContent={3} max={999} color='orange'>
        //         <IconButton onClick={handleChatWindow} style={{ color: "white" }}>
        //             <ChatIcon />
        //         </IconButton>
        //     </Badge>

        // </div> 
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
                        <button style={{ background: 'linear-gradient(45deg, #ff4e50, #f9d423)' }}><i className="fa-solid fa-phone"></i></button>
                    </div>

                </div>


                <div className="sidebar">
                    <div className="card">
                        <h3>Participants</h3>
                        <div className="participants-list">
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=1" />Me</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=2" />Catherine</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=3" />Park Cho</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=4" />John</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=5" />Mary</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=6" />Ali</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=7" />Sara</div>
                            <div className="participant"><img src="https://i.pravatar.cc/30?img=8" />Daniel</div>
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