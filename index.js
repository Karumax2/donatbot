const axios = require('axios');
const discord = require('discord.js');
const config =require('./config.json')
const { Client, Intents } = require('discord.js');

const client = new Client(
    {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_WEBHOOKS,
        ]
    }
);

client.on('ready', async(bot) =>{
    console.log("Bot On")
    client.user.setActivity('with by Karuma Service', { type: 'PLAYING' });
})

function errorEmbed(text) {
    return new discord.MessageEmbed()
      .setTitle(client.user.tag)
      .setAuthor('TrueWallet VoucherTopup', client.user.avatarURL({ size: 256 }))
      .setColor('#ff0000')
      .setDescription(text)
      .setTimestamp();
    
  }
  
  function checkEmbed(text) {
    return new discord.MessageEmbed()
      .setTitle(client.user.tag)
      .setAuthor('TrueWallet VoucherTopup', client.user.avatarURL({ size: 256 }))
      .setColor('#ffc800')
      .setDescription(text)
      .setTimestamp();
  }
  
  function successEmbed(text) {
    return new discord.MessageEmbed()
      .setTitle(client.user.tag)
      .setAuthor('TrueWallet VoucherTopup', client.user.avatarURL({ size: 256 }))
      .setColor('#64ff00')
      .setDescription(text)
      .setTimestamp();
  }

client.on('messageCreate',async(message)=>{
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "donate") {
        message.channel.send({ embeds: [checkEmbed('กรุณารอสักครู่ ระบบกำลังตรวจสอบ ⚠')]}).then(async (m) => {
            if (args[0]) {
                try {
                    if (args[0].startsWith('https://gift.truemoney.com/campaign/?v=')) {
                        if (args[0].length == 57) {
                            let regex = /(^https:\/\/gift\.truemoney\.com\/campaign\/)\?v=([A-Za-z0-9]{18})/;
                            code = new RegExp(regex).exec(args[0]);
                            code = code[2]
                        
                            axios({
                                method: 'get',
                                url: 'http://karuma.servegame.com:4433/?link=' + code +'&phone='+config.phonenumber,
                            }).then(res=>{
                                if (res.data.code == '200') {
                                    client.channels.cache.get(config.notify_id).send({embeds: [successEmbed(`ผู้ใช้ : <@${message.author.id}> \nโดเนท : ${res.data.amount} บาท`)]})
                                    m.edit({ embeds: [successEmbed("[SUCCESS] จำนวนเงิน "+res.data.amount)] })
                                }else if (res.data.status == "VOUCHER_NOT_FOUND") {
                                    m.edit({ embeds: [errorEmbed("ลิ้งซองไม่ถูกต้อง")] })
                                }else if (res.data.status == "VOUCHER_OUT_OF_STOCK") {
                                    m.edit({ embeds: [errorEmbed("ลิ้งซองถูกใช้งานไปแล้ว")] })
                                }
                            })
                        }else{
                            m.edit({ embeds: [errorEmbed("โปรดใส่ลิ้งที่ถูกต้อง")] })
                        }
                    }else{
                        m.edit({ embeds: [errorEmbed("โปรดใส่ลิ้งที่ถูกต้อง")] })
                    }
                } catch (e) {
                    m.edit({ embeds: [errorEmbed("มีบางอย่างเกิดขึ้น")] })
                }
            }else{
                m.edit({ embeds: [errorEmbed("โปรดใส่ลิ้งซองอั่งเปา")] })
            }
        })
    }
})

let Token = config.token;
client.login(Token)


