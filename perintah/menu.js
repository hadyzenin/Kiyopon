const fs = require('fs/promises');
const path = require('path');

module.exports = {
  hady: {
    nama: "menu",
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

    const commandList = { user: [], adminGroups: [], adminBot: [] };
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
        const peran = parseInt(hady.peran, 10);
        if (peran === 0) commandList.user.push(namaCmd);
        else if (peran === 1) commandList.adminGroups.push(namaCmd);
        else if (peran === 2) commandList.adminBot.push(namaCmd);

      } catch (e) {}
    }
    if (args[0] && commandInfo[args[0].toLowerCase()]) {
      const info = commandInfo[args[0].toLowerCase()];
      return api.sendMessage(
        `𝗜𝗻𝗳𝗼 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵\n\n` +
        `- Nama: ${info.nama}\n` +
        `- Penulis: ${info.penulis || "-"}\n` +
        `- Peran: ${info.peran}\n` +
        `- Kuldown: ${info.kuldown} detik\n` +
        `- Tutor: ${info.tutor || "-"}`,
        threadID, messageID
      );
    } else if (args[0]) {
      return api.sendMessage(`Perintah .${args[0]} tidak ada.`, threadID, messageID);
    } else {
      const description = `Gunakan ${global.Ayanokoji.awalan}𝗺𝗲𝗻𝘂 <𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵> untuk informasi lebih lanjut.`;
      const message = `𝗨𝗦𝗘𝗥\n${commandList.user.join(', ') || 'Tidak ada perintah.'}\n\n𝗔𝗗𝗠𝗜𝗡 𝗚𝗖\n${commandList.adminGroups.join(', ') || 'Tidak ada perintah.'}\n\n𝗔𝗗𝗠𝗜𝗡 𝗕𝗢𝗧\n${commandList.adminBot.join(', ') || 'Tidak ada perintah.'}\n\n\n${description}`;
      return api.sendMessage(message, threadID, messageID);
    }
  }
};
