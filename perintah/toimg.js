module.exports = {
    hady: {
        nama: "toimg",
        kuldown: 20,
        peran: 0,
        penulis: "Hady Zen",
        tutor: "<balas ke stiker>",
        kategori: "alat",
        harga: 2
    },

    Ayanokoji: async function ({ api, event, getData, setUser }) {
        const { threadID, messageID } = event;
        const media = event.repliedMedia || event.media;
        if (!media) {
            return api.sendMessage("Balas dulu ke stikernya.", threadID, messageID);
        }

        const userData = getData(event.senderID);
        if (!userData || (userData.yen || 0) < 2) {
            return api.sendMessage("Yen kamu tidak cukup, butuh *2 yen* buat convert stiker.", threadID, messageID);
        }

        await api.sendImage(media.buffer, threadID, messageID);

        setUser(event.senderID, 'yen', (userData.yen || 0) - 2);
    }
};
