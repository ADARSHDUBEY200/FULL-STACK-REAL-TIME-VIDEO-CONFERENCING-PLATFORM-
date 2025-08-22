const express = require("express");
const {createServer} = require("node:http");
const {connectToSocket} = require("./controllers/socketManger.js");
const aiRoutes = require("./routes/aiRoutes.js")
const userRoutes = require("./routes/userRoutes.js")
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { User } = require("./models/userModel.js");
require("dotenv").config();

const app = express();

const server = createServer(app);

const io = connectToSocket(server);

app.set("port",process.env.PORT || 3000);

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.use(cookieParser());

app.use("/api", aiRoutes);
app.use("/",userRoutes);

const url = process.env.MONGO_URL;

app.get("/Delete", async (req, res)=>{
  const response = await User.deleteMany({});
  console.log(response);
  return res.json("Deleted");
})

const start = async ()=>{
    server.listen(app.get("port"),(req,res)=>{
        console.log("NOW THE SERVER IS LISTENING ");
               
    });

    await mongoose.connect(url);
    console.log("✅ Connected to MongoDB");
};
start();

