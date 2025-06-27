const { Server } = require("socket.io");

var connections = {};
var messages = {};
var timeOnline = {};

const connectToSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    }
    );

    io.on("connection", (socket) => {

        socket.on("join-room", (roomId) => {
            console.log("New Socket in the room ", roomId, "And the Socket Id", socket.id);
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", socket.id); // emit this event to all the users expect itself
        });

        socket.on("offer", (data) => {
            const { to, offer } = data;
            socket.to(to).emit("offer", { from: socket.id, offer });
        });

        socket.on("answer", (data) => {
            const { to, answer } = data;
            socket.to(to).emit("answer", { from: socket.id, answer });
        })

        socket.on("IceCandidate", (data) => {
            const { from, to, candidate } = data
            socket.to(to).emit("IceCandidate", { from: socket.id, candidate });
        });

        socket.on("chat-message", (data) => {
            const { chatText, roomId } = data;
            console.log("The message is :", chatText, roomId, socket.id);
            socket.to(roomId).emit("chat-message", chatText);
        })
    })
}

module.exports = { connectToSocket };