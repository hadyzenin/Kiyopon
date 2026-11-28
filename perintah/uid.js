module.exports = {
  hady: {
    nama: "uid",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: "<reply/kosong>",
    kategori: "info"
  },
  Ayanokoji: async function ({ api, event }) {
    const targetID = event.repliedSender || event.senderID;

    return api.sendMessage(
      `${targetID}`,
      event.threadID,
      event.messageID
    );
  }
};
