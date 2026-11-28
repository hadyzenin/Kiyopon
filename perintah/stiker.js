module.exports = {
    hady: {
        nama: "stiker",
        kuldown: 20,
        peran: 0,
        penulis: "Hady Zen",
        tutor: "<balas foto/video>",
        kategori: "alat",
        harga: 2
    },
    Ayanokoji: async function ({ api, event, args, getData, setUser }) {
        const { threadID, messageID } = event;
        const media = event.repliedMedia || event.media;
        if (!media) {
            return api.sendMessage("Balas *foto/video* yang mau dijadikan stiker.", threadID, messageID);
        }

        const userData = getData(event.senderID);
        if (!userData || (userData.yen || 0) < 2) {
            return api.sendMessage("Yen kamu tidak cukup, butuh *2 yen* buat bikin stiker.", threadID, messageID);
        }

        const isVideo = media.type?.includes('video') || media.mimetype?.includes('video') || media.mimetype?.includes('mp4');
        await api.sendSticker(media.buffer, threadID, messageID, isVideo);

        setUser(event.senderID, 'yen', (userData.yen || 0) - 2);
    }
};
