const fs = require('fs/promises');
const path = require('path');

module.exports = {
  hady: {
    nama: "menu",
    kategori: "info",
    penulis: "Hady Zen",
    peran: 0,
    kuldown: 10,
    tutor: ".menu <kosong/perintah>"
  },

  Ayanokoji: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const folder = path.join(__dirname);
    const files = await fs.readdir(folder);
    const jsFiles = files.filter(f => path.extname(f) === '.js');
    jsFiles.sort();

    const commandList = {};
    const commandInfo = {};

    for (const file of jsFiles) {
      try {
        const filePath = path.join(folder, file);
        delete require.cache[require.resolve(filePath)];
        const cmd = require(filePath);
        if (!cmd.hady?.nama) continue;

        const hady = cmd.hady;
        const namaCmd = hady.nama;
        if (args[0] && args[0].toLowerCase() === namaCmd.toLowerCase()) {
          commandInfo[namaCmd] = hady;
          break;
        }
        const kategori = (hady.kategori || "cmd").toLowerCase();
        if (!commandList[kategori]) commandList[kategori] = [];
        commandList[kategori].push(namaCmd);

      } catch (e) {}
    }
    if (args[0] && commandInfo[args[0].toLowerCase()]) {
      const info = commandInfo[args[0].toLowerCase()];
      return api.sendMessage(
        `*Info perintah*\n\n` +
        `- Nama: ${info.nama}\n` +
        `- Penulis: ${info.penulis || "-"}\n` +
        `- Peran: ${info.peran}\n` +
        `- Kuldown: ${info.kuldown} detik\n` +
        `- Harga: ${info.harga ? info.harga + " yen" : "Gratis"}\n` +
        `- Tutor: ${info.tutor || "-"}`,
        threadID, messageID
      );
    } else if (args[0]) {
      return api.sendMessage(`Perintah .${args[0]} tidak ada.`, threadID, messageID);
    } else {
      const description = `Gunakan ${global.Ayanokoji.awalan}*menu <perintah>* untuk informasi lebih lanjut.`;
      let kategoriText = "";
      for (const kategori of Object.keys(commandList).sort()) {
        kategoriText += `*${kategori.toUpperCase()}*\n${commandList[kategori].join(', ')}\n\n`;
      }
      const message = `${kategoriText}${description}`;
      return api.sendMessage(message, threadID, messageID);
    }
  }
};
