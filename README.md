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
Login hanya bisa menggunakan kode pairing <br>
Masukkan nomor dengan format 628XX bukan 08XX atau +628XX <br><br>
Mentahan perintah 
```hady
module.exports = {
  hady: {
    nama: "contoh",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: ".contoh <kosong/reply/cari/jumlah>",
    kategori: "info",
    harga: 0
  },
  Ayanokoji: async function ({ api, event, args, getData, setData }) {
    api.sendMessage("text", event.threadID, event.messageID)
    api.sendImage("image","text", event.threadID, event.messageID)
    api.sendVideo("video", "text", event.threadID, event.messageID)
    api.sendSticker("stiker", event.threadID, event.messageID)
    api.sendAudio(event.threadID, event.messageID)
    api.sendDocument("file", event.threadID, event.messageID)
    api.setMessageReaction("emot", event.threadID, event.messageID)
    api.getThreadInfo(event.threadID)
    getData(event.senderID)
    setData(event.senderID, {})
    event.threadID
    event.messageID
    event.senderID
    event.body
    event.isGroup
    event.isFromMe
    event.isReply
    event.repliedSender
    event.repliedMedia
    event.attachments
    args.join(" ")
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
