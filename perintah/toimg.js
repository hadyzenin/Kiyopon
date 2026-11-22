module.exports = {
    hady: {
        nama: "toimg",
        kuldown: 15,
        peran: 0,
        penulis: "Hady Zen",
        tutor: ".toimg <balas ke stiker>"
    },

    Ayanokoji: async function ({ api, event }) {
        const { threadID, messageID } = event;
        const media = event.repliedMedia || event.media;
        if (!media) {
            return api.sendMessage("Balas dulu ke stikernya.", threadID, messageID);
        }
        return api.sendImage(media.buffer, threadID, messageID);
    }
};
