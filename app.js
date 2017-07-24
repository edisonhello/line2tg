const config = require('./config.json')
const fs = require('fs')

const Linebot = require('linebot')
const tgbotapi = require('telegram-bot-api')
const express = require('express')
const app = express()

const port = config.port || 3000
app.listen(port, () => console.log('server is running at port', port))

const linebot = Linebot({
    channelId: config.channelID,
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
})
const linebotParser = linebot.parser()
app.post('/', linebotParser)

const tgbot = new tgbotapi({
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
                tgbot.sendPhoto({
                    chat_id: 210802475,
                    caption: 'Picture from ' ,
                    photo: './newpic.jpg'
                }).then(data => {
                    console.log(data)
                })
            })
        })
    }
})
tgbot.on('message', msg => {
    console.log(msg)
})
