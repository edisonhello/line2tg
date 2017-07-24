var config = require('./config.json')

var Linebot = require('linebot')
var express = require('express')
var app = express()

var port = config.port || 3000
app.listen(port, () => console.log('server is running at port', port))

var linebot = Linebot({
    channelId: config.channelID,
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
})
var linebotParser = linebot.parser()
app.post('/', linebotParser)

linebot.on('message', e => {
    console.log(e)
    if(e.message.type == 'text'){
        e.reply("妳不是要用來傳圖片的嗎(?").then(data => {}).catch(err => {
            throw err
        })
    }
    if(e.message.type == 'image'){
        e.message.content().then((a, b, c, d) => {
            console.log(a,b,c,d)
        })
    }
})
