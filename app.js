const config = require('./config.json')
const fs = require('fs')
const colors = require('colors')

const Linebot = require('linebot')
const tgbotapi = require('telegram-bot-api')
const express = require('express')
const app = express()

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

function writelog(e, a, b, c, d){
    let time = '['+(new Date()).toLocaleTimeString('en-US', { hour12: false })+']'
    let tag = '[' + e + ']'
    if(e == "NMSG") console.log(time.cyan, tag.green, 'from', b.magenta, '(', a, ')')
    else if(e == "INFO") console.log(time.cyan, tag.green, a)
    else if(e== "MSG") console.log(time.cyan, tag.green, a.magenta + ' : ' + b)
}

const port = config.port || 3000
app.listen(port, () => writelog('INFO', 'server is running at port ' + port))

linebot.on('message', e => {
    e.source.profile().then(prof => {
        let userID = e.source.userId
        let username = prof.displayName
        writelog('NMSG', userID, username)
        if(userID == config.ayane_lineID){
            if(e.message.type == 'text'){
                writelog('MSG', username, e.message.text)
                tgbot.sendMessage({
                    chat_id: config.self_tgID,
                    text: 'Message from ' + username + ':\n' + e.message.text
                })
            }
            if(e.message.type == 'image'){
                writelog('MSG', username, '[image]')
                const filename = new Date().toISOString().replace(/[-:]/g,'').replace('T','-').substr(0,15) + ':' + userID + '.jpg'
                e.message.content().then(pic64 => {
                    fs.writeFile(filename, pic64, 'binary', err => {
                        if(err) throw err
                        // tgbot.sendPhoto({
                        //     chat_id: config.self_tgID,
                        //     caption: 'Picture from ' + username,
                        //     photo: filename
                        // }).then(() => {
                        //     tgbot.sendPhoto({
                        //         chat_id: config.ayane_tgID,
                        //         photo: filename
                        //     }).then(data => {
                        //         writelog('INFO', 'Picture send.')
                        //     })
                        // })
                        tgbot.secdPhoto({
                            chat_id: config.ayane_tgID,
                            photo: filename
                        }).then(data => {
                            writelog('INFO', 'Picture send.')
                        })
                    })
                })
            }
            else{
                let msg = 'send a unknown message.'
                writelog('MSG', username, msg)
                tgbot.sendMessage({
                    chat_id: config.self_tgID,
                    text: username + msg
                })
            }
        }
        else if(userID == config.self_lineID){
            if(e.message.type == 'text'){
                writelog('MSG', username, e.message.text)
                tgbot.sendMessage({
                    chat_id: config.self_tgID,
                    text: 'Message from ' + username + ':\n' + e.message.text
                })
            }
            if(e.message.type == 'image'){
                const filename = new Date().toISOString().replace(/[-:]/g,'').replace('T','-').substr(0,15) + ':' + userID + '.jpg'
                writelog('MSG', username, '[image]')
                e.message.content().then(pic64 => {
                    fs.writeFile(filename, pic64, 'binary', err => {
                        if(err) throw err
                        tgbot.sendPhoto({
                            chat_id: config.self_tgID,
                            caption: 'Picture from myself',
                            photo: filename
                        }).then(() => {
                            writelog('INFO', 'Picture send.')
                        })
                    })
                })
            }
        }
        else{
            e.reply('Please contect edisonhello2 for more information.').then(data => {
                let msg = username + ' send a message' + ( e.message.type == 'text' ? ':\n' + e.message.text : '')
                writelog('MSG', msg)
                tgbot.sendMessage({
                    chat_id: config.self_tgID,
                    text: msg
                })
            })
        }
    })
})
tgbot.on('message', msg => {
    console.log(msg)
})
