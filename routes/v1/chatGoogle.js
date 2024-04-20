const router  = require("express").Router();
const line = require("@line/bot-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API);

let chatLog = []
let chat = null;

const line_config = {// 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_TOKEN // 環境変数からChannel Secretをセットしています
};

router.post("/",line.middleware(line_config),(req, res) =>{
    /*chatStart(req.body.message.text).then((result) =>{
        res.send(result)
    })*/
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