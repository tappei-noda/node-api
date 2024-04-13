const express = require("express");
require('dotenv').config();
const fryiDayMovie = require("./routes/v1/friDayMovie")
const weatherNews = require("./routes/v1/weatherNews")
const app = express()
const PORT = process.env.PORT
const version = "/v1"

app.use(express.json());
app.listen(PORT,() => console.log("servier is up"));
app.use(version + "/friDayMovie", fryiDayMovie);
app.use(version + "/weatherNews",weatherNews);
