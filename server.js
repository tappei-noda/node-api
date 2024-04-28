const express = require("express");
require('dotenv').config();
const fryiDayMovie = require("./routes/v1/friDayMovie")
const weatherNews = require("./routes/v1/weatherNews")
const googleChat = require("./routes/v1/chatGoogle")
const app = express()
const PORT = process.env.PORT
const version = "/v1"

app.use(express.json());
app.listen(PORT,() => console.log("servier is up"));
//googleChat.chatRun()
app.use(version + "/friDayMovie" , fryiDayMovie);
app.use(version + "/weatherNews" , weatherNews);
app.use(version + "/chatGoogle" , googleChat.chatRouter);

