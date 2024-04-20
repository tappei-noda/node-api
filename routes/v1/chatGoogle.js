const router  = require("express").Router();
const https = require('https');
const line = require("@line/bot-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API);
const TOKEN = process.env.LINE_ACCESS_TOKEN;

let chatLog = []
let chat = null;

router.post("/",(req, res) =>{
    if(req.body.events[0].type === "message"){
        chatStart(req.body.events[0].message.text).then((result) => {
            const url = 'https://api.line.me/v2/bot/message/push'
            const dataString = JSON.stringify({
                // 応答トークンを定義
                replyToken: req.body.events[0].replyToken,
                // 返信するメッセージを定義
                messages: [
                  {
                    type: "text",
                    text: result,
                  },
                ],
              });
              const headers = {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
              };
              
              // リクエストオプション
              const options = {
                method: 'POST',
                headers: headers
              };
              
              // HTTPSリクエストを作成
              const request = https.request(url, options, (res) => {
                console.log('Status Code:', res.statusCode);
              
                let responseBody = '';
                res.on('data', (chunk) => {
                  responseBody += chunk;
                });
              
                res.on('end', () => {
                  console.log('Response Body:', responseBody);
                });
              });
              
              request.on('error', (e) => {
                console.error('Error:', e);
              });
              
              // リクエストボディをリクエストに書き込み
              request.write(dataString);
              // リクエストを完了
              request.end();
        })
    }
} );

module.exports.chatRun = function() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    chat = model.startChat({
        history: chatLog,
        generationConfig: {
            maxOutputTokens: 100,
        },
    });
  }

  async function chatStart(msg){
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    console.log(response.text())
    return  response.text();
  }

module.exports.chatRouter = router;