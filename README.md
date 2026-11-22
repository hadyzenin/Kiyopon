![ayano](https://raw.githubusercontent.com/hadyzenin/Ayanokoji-Kiyotaka/refs/heads/main/assets/ayanokoji.png) 

<h1 align="center">KIYOPON V1 </h1>

> Chatbot for WhatsApp ❤️💙 <br>

![hady](https://skillicons.dev/icons?i=html,css,js,nodejs,bash&theme=dark) 

## OWNER 

Nama: Hady <br>
Tiktok: https://www.tiktok.com/@dyzeeeen <br>
Github: https://github.com/HadyZen <br>
Github: https://github.com/hadyzenin

## INFO

Versi nodejs harus v20 <br>
Login menggunakan kode pairing <br>
Data ada di hady.db format data json <br>
Mentahan perintah 
```hady
module.exports = {
  hady: {
    nama: "contoh",
    penulis: "Hady Zen",
    kuldown: 5,
    peran: 0,
    tutor: "daftar full fungsi"
  },
  Ayanokoji: async function ({ api, event, args, getData, setData, getAllData }) {
    api.sendMessage("", event.threadID, event.messageID)
    api.sendMessage("", event.threadID, null)
    api.sendImage("", "", event.threadID, event.messageID)
    api.sendImage("", event.threadID)
    api.sendImage("", event.threadID, event.messageID)
    api.sendVideo("", "", event.threadID, event.messageID)
    api.sendVideo("", event.threadID)
    api.sendVideo("", event.threadID, event.messageID)
    api.sendSticker("", event.threadID, event.messageID)
    api.sendSticker("", event.threadID)
    api.sendAudio("", event.threadID, event.messageID, false)
    api.sendAudio("", event.threadID, event.messageID, true)
    api.sendFile("", "", event.threadID, event.messageID)
    api.sendFile("", "", event.threadID)
    api.react("", event.threadID, event.messageID)
    api.deleteMessage(event.threadID, event.messageID)
    api.sendTyping(event.threadID)
    api.getGroupInfo(event.threadID)
    api.getProfilePicture(event.senderID)
    api.getProfilePicture(event.threadID)
    getData(event.senderID)
    setData(event.senderID, {})
    getAllData()
    event.threadID
    event.messageID
    event.senderID
    event.isGroup
    event.type
    event.reply
    event.replySender
    args.join(" ")
    args[0]
    args.slice(1).join(" ")
  }
};
```

## HOSTING 

Rekomendasi hosting gratis 24/7
```bot hosting 
https://bot-hosting.net/?aff=1386352043207430254
```
```katabump
https://katabump.com/en
```
