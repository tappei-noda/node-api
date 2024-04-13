const router  = require("express").Router();
const axios = require("axios");
const { response } = require("express");

router.get("/",(req, res) =>{
    getTodayWeather().then((weatherInformation) => {
        res.set({ 'Access-Control-Allow-Origin': '*' });
        res.json(weatherInformation)
    }).catch((err) => {
        console.log(err)
    })
} );

async function getTodayWeather(){
    let weatherInformation = {date:"",locate:"",weather:"",tempertureMax:"",description:""}//日付、場所、天気、最高気温、説明
    try{
        const weather = await axios({
            method: 'get',
            url: 'https://weather.tsukumijima.net/api/forecast/city/140010',
            responseType: 'json'
        })
        weatherInformation.date = weather.data.forecasts[0].date
        weatherInformation.locate = weather.data.title
        weatherInformation.weather = weather.data.forecasts[0].telop
        weatherInformation.tempertureMax = weather.data.forecasts[1].temperature.max.celsius
        weatherInformation.description = weather.data.description.text
        console.log(weatherInformation)
    }catch(err){
        console.log(err)
    }
    return weatherInformation
}

module.exports = router;