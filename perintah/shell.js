const { exec } = require("child_process");

module.exports = {
  hady: {
    nama: "shell",
    kuldown: 6,
    peran: 2,
    penulis: "Hady Zen",
    tutor: ".shell <kode>",
  },

  Ayanokoji: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args[0]) {
      return api.sendMessage(
        "Kamu belum memasukkan kode terminal nya.",
        threadID,
        messageID
      );
    }
    const perintah = args.join(" ");
    exec(perintah, (error, stdout, stderr) => {
      let hadi = "";

      if (error) {
        hadi = error.message;
      } else if (stdout) {
        hadi = stdout;
      } else if (stderr) {
        hadi = stderr;
      }

      if (!hadi) {
        hadi = "Tidak ada output.";
      }
      return api.sendMessage(hadi, threadID, messageID);
    });
  },
};
