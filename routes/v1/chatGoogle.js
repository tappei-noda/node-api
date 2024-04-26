const router  = require("express").Router();
const https = require('https');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API);
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const TO = process.env.LINE_CHANNEL_TOKEN;
const channelSecret = process.env.LINE_SERCRET_TOKEN; // Channel secret string

let chatLog = []
let chat = null;
let model = null;

router.post("/",(req, res) =>{
    if(authotization(req)){
      if(req.body.events[0].type === "message"){
        chatStart(req.body.events[0].message.text).then((result) => {
            const url = 'https://api.line.me/v2/bot/message/push'
            const dataString = JSON.stringify({
                // 応答トークンを定義
                replyToken: req.body.events[0].replyToken,
                to: TO,
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
                'Authorization': "Bearer " + TOKEN
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
    }else{
      console.log("Error access")
    }
} );

module.exports.chatRun = function() {
    // For text-only input, use the gemini-pro model
    model = genAI.getGenerativeModel({ model: "gemini-pro"});
    chat = model.startChat({
        history: chatLog,
        generationConfig: {
            maxOutputTokens: 100,
        },
    });
  }

  function authotization(request){
    const requestBody = request.body
    const header = request.headers['x-line-signature']
    const hash = crypto.createHmac('sha256', channelSecret)
                   .update(Buffer.from(JSON.stringify(requestBody)))
                   .digest();
    const signature = hash.toString('base64');
    if(header === signature){
        return true
    }else{
      return false
    }

  }

  async function chatStart(msg){
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    if(response.text() == ''){
        chat = model.startChat({
        history: chatLog,
        generationConfig: {
            maxOutputTokens: 100,
        },
    });
      return "その質問にはお答えできません。。。" 
    }else{
      return response.text();
    }
  }

module.exports.chatRouter = router;