var config = require('./config.json')
var fs = require('fs')

var Linebot = require('linebot')
var tgbotapi = require('telegram-bot-api')
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

var tgbot = new tgbotapi({
    token: config.token,
    updates: {
        enabled: true
    }
})

linebot.on('message', e => {
    console.log(e)
    if(e.message.type == 'text'){
        e.reply("妳不是要用來傳圖片的嗎(?").then(data => {}).catch(err => {
            throw err
        })
    }
    if(e.message.type == 'image'){
        e.message.content().then(pic64 => {
            fs.writeFile('newpic.jpg', pic64, 'binary', err => {
                if(err) throw err
            })
        })
    }
})
tgbot.on('message', msg => {
    console.log(msg)
})
