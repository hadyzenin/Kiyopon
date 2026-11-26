const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  hady: {
    nama: "musik",
    penulis: "Hady Zen",
    kuldown: 30,
    peran: 0,
    tutor: ".musik <judul>",
    kategori: "media",
    harga: 2
  },

  Ayanokoji: async function ({ api, event, args, getData, setUser }) {
    const query = args.join(" ");
    if (!query) return api.sendMessage("Berikan saya judul musiknya, contoh: musik mangu", event.threadID, event.messageID);

    const userData = getData(event.senderID);
    if (!userData || (userData.yen || 0) < 2) {
      return api.sendMessage("Yen kamu tidak cukup, butuh 2 yen buat musik.", event.threadID, event.messageID);
    }

    try {
      const search = await axios.get(`https://hady-six.vercel.app/hady?q=${encodeURIComponent(query)}`);
      const musik = search.data?.songs?.[0];
      if (!musik || !musik.videoId) return api.sendMessage("Musik tidak ditemukan.", event.threadID, event.messageID);

      const streamRes = await axios.get(`https://music.zedxnexus.my.id/api/stream?videoId=${musik.videoId}`);
      const audioUrl = streamRes.data?.stream_data || streamRes.data?.download?.url;
      const folder = path.join(process.cwd(), "hady-zen", "assets");
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      const filePath = path.join(folder, `musik_${Date.now()}.mp3`);
      const dl = await axios.get(audioUrl, { responseType: "arraybuffer", timeout: 60000 });
      fs.writeFileSync(filePath, Buffer.from(dl.data));
      await api.sendAudio({ stream: fs.createReadStream(filePath), fileName: `${musik.name}.mp3` }, event.threadID, event.messageID);

      setUser(event.senderID, 'yen', (userData.yen || 0) - 2);

      setTimeout(() => {
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}
      }, 5000);
    } catch (err) {
      api.sendMessage("Gagal mengambil musik, coba judul lain.", event.threadID, event.messageID);
    }
  }
};
