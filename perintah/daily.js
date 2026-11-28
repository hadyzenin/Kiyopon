const moment = require('moment-timezone');

module.exports = {
  hady: { 
    nama: "daily", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: "",
    kategori: "game"
  }, 
  
  Ayanokoji: async function ({ api, event, getData, setUser }) {
    const hady = moment.tz("Asia/Jakarta").format("YYYY-MM-DD");
    const { yen, exp, daily } = getData(event.senderID);
    
    if (daily == null || daily !== hady) { 
      const duit = Math.ceil(Math.random() * 20);
      setUser(event.senderID, 'yen', yen + duit);
      setUser(event.senderID, 'exp', exp + 50);
      setUser(event.senderID, 'daily', hady);
      api.sendMessage(`Kamu berhasil mengklaim *${duit} yen* dan *50 exp*.`, event.threadID, event.messageID);
    } else {
      api.sendMessage('Kamu sudah mengklaim hadiah harian.', event.threadID, event.messageID);
    }
  }
};
