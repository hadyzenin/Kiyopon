module.exports = {
    hady: {
        nama: "stiker",
        kuldown: 15,
        peran: 0,
        penulis: "Hady Zen",
        tutor: ".stiker <balas foto/video>"
    },
    Ayanokoji: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const media = event.repliedMedia || event.media;
        if (!media) {
            return api.sendMessage("Balas foto/video yang mau dijadikan stiker.", threadID, messageID);
        }
        const isVideo = media.type?.includes('video') || media.mimetype?.includes('video') || media.mimetype?.includes('mp4');
        return api.sendSticker(media.buffer, threadID, messageID, isVideo);
    }
};
