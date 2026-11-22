module.exports = {
  hady: {
    nama: "uid",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: ".uid"
  },
  Ayanokoji: async function ({ api, event }) {
    const { threadID, messageID } = event;
    return api.sendMessage(event.senderID,
      threadID, messageID
    );
  }
};
