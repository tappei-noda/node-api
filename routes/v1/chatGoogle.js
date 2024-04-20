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
        chatStart(req.body.events[0].messages.text).then((result) => {
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
            // リクエストヘッダー。仕様についてはMessaging APIリファレンスを参照してください。
            const headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer " + TOKEN,
            };

            const webhookOptions = {
                path: "/v2/bot/message/reply",
                method: "POST",
                headers: headers,
                body: dataString,
            };

            const request = https.request(webhookOptions, (res) => {
                res.on("data", (d) => {
                  process.stdout.write(d);
                });
              });
          
              // エラーをハンドリング
              // request.onは、APIサーバーへのリクエスト送信時に
              // エラーが発生した場合にコールバックされる関数です。
              request.on("error", (err) => {
                console.error(err);
              });
          
              // 最後に、定義したリクエストを送信
              request.write(dataString);
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