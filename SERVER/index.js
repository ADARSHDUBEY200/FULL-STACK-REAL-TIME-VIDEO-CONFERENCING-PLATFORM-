const express = require("express");
const {createServer} = require("node:http");
const {connectToSocket} = require("./controllers/socketManger.js");
const cors = require("cors");

const app = express();

const server = createServer(app);

const io = connectToSocket(server);

app.set("port",process.env.PORT || 3000);

app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));

const start = async ()=>{
    server.listen(app.get("port"),(req,res)=>{
        console.log("NOW THE SERVER IS LISTENING ")
    });
};
start();

