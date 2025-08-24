const { Server } = require("socket.io");

var connections = {};
var messages = {};
var participants = {};
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

        socket.on("join-room", (data) => {
            const { roomId, user } = data;
            console.log(user);
            socket.join(roomId);
            connections[socket.id] = roomId;
            socket.to(roomId).emit("user-joined", socket.id); // emit this event to all the users expect itself
            if (messages[roomId]) {
                io.to(socket.id).emit("existing-message", messages[roomId]);
            }

            if (!participants[roomId]) {
                participants[roomId] = [];
            }

            participants[roomId].push({[socket.id] : user});
            console.log("the participants before the disconnections is : ");
            console.log(participants[roomId]);
            io.to(roomId).emit("participants", participants[roomId]);
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
            const { to, candidate } = data
            socket.to(to).emit("IceCandidate", { from: socket.id, candidate });
        });

        socket.on("end-call", ({ roomId, from }) => {
            console.log(`Call ended by ${from} in room ${roomId}`);
            // Inform others in the room
            socket.to(roomId).emit("call-ended", { from });
        });

        socket.on("chat-message", (data) => {
            const { chatText, roomId } = data;
            console.log("The message is :", chatText, roomId, socket.id);
            if (!messages[roomId]) {
                messages[roomId] = [];
            };

            messages[roomId].push(chatText);
            console.log(messages);
            socket.to(roomId).emit("chat-message", chatText);
        })


        socket.on("disconnect", () => {
            console.log("The user is disconnected " + connections[socket.id] + "The socket.id " + socket.id);
            participants[connections[socket.id]] = participants[connections[socket.id]].filter((participant) => {
                return !participant[socket.id];
            });

            console.log("THE PARTICIPANTS AFTER THE DISCONNECTION IS" + socket.id);
            console.log(participants[connections[socket.id]]);

            socket.to(connections[socket.id]).emit("call-ended", { from: socket.id });
            io.to(connections[socket.id]).emit("participants", participants[connections[socket.id]]);
        });
    })
}

module.exports = { connectToSocket };