const router  = require("express").Router();
const { JSDOM } = require("jsdom");

router.get("/",(req, res) =>{
    getFyiDayMovieInformationOfThieWeek().then((information) => {
        res.set({ 'Access-Control-Allow-Origin': '*' });
        console.log(information)
        res.json({ date: information.date,title: information.title });
    });
} );

async function getFyiDayMovieInformationOfThieWeek(){
    const res = await fetch("https://kinro.ntv.co.jp/lineup");
    const body = await res.text(); // HTMLをテキストで取得
    const dom = new JSDOM(body); // パース
    const thisWeekInformation = dom.window.document.querySelector('section#after_lineup > .list > ul > li'); // JavaScriptと同じ書き方ができます。
    const thisWeekDate = thisWeekInformation.querySelector('.date').textContent
    const thisWeekTitle = thisWeekInformation.querySelector('.title > a').textContent
    return checkBroadcastDate(thisWeekDate,thisWeekTitle)
}

function checkBroadcastDate(dateString,titleString) {
    // dateStringは "YYYY.MM.DD放送" の形式と仮定する
    const broadcastDate = dateString.split('放送')[0]; // 日付部分を取得する
    // 今日の日付を取得する
    const today = new Date();
    const todayFormatted = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
    //const todayFormatted = "2024.4.26"
    // 今日の日付と比較する
    if (broadcastDate === todayFormatted) {
        return {date:broadcastDate, title:titleString}; // 日付が一致する場合
    } else {
        return {date:todayFormatted, title:broadcastDate}; // 日付が一致しない場合
    }
}


module.exports = router;